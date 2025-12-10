import { Hono } from 'hono';
import type { Env, Division } from '../types';
import { authMiddleware } from '../middleware/auth';

const divisions = new Hono<{ Bindings: Env }>();

divisions.use('*', authMiddleware);

// GET /divisions - Get all divisions with member count
divisions.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            `SELECT d.*, 
                    (SELECT COUNT(*) FROM users WHERE division_id = d.id) as member_count
             FROM divisions d
             ORDER BY d.name`
        ).all<Division & { member_count: number }>();

        return c.json({ success: true, data: results });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch divisions' }, 500);
    }
});

// GET /divisions/:id - Get division with members
divisions.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        const division = await c.env.DB.prepare(
            'SELECT * FROM divisions WHERE id = ?'
        ).bind(id).first<Division>();

        if (!division) {
            return c.json({ success: false, error: 'Division not found' }, 404);
        }

        const { results: members } = await c.env.DB.prepare(
            'SELECT id, name, email, role, avatar FROM users WHERE division_id = ?'
        ).bind(id).all();

        return c.json({
            success: true,
            data: { ...division, members }
        });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch division' }, 500);
    }
});

export default divisions;
