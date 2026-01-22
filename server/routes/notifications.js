import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get user notifications
router.get('/user/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const { read, category, type } = req.query;

        let queryText = `
      SELECT * FROM notifications 
      WHERE user_id = $1
    `;
        const params = [user_id];

        if (read !== undefined) {
            params.push(read === 'true');
            queryText += ` AND read = $${params.length}`;
        }

        if (category) {
            params.push(category);
            queryText += ` AND category = $${params.length}`;
        }

        if (type) {
            params.push(type);
            queryText += ` AND type = $${params.length}`;
        }

        queryText += ' ORDER BY created_at DESC LIMIT 50';

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
});

// Get unread count
router.get('/user/:user_id/unread-count', async (req, res) => {
    try {
        const { user_id } = req.params;

        const result = await query(
            'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = $1 AND read = false',
            [user_id]
        );

        res.json({ success: true, data: { unread_count: parseInt(result.rows[0].unread_count) } });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
    }
});

// Create notification
router.post('/', async (req, res) => {
    try {
        const {
            user_id, title, message, type, category,
            related_entity_type, related_entity_id,
            action_link, action_text, priority, expires_at
        } = req.body;

        if (!user_id || !title || !message) {
            return res.status(400).json({ success: false, error: 'User ID, title, and message are required' });
        }

        const result = await query(
            `INSERT INTO notifications (
        user_id, title, message, type, category,
        related_entity_type, related_entity_id,
        action_link, action_text, priority, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
            [
                user_id, title, message, type || 'info', category,
                related_entity_type, related_entity_id,
                action_link, action_text, priority || 'normal', expires_at
            ]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, error: 'Failed to create notification' });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `UPDATE notifications 
       SET read = true, read_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read for a user
router.put('/user/:user_id/read-all', async (req, res) => {
    try {
        const { user_id } = req.params;

        await query(
            `UPDATE notifications 
       SET read = true, read_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND read = false`,
            [user_id]
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all notifications as read' });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM notifications WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
});

export default router;
