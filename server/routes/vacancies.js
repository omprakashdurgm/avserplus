import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all vacancies with filters
router.get('/', async (req, res) => {
    try {
        const { status, department, employment_type, is_featured, search } = req.query;

        let queryText = `
      SELECT v.*, 
             a.name as created_by_name,
             (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count
      FROM vacancies v
      LEFT JOIN admins a ON v.created_by = a.id
      WHERE 1=1
    `;
        const params = [];

        if (status) {
            params.push(status);
            queryText += ` AND v.status = $${params.length}`;
        }

        if (department) {
            params.push(department);
            queryText += ` AND v.department = $${params.length}`;
        }

        if (employment_type) {
            params.push(employment_type);
            queryText += ` AND v.employment_type = $${params.length}`;
        }

        if (is_featured !== undefined) {
            params.push(is_featured === 'true');
            queryText += ` AND v.is_featured = $${params.length}`;
        }

        if (search) {
            params.push(`%${search}%`);
            queryText += ` AND (v.post_name ILIKE $${params.length} OR v.department ILIKE $${params.length} OR v.vacancy_id ILIKE $${params.length})`;
        }

        queryText += ' ORDER BY v.is_featured DESC, v.created_at DESC';

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch vacancies' });
    }
});

// Get active/open vacancies (public endpoint)
router.get('/public/active', async (req, res) => {
    try {
        const result = await query(
            `SELECT 
        id, vacancy_id, post_name, department, organization, location,
        employment_type, number_of_posts, application_start_date, application_deadline,
        pay_scale, min_qualification, age_limit_min, age_limit_max,
        application_fee_general, is_featured, is_urgent, views_count,
        (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count
       FROM vacancies v
       WHERE status = 'active' 
         AND application_deadline >= CURRENT_DATE
       ORDER BY is_featured DESC, is_urgent DESC, created_at DESC`
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching active vacancies:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch active vacancies' });
    }
});

// Get vacancy by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT v.*, 
              a.name as created_by_name,
              (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count,
              (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id AND application_status = 'submitted') as pending_applications,
              (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id AND is_shortlisted = true) as shortlisted_count,
              (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id AND is_selected = true) as selected_count
       FROM vacancies v
       LEFT JOIN admins a ON v.created_by = a.id
       WHERE v.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Vacancy not found' });
        }

        // Increment views count
        await query('UPDATE vacancies SET views_count = views_count + 1 WHERE id = $1', [id]);

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch vacancy' });
    }
});

// Get vacancy by vacancy_id (public code)
router.get('/code/:vacancy_id', async (req, res) => {
    try {
        const { vacancy_id } = req.params;

        const result = await query(
            `SELECT v.*, 
              (SELECT COUNT(*) FROM applications WHERE vacancy_id = v.id) as applications_count
       FROM vacancies v
       WHERE v.vacancy_id = $1`,
            [vacancy_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Vacancy not found' });
        }

        // Increment views count
        await query('UPDATE vacancies SET views_count = views_count + 1 WHERE vacancy_id = $1', [vacancy_id]);

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch vacancy' });
    }
});

// Create new vacancy
router.post('/', async (req, res) => {
    try {
        const vacancyData = req.body;

        if (!vacancyData.post_name || !vacancyData.department || !vacancyData.number_of_posts || !vacancyData.application_deadline) {
            return res.status(400).json({
                success: false,
                error: 'Post name, department, number of posts, and application deadline are required'
            });
        }

        // Generate vacancy_id if not provided
        if (!vacancyData.vacancy_id) {
            const deptCode = vacancyData.department.substring(0, 3).toUpperCase();
            const yearCode = new Date().getFullYear().toString().substring(2);
            const seqResult = await query(`SELECT NEXTVAL('vacancies_id_seq') as seq`);
            vacancyData.vacancy_id = `${deptCode}${yearCode}${String(seqResult.rows[0].seq).padStart(4, '0')}`;
        }

        // Build dynamic INSERT query
        const fields = Object.keys(vacancyData);
        const values = Object.values(vacancyData);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

        const result = await query(
            `INSERT INTO vacancies (${fields.join(', ')})
       VALUES (${placeholders})
       RETURNING *`,
            values
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating vacancy:', error);
        if (error.code === '23505') { // Unique violation
            res.status(409).json({ success: false, error: 'Vacancy ID already exists' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to create vacancy' });
        }
    }
});

// Update vacancy
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: 'No fields to update' });
        }

        // Build dynamic UPDATE query
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

        values.push(id);

        const result = await query(
            `UPDATE vacancies 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Vacancy not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating vacancy:', error);
        res.status(500).json({ success: false, error: 'Failed to update vacancy' });
    }
});

// Update vacancy status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: 'Status is required' });
        }

        const result = await query(
            `UPDATE vacancies 
       SET status = $1, 
           closed_at = CASE WHEN $1 = 'closed' THEN CURRENT_TIMESTAMP ELSE closed_at END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Vacancy not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating vacancy status:', error);
        res.status(500).json({ success: false, error: 'Failed to update vacancy status' });
    }
});

// Delete vacancy
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM vacancies WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Vacancy not found' });
        }

        res.json({ success: true, message: 'Vacancy deleted successfully' });
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        res.status(500).json({ success: false, error: 'Failed to delete vacancy' });
    }
});

// Get vacancy statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT 
        v.number_of_posts,
        v.applications_count,
        COUNT(a.id) as total_applications,
        COUNT(CASE WHEN a.payment_status = 'paid' THEN 1 END) as paid_applications,
        COUNT(CASE WHEN a.verification_status = 'verified' THEN 1 END) as verified_applications,
        COUNT(CASE WHEN a.is_shortlisted = true THEN 1 END) as shortlisted_applications,
        COUNT(CASE WHEN a.is_selected = true THEN 1 END) as selected_applications,
        COUNT(CASE WHEN a.application_status = 'rejected' THEN 1 END) as rejected_applications
       FROM vacancies v
       LEFT JOIN applications a ON v.id = a.vacancy_id
       WHERE v.id = $1
       GROUP BY v.id, v.number_of_posts, v.applications_count`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Vacancy not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching vacancy statistics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
});

export default router;
