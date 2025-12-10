import { Hono } from 'hono';
import type { Env, Column } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateId } from '../utils/helpers';

const columns = new Hono<{ Bindings: Env }>();

columns.use('*', authMiddleware);

// GET /columns - Get columns by project
columns.get('/', async (c) => {
    try {
        const projectId = c.req.query('project_id');

        if (!projectId) {
            return c.json({ success: false, error: 'project_id is required' }, 400);
        }

        const { results } = await c.env.DB.prepare(
            'SELECT * FROM columns WHERE project_id = ? ORDER BY "order"'
        ).bind(projectId).all<Column>();

        return c.json({ success: true, data: results });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch columns' }, 500);
    }
});

// POST /columns - Create column
columns.post('/', async (c) => {
    try {
        const { title, project_id } = await c.req.json();

        if (!title || !project_id) {
            return c.json({ success: false, error: 'Title and project_id are required' }, 400);
        }

        // Get max order
        const maxOrder = await c.env.DB.prepare(
            'SELECT MAX("order") as max_order FROM columns WHERE project_id = ?'
        ).bind(project_id).first<{ max_order: number | null }>();

        const order = (maxOrder?.max_order ?? -1) + 1;
        const columnId = generateId('col');

        await c.env.DB.prepare(
            'INSERT INTO columns (id, title, "order", project_id) VALUES (?, ?, ?, ?)'
        ).bind(columnId, title, order, project_id).run();

        const column = await c.env.DB.prepare(
            'SELECT * FROM columns WHERE id = ?'
        ).bind(columnId).first<Column>();

        return c.json({ success: true, data: column }, 201);
    } catch (error) {
        return c.json({ success: false, error: 'Failed to create column' }, 500);
    }
});

// PUT /columns/:id - Update column
columns.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const { title } = await c.req.json();

        if (!title) {
            return c.json({ success: false, error: 'Title is required' }, 400);
        }

        await c.env.DB.prepare(
            'UPDATE columns SET title = ? WHERE id = ?'
        ).bind(title, id).run();

        const column = await c.env.DB.prepare(
            'SELECT * FROM columns WHERE id = ?'
        ).bind(id).first<Column>();

        return c.json({ success: true, data: column });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to update column' }, 500);
    }
});

// PATCH /columns/reorder - Reorder columns
columns.patch('/reorder', async (c) => {
    try {
        const { columns: columnOrders } = await c.req.json() as { columns: { id: string; order: number }[] };

        if (!columnOrders || !Array.isArray(columnOrders)) {
            return c.json({ success: false, error: 'columns array is required' }, 400);
        }

        for (const col of columnOrders) {
            await c.env.DB.prepare(
                'UPDATE columns SET "order" = ? WHERE id = ?'
            ).bind(col.order, col.id).run();
        }

        return c.json({ success: true, message: 'Columns reordered' });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to reorder columns' }, 500);
    }
});

// DELETE /columns/:id
columns.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        await c.env.DB.prepare('DELETE FROM columns WHERE id = ?').bind(id).run();

        return c.json({ success: true, message: 'Column deleted' });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to delete column' }, 500);
    }
});

export default columns;
