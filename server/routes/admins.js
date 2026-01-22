import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all admins
router.get('/', async (req, res) => {
    try {
        const { role, is_active } = req.query;

        let queryText = `
      SELECT id, email, name, role, department, is_active, created_at, last_login
      FROM admins 
      WHERE 1=1
    `;
        const params = [];

        if (role) {
            params.push(role);
            queryText += ` AND role = $${params.length}`;
        }

        if (is_active !== undefined) {
            params.push(is_active === 'true');
            queryText += ` AND is_active = $${params.length}`;
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admins' });
    }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT id, email, name, role, department, permissions, is_active, created_at, last_login
       FROM admins 
       WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admin' });
    }
});

// Create new admin
router.post('/', async (req, res) => {
    try {
        const { email, password, name, role, department, permissions } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
        }

        const result = await query(
            `INSERT INTO admins (email, password, name, role, department, permissions)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, role, department, created_at`,
            [email, password, name, role || 'admin', department, JSON.stringify(permissions)]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating admin:', error);
        if (error.code === '23505') {
            res.status(409).json({ success: false, error: 'Email already exists' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to create admin' });
        }
    }
});

// Update admin
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, department, permissions, is_active } = req.body;

        const result = await query(
            `UPDATE admins 
       SET name = COALESCE($1, name),
           role = COALESCE($2, role),
           department = COALESCE($3, department),
           permissions = COALESCE($4, permissions),
           is_active = COALESCE($5, is_active)
       WHERE id = $6
       RETURNING id, email, name, role, department, permissions, is_active`,
            [name, role, department, JSON.stringify(permissions), is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ success: false, error: 'Failed to update admin' });
    }
});

// Update last login
router.put('/:id/last-login', async (req, res) => {
    try {
        const { id } = req.params;

        await query(
            'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [id]
        );

        res.json({ success: true, message: 'Last login updated' });
    } catch (error) {
        console.error('Error updating last login:', error);
        res.status(500).json({ success: false, error: 'Failed to update last login' });
    }
});

// Delete admin
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM admins WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }

        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ success: false, error: 'Failed to delete admin' });
    }
});

export default router;
