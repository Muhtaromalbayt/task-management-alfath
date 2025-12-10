import { Hono } from 'hono';
import type { Env, User } from '../types';
import { authMiddleware } from '../middleware/auth';

const users = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
users.use('*', authMiddleware);

// GET /users - Get all users
users.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            `SELECT u.id, u.email, u.name, u.role, u.avatar, u.division_id, d.name as division_name
             FROM users u
             LEFT JOIN divisions d ON u.division_id = d.id
             ORDER BY u.name`
        ).all<User & { division_name?: string }>();

        return c.json({ success: true, data: results });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch users' }, 500);
    }
});

// GET /users/:id - Get user by ID
users.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        const user = await c.env.DB.prepare(
            `SELECT u.id, u.email, u.name, u.role, u.avatar, u.division_id, d.name as division_name
             FROM users u
             LEFT JOIN divisions d ON u.division_id = d.id
             WHERE u.id = ?`
        ).bind(id).first<User & { division_name?: string }>();

        if (!user) {
            return c.json({ success: false, error: 'User not found' }, 404);
        }

        return c.json({ success: true, data: user });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch user' }, 500);
    }
});

// PUT /users/:id - Update user
users.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const currentUser = c.get('user');
        const updates = await c.req.json();

        // Users can only update themselves unless admin
        if (currentUser.userId !== id && currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
            return c.json({ success: false, error: 'Forbidden' }, 403);
        }

        const allowedFields = ['name', 'avatar', 'division_id'];
        const setClause: string[] = [];
        const values: any[] = [];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                setClause.push(`${field} = ?`);
                values.push(updates[field]);
            }
        }

        if (setClause.length === 0) {
            return c.json({ success: false, error: 'No valid fields to update' }, 400);
        }

        setClause.push("updated_at = datetime('now')");
        values.push(id);

        await c.env.DB.prepare(
            `UPDATE users SET ${setClause.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        const user = await c.env.DB.prepare(
            'SELECT id, email, name, role, avatar, division_id FROM users WHERE id = ?'
        ).bind(id).first<User>();

        return c.json({ success: true, data: user });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to update user' }, 500);
    }
});

export default users;
