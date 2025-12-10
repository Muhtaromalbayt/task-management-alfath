import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';

// Import routes
import auth from './routes/auth';
import users from './routes/users';
import projects from './routes/projects';
import tasks from './routes/tasks';
import columns from './routes/columns';
import divisions from './routes/divisions';
import notifications from './routes/notifications';

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://*.pages.dev', 'https://task-management.bisma.online'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Health check
app.get('/', (c) => {
    return c.json({
        name: 'Task Management API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.route('/auth', auth);
app.route('/users', users);
app.route('/projects', projects);
app.route('/tasks', tasks);
app.route('/columns', columns);
app.route('/divisions', divisions);
app.route('/notifications', notifications);

// 404 handler
app.notFound((c) => {
    return c.json({ success: false, error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error('Server Error:', err);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

export default app;
