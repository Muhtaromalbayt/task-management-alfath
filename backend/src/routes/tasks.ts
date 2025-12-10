import { Hono } from 'hono';
import type { Env, Task } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateId } from '../utils/helpers';

const tasks = new Hono<{ Bindings: Env }>();

tasks.use('*', authMiddleware);

// GET /tasks - Get all tasks (with optional filters)
tasks.get('/', async (c) => {
    try {
        const columnId = c.req.query('column_id');
        const assigneeId = c.req.query('assignee_id');

        let query = `
            SELECT t.*, u.name as assignee_name, c.title as column_title
            FROM tasks t
            LEFT JOIN users u ON t.assignee_id = u.id
            LEFT JOIN columns c ON t.column_id = c.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (columnId) {
            query += ' AND t.column_id = ?';
            params.push(columnId);
        }
        if (assigneeId) {
            query += ' AND t.assignee_id = ?';
            params.push(assigneeId);
        }

        query += ' ORDER BY t."order"';

        const { results } = await c.env.DB.prepare(query).bind(...params).all<Task>();

        return c.json({ success: true, data: results });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch tasks' }, 500);
    }
});

// GET /tasks/:id
tasks.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        const task = await c.env.DB.prepare(
            `SELECT t.*, u.name as assignee_name
             FROM tasks t
             LEFT JOIN users u ON t.assignee_id = u.id
             WHERE t.id = ?`
        ).bind(id).first<Task>();

        if (!task) {
            return c.json({ success: false, error: 'Task not found' }, 404);
        }

        return c.json({ success: true, data: task });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch task' }, 500);
    }
});

// POST /tasks - Create task
tasks.post('/', async (c) => {
    try {
        const { content, priority, column_id, assignee_id, due_date } = await c.req.json();

        if (!content || !column_id) {
            return c.json({ success: false, error: 'Content and column_id are required' }, 400);
        }

        // Get max order in column
        const maxOrder = await c.env.DB.prepare(
            'SELECT MAX("order") as max_order FROM tasks WHERE column_id = ?'
        ).bind(column_id).first<{ max_order: number | null }>();

        const order = (maxOrder?.max_order ?? -1) + 1;
        const taskId = generateId('task');

        await c.env.DB.prepare(
            `INSERT INTO tasks (id, content, priority, column_id, assignee_id, due_date, "order")
             VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(taskId, content, priority || 'Medium', column_id, assignee_id || null, due_date || null, order).run();

        const task = await c.env.DB.prepare(
            `SELECT t.*, u.name as assignee_name
             FROM tasks t
             LEFT JOIN users u ON t.assignee_id = u.id
             WHERE t.id = ?`
        ).bind(taskId).first<Task>();

        return c.json({ success: true, data: task }, 201);
    } catch (error) {
        return c.json({ success: false, error: 'Failed to create task' }, 500);
    }
});

// PUT /tasks/:id - Update task
tasks.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const updates = await c.req.json();

        const allowedFields = ['content', 'priority', 'assignee_id', 'due_date'];
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
            `UPDATE tasks SET ${setClause.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        const task = await c.env.DB.prepare(
            `SELECT t.*, u.name as assignee_name
             FROM tasks t
             LEFT JOIN users u ON t.assignee_id = u.id
             WHERE t.id = ?`
        ).bind(id).first<Task>();

        return c.json({ success: true, data: task });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to update task' }, 500);
    }
});

// PATCH /tasks/:id/move - Move task to different column or reorder
tasks.patch('/:id/move', async (c) => {
    try {
        const id = c.req.param('id');
        const { column_id, order } = await c.req.json();

        if (column_id === undefined && order === undefined) {
            return c.json({ success: false, error: 'column_id or order is required' }, 400);
        }

        const updates: string[] = [];
        const values: any[] = [];

        if (column_id !== undefined) {
            updates.push('column_id = ?');
            values.push(column_id);
        }
        if (order !== undefined) {
            updates.push('"order" = ?');
            values.push(order);
        }

        updates.push("updated_at = datetime('now')");
        values.push(id);

        await c.env.DB.prepare(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        const task = await c.env.DB.prepare(
            'SELECT * FROM tasks WHERE id = ?'
        ).bind(id).first<Task>();

        return c.json({ success: true, data: task });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to move task' }, 500);
    }
});

// DELETE /tasks/:id
tasks.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        await c.env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();

        return c.json({ success: true, message: 'Task deleted' });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to delete task' }, 500);
    }
});

export default tasks;
