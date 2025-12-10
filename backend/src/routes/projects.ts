import { Hono } from 'hono';
import type { Env, Project, Column } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateId } from '../utils/helpers';

const projects = new Hono<{ Bindings: Env }>();

projects.use('*', authMiddleware);

// GET /projects - Get all projects
projects.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            `SELECT p.*, u.name as created_by_name,
                    (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
             FROM projects p
             LEFT JOIN users u ON p.created_by = u.id
             ORDER BY p.created_at DESC`
        ).all<Project & { created_by_name?: string; member_count: number }>();

        return c.json({ success: true, data: results });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch projects' }, 500);
    }
});

// GET /projects/:id - Get project with columns and tasks
projects.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        const project = await c.env.DB.prepare(
            `SELECT p.*, u.name as created_by_name
             FROM projects p
             LEFT JOIN users u ON p.created_by = u.id
             WHERE p.id = ?`
        ).bind(id).first<Project>();

        if (!project) {
            return c.json({ success: false, error: 'Project not found' }, 404);
        }

        // Get columns
        const { results: columns } = await c.env.DB.prepare(
            'SELECT * FROM columns WHERE project_id = ? ORDER BY "order"'
        ).bind(id).all<Column>();

        // Get tasks for each column
        const { results: tasks } = await c.env.DB.prepare(
            `SELECT t.*, u.name as assignee_name
             FROM tasks t
             LEFT JOIN users u ON t.assignee_id = u.id
             WHERE t.column_id IN (SELECT id FROM columns WHERE project_id = ?)
             ORDER BY t."order"`
        ).bind(id).all();

        // Get members
        const { results: members } = await c.env.DB.prepare(
            `SELECT pm.role, u.id, u.name, u.email, u.avatar
             FROM project_members pm
             JOIN users u ON pm.user_id = u.id
             WHERE pm.project_id = ?`
        ).bind(id).all();

        return c.json({
            success: true,
            data: {
                ...project,
                columns,
                tasks,
                members
            }
        });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to fetch project' }, 500);
    }
});

// POST /projects - Create project
projects.post('/', async (c) => {
    try {
        const user = c.get('user');
        const { title, description, due_date } = await c.req.json();

        if (!title) {
            return c.json({ success: false, error: 'Title is required' }, 400);
        }

        const projectId = generateId('proj');

        await c.env.DB.prepare(
            `INSERT INTO projects (id, title, description, due_date, created_by)
             VALUES (?, ?, ?, ?, ?)`
        ).bind(projectId, title, description || null, due_date || null, user.userId).run();

        // Create default columns
        const defaultColumns = [
            { id: generateId('col'), title: 'To Do', order: 0 },
            { id: generateId('col'), title: 'In Progress', order: 1 },
            { id: generateId('col'), title: 'Review', order: 2 },
            { id: generateId('col'), title: 'Done', order: 3 }
        ];

        for (const col of defaultColumns) {
            await c.env.DB.prepare(
                'INSERT INTO columns (id, title, "order", project_id) VALUES (?, ?, ?, ?)'
            ).bind(col.id, col.title, col.order, projectId).run();
        }

        // Add creator as owner
        await c.env.DB.prepare(
            'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)'
        ).bind(projectId, user.userId, 'owner').run();

        const project = await c.env.DB.prepare(
            'SELECT * FROM projects WHERE id = ?'
        ).bind(projectId).first<Project>();

        return c.json({ success: true, data: { ...project, columns: defaultColumns } }, 201);
    } catch (error) {
        return c.json({ success: false, error: 'Failed to create project' }, 500);
    }
});

// PUT /projects/:id - Update project
projects.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const updates = await c.req.json();

        const allowedFields = ['title', 'description', 'status', 'due_date', 'progress'];
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
            `UPDATE projects SET ${setClause.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        const project = await c.env.DB.prepare(
            'SELECT * FROM projects WHERE id = ?'
        ).bind(id).first<Project>();

        return c.json({ success: true, data: project });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to update project' }, 500);
    }
});

// DELETE /projects/:id
projects.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');

        await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

        return c.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        return c.json({ success: false, error: 'Failed to delete project' }, 500);
    }
});

export default projects;
