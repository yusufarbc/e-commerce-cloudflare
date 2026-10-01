/**
 * Per-client rate limiting with the Workers Rate Limiting binding.
 *
 * Limits are configured in wrangler.toml (`[[env.<name>.ratelimits]]`). The key
 * is the client IP Cloudflare reports in CF-Connecting-IP, so each visitor gets
 * their own budget. When the binding is absent (unit tests, a misconfigured
 * environment) requests pass through: the limiter is a runtime safeguard, not
 * an authorization check.
 *
 * @param {string} bindingName - name of the ratelimits binding in env
 * @param {string} scope - namespace for the key, so separate limiters do not share budgets
 */
export const rateLimit = (bindingName, scope) => async (c, next) => {
    const limiter = c.env?.[bindingName];
    if (!limiter) {
        return next();
    }

    const client = c.req.header('CF-Connecting-IP') || 'unknown';
    const { success } = await limiter.limit({ key: `${scope}:${client}` });
    if (!success) {
        return c.json(
            { status: 'error', errorMessage: 'Çok fazla istek. Lütfen biraz sonra tekrar deneyin.' },
            429,
            { 'Retry-After': '60' }
        );
    }
    await next();
};
