import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import type { Env, JwtPayload } from '../types';

export interface AuthContext {
    userId: string;
    email: string;
    role: string;
}

declare module 'hono' {
    interface ContextVariableMap {
        user: AuthContext;
    }
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ success: false, error: 'Unauthorized: No token provided' }, 401);
    }

    const token = authHeader.substring(7);

    try {
        const secret = c.env.JWT_SECRET || 'alfath-secret-key-2025';
        const payload = await verify(token, secret) as JwtPayload;

        c.set('user', {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        });

        await next();
    } catch {
        return c.json({ success: false, error: 'Unauthorized: Invalid token' }, 401);
    }
}

export function adminOnly(c: Context<{ Bindings: Env }>, next: Next) {
    const user = c.get('user');

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return c.json({ success: false, error: 'Forbidden: Admin access required' }, 403);
    }

    return next();
}
