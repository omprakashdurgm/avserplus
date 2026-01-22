import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all users with filters
router.get('/', async (req, res) => {
    try {
        const { category, gender, is_verified } = req.query;

        let queryText = `
      SELECT id, email, name, mobile, date_of_birth, category, gender,
             is_verified, email_verified, mobile_verified, profile_picture,
             created_at, last_login
      FROM users 
      WHERE 1=1
    `;
        const params = [];

        if (category) {
            params.push(category);
            queryText += ` AND category = $${params.length}`;
        }

        if (gender) {
            params.push(gender);
            queryText += ` AND gender = $${params.length}`;
        }

        if (is_verified !== undefined) {
            params.push(is_verified === 'true');
            queryText += ` AND is_verified = $${params.length}`;
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT id, email, name, mobile, date_of_birth, category, gender,
              is_verified, email_verified, mobile_verified, profile_picture,
              created_at, updated_at, last_login
       FROM users 
       WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Get user's applications
        const applicationsResult = await query(
            `SELECT a.*, v.post_name, v.department, v.vacancy_id
       FROM applications a
       LEFT JOIN vacancies v ON a.vacancy_id = v.id
       WHERE a.user_id = $1
       ORDER BY a.submitted_at DESC`,
            [id]
        );

        const user = {
            ...result.rows[0],
            applications: applicationsResult.rows
        };

        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
});

// Create new user (registration)
router.post('/', async (req, res) => {
    try {
        const { email, password, name, mobile, date_of_birth, category, gender } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
        }

        const result = await query(
            `INSERT INTO users (email, password, name, mobile, date_of_birth, category, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, mobile, category, gender, created_at`,
            [email, password, name, mobile, date_of_birth, category, gender]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') { // Unique violation
            res.status(409).json({ success: false, error: 'Email already exists' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to create user' });
        }
    }
});

// Update user profile
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile, date_of_birth, category, gender, profile_picture } = req.body;

        const result = await query(
            `UPDATE users 
       SET name = COALESCE($1, name),
           mobile = COALESCE($2, mobile),
           date_of_birth = COALESCE($3, date_of_birth),
           category = COALESCE($4, category),
           gender = COALESCE($5, gender),
           profile_picture = COALESCE($6, profile_picture),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, email, name, mobile, date_of_birth, category, gender, profile_picture, updated_at`,
            [name, mobile, date_of_birth, category, gender, profile_picture, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: 'Failed to update user' });
    }
});

// Verify user email
router.put('/:id/verify-email', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `UPDATE users 
       SET email_verified = true,
           is_verified = (email_verified = true AND mobile_verified = true),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, email_verified, mobile_verified, is_verified`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ success: false, error: 'Failed to verify email' });
    }
});

// Verify user mobile
router.put('/:id/verify-mobile', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `UPDATE users 
       SET mobile_verified = true,
           is_verified = (email_verified = true AND mobile_verified = true),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, mobile, email_verified, mobile_verified, is_verified`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error verifying mobile:', error);
        res.status(500).json({ success: false, error: 'Failed to verify mobile' });
    }
});

// Update last login
router.put('/:id/last-login', async (req, res) => {
    try {
        const { id } = req.params;

        await query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [id]
        );

        res.json({ success: true, message: 'Last login updated' });
    } catch (error) {
        console.error('Error updating last login:', error);
        res.status(500).json({ success: false, error: 'Failed to update last login' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
});

export default router;
