import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import worker from './app.js';
import { adminAuth, resetAccessKeyCache } from './middlewares/adminAuth.js';

const TEAM = 'example-team.cloudflareaccess.com';
const AUD = 'test-audience-tag';
const CERTS_URL = `https://${TEAM}/cdn-cgi/access/certs`;

const baseEnv = {
    CORS_ORIGIN: 'https://shop.example,https://admin.example',
    DB: {},
};

const call = (path, init = {}, env = baseEnv) =>
    worker.fetch(new Request(`https://api.example${path}`, init), env, {});

async function rsaKey(kid) {
    const pair = await crypto.subtle.generateKey(
        { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['sign', 'verify'],
    );
    const privateJwk = { ...(await crypto.subtle.exportKey('jwk', pair.privateKey)), kid, alg: 'RS256' };
    const publicJwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid, alg: 'RS256' };
    return { privateJwk, publicJwk };
}

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

describe('security headers', () => {
    it('sets HSTS, nosniff and frame protection, and allows cross-origin script loading', async () => {
        const res = await call('/api/v1/health');
        expect(res.headers.get('Strict-Transport-Security')).toContain('max-age=');
        expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
        expect(res.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
        expect(res.headers.get('Cross-Origin-Resource-Policy')).toBe('cross-origin');
    });
});

describe('checkout validation', () => {
    const post = (body) => call('/api/v1/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });

    it('rejects a body that does not match the checkout schema', async () => {
        const res = await post(JSON.stringify({ items: [], guestInfo: { name: 'A' } }));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.status).toBe('failure');
        expect(json.errors.map((e) => e.path)).toContain('items');
    });

    it('rejects malformed JSON with 400 instead of a server error', async () => {
        const res = await post('{not json');
        expect(res.status).toBe(400);
    });
});

describe('removed endpoints', () => {
    it('no longer serves /api/v1/debug-db', async () => {
        expect((await call('/api/v1/debug-db')).status).toBe(404);
    });

    it('no longer has a password login', async () => {
        const res = await call('/api/v1/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@e-market.com', password: 'admin12345' }),
        });
        expect([401, 404, 503]).toContain(res.status);
        expect(await res.text()).not.toContain('token');
    });
});

describe('admin routes behind Cloudflare Access', () => {
    it('fail closed when Access is not configured', async () => {
        expect((await call('/api/v1/admin/orders')).status).toBe(503);
    });

    it('reject requests without an Access assertion', async () => {
        const env = { ...baseEnv, ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD };
        expect((await call('/api/v1/admin/orders', {}, env)).status).toBe(401);
    });
});

describe('adminAuth (Access JWT verification)', () => {
    let good;
    let rogue;
    const app = new Hono();
    app.use('*', adminAuth);
    app.get('/whoami', (c) => c.json(c.get('adminUser')));

    const env = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD };
    const request = (token) =>
        app.request('/whoami', { headers: token ? { 'Cf-Access-Jwt-Assertion': token } : {} }, env);
    const claims = (overrides = {}) => ({
        iss: `https://${TEAM}`,
        aud: [AUD],
        email: 'admin@example.com',
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 300,
        ...overrides,
    });

    beforeAll(async () => {
        good = await rsaKey('kid-good');
        rogue = await rsaKey('kid-good'); // same kid, different key
    });

    beforeEach(() => {
        resetAccessKeyCache();
        vi.stubGlobal('fetch', vi.fn(async (url) => {
            expect(String(url)).toBe(CERTS_URL);
            return new Response(JSON.stringify({ keys: [good.publicJwk] }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }));
    });

    afterEach(() => vi.unstubAllGlobals());

    it('accepts a valid assertion and exposes the user', async () => {
        const res = await request(await sign(claims(), good.privateJwk, 'RS256'));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ email: 'admin@example.com', sub: 'user-123' });
    });

    it('rejects a token signed by another key', async () => {
        expect((await request(await sign(claims(), rogue.privateJwk, 'RS256'))).status).toBe(401);
    });

    it('rejects the wrong audience', async () => {
        expect((await request(await sign(claims({ aud: ['other-app'] }), good.privateJwk, 'RS256'))).status).toBe(401);
    });

    it('rejects the wrong issuer', async () => {
        const token = await sign(claims({ iss: 'https://evil.cloudflareaccess.com' }), good.privateJwk, 'RS256');
        expect((await request(token)).status).toBe(401);
    });

    it('rejects an expired token', async () => {
        const token = await sign(claims({ exp: Math.floor(Date.now() / 1000) - 10 }), good.privateJwk, 'RS256');
        expect((await request(token)).status).toBe(401);
    });

    it('rejects HS256 tokens (no symmetric algorithms)', async () => {
        const token = await sign(claims(), 'shared-secret', 'HS256');
        expect((await request(token)).status).toBe(401);
    });

    it('caches the Access certs between requests', async () => {
        const token = await sign(claims(), good.privateJwk, 'RS256');
        await request(token);
        await request(token);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});

describe('rate limiting (Workers Rate Limiting binding)', () => {
    const limiter = (allow) => {
        const calls = [];
        return { calls, limit: async ({ key }) => { calls.push(key); return { success: allow }; } };
    };

    it('returns 429 with Retry-After when the general budget is exhausted', async () => {
        const API_RATE_LIMITER = limiter(false);
        const res = await call('/api/v1/health', { headers: { 'CF-Connecting-IP': '203.0.113.7' } },
            { ...baseEnv, API_RATE_LIMITER });
        expect(res.status).toBe(429);
        expect(res.headers.get('Retry-After')).toBe('60');
        expect(API_RATE_LIMITER.calls).toEqual(['api:203.0.113.7']);
    });

    it('applies the stricter budget to order, payment and return flows only', async () => {
        const API_RATE_LIMITER = limiter(true);
        const SENSITIVE_RATE_LIMITER = limiter(false);
        const env = { ...baseEnv, API_RATE_LIMITER, SENSITIVE_RATE_LIMITER };
        expect((await call('/api/v1/orders/123', {}, env)).status).toBe(429);
        expect((await call('/api/v1/health', {}, env)).status).toBe(200);
        expect(SENSITIVE_RATE_LIMITER.calls).toEqual(['sensitive:unknown']);
    });
});
