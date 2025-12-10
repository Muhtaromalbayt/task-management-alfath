import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { compare, hash } from 'bcryptjs';
import type { Env, User } from '../types';
import { generateId } from '../utils/helpers';

const auth = new Hono<{ Bindings: Env }>();

// POST /auth/login
auth.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ success: false, error: 'Email and password are required' }, 400);
        }

        const user = await c.env.DB.prepare(
            'SELECT * FROM users WHERE email = ?'
        ).bind(email).first<User>();

        if (!user) {
            return c.json({ success: false, error: 'Invalid email or password' }, 401);
        }

        const isValidPassword = await compare(password, user.password!);
        if (!isValidPassword) {
            return c.json({ success: false, error: 'Invalid email or password' }, 401);
        }

        const secret = c.env.JWT_SECRET || 'alfath-secret-key-2025';
        const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7); // 7 days

        const token = await sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            exp
        }, secret);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return c.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        return c.json({ success: false, error: 'Login failed' }, 500);
    }
});

// POST /auth/register
auth.post('/register', async (c) => {
    try {
        const { email, password, name } = await c.req.json();

        if (!email || !password || !name) {
            return c.json({ success: false, error: 'Email, password, and name are required' }, 400);
        }

        // Check if user exists
        const existing = await c.env.DB.prepare(
            'SELECT id FROM users WHERE email = ?'
        ).bind(email).first();

        if (existing) {
            return c.json({ success: false, error: 'Email already registered' }, 409);
        }

        const hashedPassword = await hash(password, 10);
        const userId = generateId('user');

        await c.env.DB.prepare(
            'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)'
        ).bind(userId, email, hashedPassword, name, 'user').run();

        const secret = c.env.JWT_SECRET || 'alfath-secret-key-2025';
        const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);

        const token = await sign({
            userId,
            email,
            role: 'user',
            exp
        }, secret);

        return c.json({
            success: true,
            data: {
                user: { id: userId, email, name, role: 'user' },
                token
            }
        }, 201);
    } catch (error) {
        return c.json({ success: false, error: 'Registration failed' }, 500);
    }
});

// GET /auth/me - Get current user
auth.get('/me', async (c) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    try {
        const token = authHeader.substring(7);
        const secret = c.env.JWT_SECRET || 'alfath-secret-key-2025';
        const { verify } = await import('hono/jwt');
        const payload = await verify(token, secret) as { userId: string };

        const user = await c.env.DB.prepare(
            'SELECT id, email, name, role, avatar, division_id FROM users WHERE id = ?'
        ).bind(payload.userId).first<User>();

        if (!user) {
            return c.json({ success: false, error: 'User not found' }, 404);
        }

        return c.json({ success: true, data: user });
    } catch {
        return c.json({ success: false, error: 'Invalid token' }, 401);
    }
});

export default auth;
