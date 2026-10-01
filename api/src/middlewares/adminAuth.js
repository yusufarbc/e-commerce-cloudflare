import { verifyWithJwks } from 'hono/jwt';

/**
 * Admin authentication via Cloudflare Access.
 *
 * The admin hostname sits behind a Cloudflare Access application. Access
 * authenticates the user and adds a signed `Cf-Access-Jwt-Assertion` header,
 * which the admin Worker forwards here through a service binding. We verify
 * the signature against the team's public keys and check issuer, audience
 * and expiry, so a request that did not pass through Access is rejected even
 * if it reaches the API hostname directly.
 *
 * Required vars: ACCESS_TEAM_DOMAIN (e.g. "myteam.cloudflareaccess.com") and
 * ACCESS_AUD (the Access application's Audience tag).
 */
const JWKS_TTL_MS = 10 * 60 * 1000;
let jwksCache = { url: '', keys: null, fetchedAt: 0 };

async function accessKeys(certsUrl, forceRefresh = false) {
    const fresh = jwksCache.url === certsUrl && Date.now() - jwksCache.fetchedAt < JWKS_TTL_MS;
    if (!forceRefresh && fresh && jwksCache.keys) {
        return jwksCache.keys;
    }
    const res = await fetch(certsUrl);
    if (!res.ok) {
        throw new Error(`Access certs request failed: ${res.status}`);
    }
    const { keys } = await res.json();
    if (!Array.isArray(keys)) {
        throw new Error('Access certs response has no keys');
    }
    jwksCache = { url: certsUrl, keys, fetchedAt: Date.now() };
    return keys;
}

export function resetAccessKeyCache() {
    jwksCache = { url: '', keys: null, fetchedAt: 0 };
}

export const adminAuth = async (c, next) => {
    const teamDomain = c.env.ACCESS_TEAM_DOMAIN;
    const audience = c.env.ACCESS_AUD;
    if (!teamDomain || !audience) {
        return c.json({ status: 'error', errorMessage: 'Yönetici erişimi yapılandırılmamış.' }, 503);
    }

    const token = c.req.header('Cf-Access-Jwt-Assertion');
    if (!token) {
        return c.json({ status: 'error', errorMessage: 'Yetkisiz erişim! Cloudflare Access oturumu bulunamadı.' }, 401);
    }

    const issuer = `https://${teamDomain}`;
    const certsUrl = `${issuer}/cdn-cgi/access/certs`;
    const options = { allowedAlgorithms: ['RS256'], verification: { iss: issuer, aud: audience } };

    let payload;
    try {
        payload = await verifyWithJwks(token, { ...options, keys: await accessKeys(certsUrl) });
    } catch (firstError) {
        // Access rotates its signing keys; retry once with a fresh key set.
        try {
            payload = await verifyWithJwks(token, { ...options, keys: await accessKeys(certsUrl, true) });
        } catch {
            return c.json({ status: 'error', errorMessage: 'Cloudflare Access oturumu geçersiz veya süresi dolmuş.' }, 401);
        }
    }

    c.set('adminUser', { email: payload.email, sub: payload.sub });
    await next();
};
