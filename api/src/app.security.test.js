import { describe, it, expect } from 'vitest';
import { sign } from 'hono/jwt';
import worker from './app.js';

const baseEnv = {
    CORS_ORIGIN: 'https://shop.example,https://admin.example',
    DB: {},
};

const call = (path, init = {}, env = baseEnv) =>
    worker.fetch(new Request(`https://api.example${path}`, init), env, {});

describe('CORS', () => {
    it('echoes an allowlisted origin', async () => {
        const res = await call('/api/v1/health', { headers: { Origin: 'https://admin.example' } });
        expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://admin.example');
    });

    it('does not reflect an unknown origin', async () => {
        const res = await call('/api/v1/health', { headers: { Origin: 'https://evil.example' } });
        expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });
});

describe('removed debug endpoint', () => {
    it('no longer serves /api/v1/debug-db', async () => {
        const res = await call('/api/v1/debug-db');
        expect(res.status).toBe(404);
    });
});

describe('admin auth fails closed without secrets', () => {
    const login = (env) =>
        call('/api/v1/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@e-market.com', password: 'admin12345' }),
        }, env);

    it('rejects the old default password when ADMIN_PASSWORD is unset', async () => {
        const res = await login({ ...baseEnv, ADMIN_JWT_SECRET: 'x'.repeat(32) });
        expect(res.status).toBe(503);
    });

    it('rejects login when ADMIN_JWT_SECRET is unset', async () => {
        const res = await login({ ...baseEnv, ADMIN_PASSWORD: 'admin12345' });
        expect(res.status).toBe(503);
    });

    it('issues a token when both secrets are configured', async () => {
        const res = await login({ ...baseEnv, ADMIN_PASSWORD: 'admin12345', ADMIN_JWT_SECRET: 'x'.repeat(32) });
        expect(res.status).toBe(200);
    });

    it('refuses admin routes when ADMIN_JWT_SECRET is unset', async () => {
        const token = await sign({ email: 'admin@e-market.com', exp: Math.floor(Date.now() / 1000) + 60 }, 'old-secret');
        const res = await call('/api/v1/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
        expect(res.status).toBe(503);
    });
});
