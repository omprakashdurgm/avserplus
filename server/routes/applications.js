import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all applications with filters
router.get('/', async (req, res) => {
    try {
        const { user_id, vacancy_id, application_status, verification_status, is_shortlisted, is_selected } = req.query;

        let queryText = `
      SELECT a.*, 
             u.name as applicant_name, u.email as applicant_email,
             v.post_name, v.department, v.vacancy_id as vacancy_code
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN vacancies v ON a.vacancy_id = v.id
      WHERE 1=1
    `;
        const params = [];

        if (user_id) {
            params.push(user_id);
            queryText += ` AND a.user_id = $${params.length}`;
        }

        if (vacancy_id) {
            params.push(vacancy_id);
            queryText += ` AND a.vacancy_id = $${params.length}`;
        }

        if (application_status) {
            params.push(application_status);
            queryText += ` AND a.application_status = $${params.length}`;
        }

        if (verification_status) {
            params.push(verification_status);
            queryText += ` AND a.verification_status = $${params.length}`;
        }

        if (is_shortlisted !== undefined) {
            params.push(is_shortlisted === 'true');
            queryText += ` AND a.is_shortlisted = $${params.length}`;
        }

        if (is_selected !== undefined) {
            params.push(is_selected === 'true');
            queryText += ` AND a.is_selected = $${params.length}`;
        }

        queryText += ' ORDER BY a.submitted_at DESC';

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch applications' });
    }
});

// Get application by ID with full details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get application details
        const appResult = await query(
            `SELECT a.*, 
              u.name as applicant_name, u.email as applicant_email, u.mobile, u.category, u.gender,
              v.post_name, v.department, v.vacancy_id as vacancy_code,
              v.application_fee_general, v.application_fee_obc, v.application_fee_sc, v.application_fee_st,
              admin.name as verified_by_name
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN vacancies v ON a.vacancy_id = v.id
       LEFT JOIN admins admin ON a.verified_by = admin.id
       WHERE a.id = $1`,
            [id]
        );

        if (appResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        // Get application timeline
        const timelineResult = await query(
            `SELECT * FROM application_timeline 
       WHERE application_id = $1 
       ORDER BY created_at ASC`,
            [id]
        );

        // Get documents
        const documentsResult = await query(
            `SELECT * FROM documents 
       WHERE application_id = $1`,
            [id]
        );

        // Get payment details
        const paymentResult = await query(
            `SELECT * FROM payments 
       WHERE application_id = $1 
       ORDER BY created_at DESC LIMIT 1`,
            [id]
        );

        const application = {
            ...appResult.rows[0],
            timeline: timelineResult.rows,
            documents: documentsResult.rows,
            payment: paymentResult.rows[0] || null
        };

        res.json({ success: true, data: application });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch application' });
    }
});

// Create new application
router.post('/', async (req, res) => {
    try {
        const {
            user_id, vacancy_id, personal_details, contact_info, qualifications,
            experience, documents, payment_amount, ip_address
        } = req.body;

        if (!user_id || !vacancy_id) {
            return res.status(400).json({ success: false, error: 'User ID and Vacancy ID are required' });
        }

        // Generate application number
        const appNoResult = await query(
            `SELECT 'APP' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(NEXTVAL('applications_id_seq')::TEXT, 6, '0') as app_no`
        );
        const application_no = appNoResult.rows[0].app_no;

        const result = await query(
            `INSERT INTO applications (
        application_no, user_id, vacancy_id, personal_details, contact_info,
        qualifications, experience, documents, payment_amount, ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
            [
                application_no, user_id, vacancy_id,
                JSON.stringify(personal_details), JSON.stringify(contact_info),
                JSON.stringify(qualifications), JSON.stringify(experience),
                JSON.stringify(documents), payment_amount, ip_address
            ]
        );

        // Create initial timeline entry
        await query(
            `INSERT INTO application_timeline (application_id, stage, status, remarks)
       VALUES ($1, 'application_received', 'completed', 'Application submitted successfully')`,
            [result.rows[0].id]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating application:', error);
        if (error.code === '23505') { // Unique violation
            res.status(409).json({ success: false, error: 'Application already exists for this vacancy' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to create application' });
        }
    }
});

// Update application status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { application_status, current_stage, remarks, admin_id } = req.body;

        const result = await query(
            `UPDATE applications 
       SET application_status = COALESCE($1, application_status),
           current_stage = COALESCE($2, current_stage)
       WHERE id = $3
       RETURNING *`,
            [application_status, current_stage, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        // Add timeline entry
        if (current_stage) {
            await query(
                `INSERT INTO application_timeline (application_id, stage, status, remarks, actor_id)
         VALUES ($1, $2, 'completed', $3, $4)`,
                [id, current_stage, remarks || '', admin_id]
            );
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ success: false, error: 'Failed to update application status' });
    }
});

// Verify application
router.put('/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const { verification_status, verified_by, verification_remarks, is_eligible, eligibility_remarks } = req.body;

        const result = await query(
            `UPDATE applications 
       SET verification_status = $1,
           verified_by = $2,
           verification_date = CURRENT_TIMESTAMP,
           verification_remarks = $3,
           is_eligible = $4,
           eligibility_remarks = $5
       WHERE id = $6
       RETURNING *`,
            [verification_status, verified_by, verification_remarks, is_eligible, eligibility_remarks, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        // Add timeline entry
        await query(
            `INSERT INTO application_timeline (application_id, stage, status, remarks, actor_id)
       VALUES ($1, 'verification', $2, $3, $4)`,
            [id, verification_status === 'verified' ? 'completed' : 'failed', verification_remarks, verified_by]
        );

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error verifying application:', error);
        res.status(500).json({ success: false, error: 'Failed to verify application' });
    }
});

// Update payment status
router.put('/:id/payment', async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, payment_details } = req.body;

        const result = await query(
            `UPDATE applications 
       SET payment_status = $1,
           payment_details = $2
       WHERE id = $3
       RETURNING *`,
            [payment_status, JSON.stringify(payment_details), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ success: false, error: 'Failed to update payment status' });
    }
});

// Delete application
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ success: false, error: 'Failed to delete application' });
    }
});

// Get application statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const { vacancy_id } = req.query;

        let queryText = `
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN application_status = 'submitted' THEN 1 END) as submitted,
        COUNT(CASE WHEN application_status = 'under_review' THEN 1 END) as under_review,
        COUNT(CASE WHEN application_status = 'shortlisted' THEN 1 END) as shortlisted,
        COUNT(CASE WHEN application_status = 'selected' THEN 1 END) as selected,
        COUNT(CASE WHEN application_status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_applications,
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_applications
      FROM applications
      WHERE 1=1
    `;
        const params = [];

        if (vacancy_id) {
            params.push(vacancy_id);
            queryText += ` AND vacancy_id = $${params.length}`;
        }

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching application statistics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
});

export default router;
