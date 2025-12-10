import { Hono } from 'hono';
import type { Env, Notification } from '../types';
import { authMiddleware } from '../middleware/auth';

const notifications = new Hono<{ Bindings: Env }>();

notifications.use('*', authMiddleware);

// GET /notifications - Get user's notifications
notifications.get('/', async (c) => {
    try {
        const user = c.get('user');

        const { results } = await c.env.DB.prepare(
            `SELECT * FROM notifications 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 50`
        ).bind(user.userId).all<Notification>();

        return c.json({ success: true, data: results });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch notifications' }, 500);
    }
});

// PATCH /notifications/:id/read - Mark as read
notifications.patch('/:id/read', async (c) => {
    try {
        const id = c.req.param('id');
        const user = c.get('user');

        await c.env.DB.prepare(
            'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?'
        ).bind(id, user.userId).run();

        return c.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to update notification' }, 500);
    }
});

// PATCH /notifications/read-all - Mark all as read
notifications.patch('/read-all', async (c) => {
    try {
        const user = c.get('user');

        await c.env.DB.prepare(
            'UPDATE notifications SET read = 1 WHERE user_id = ?'
        ).bind(user.userId).run();

        return c.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to update notifications' }, 500);
    }
});

export default notifications;
