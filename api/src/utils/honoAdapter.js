/**
 * Express-to-Hono controller adapter.
 * Wraps Express middleware/controller signatures (req, res, next) so they can run natively inside Hono.
 * This prevents rewriting complex controller logic and reduces regression risks.
 */
export const adapt = (expressMethod) => {
    return async (c) => {
        let statusCode = 200;
        let responseBody = null;
        let redirectUrl = null;
        const headersMap = {};

        // Parse query params, route parameters, and request body.
        const queryParams = c.req.query();
        const routeParams = c.req.param();
        
        let body = {};
        if (c.req.method === 'POST' || c.req.method === 'PUT' || c.req.method === 'PATCH') {
            const contentType = c.req.header('content-type') || '';
            
            if (contentType.includes('application/json')) {
                try {
                    body = await c.req.json();
                } catch (e) {
                    body = {};
                }
            } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
                try {
                    body = await c.req.parseBody();
                } catch (e) {
                    body = {};
                }
            }
        }

        // Context dynamic values (like validation results)
        const parsedBody = c.get('parsedBody');
        const reqBody = parsedBody || body;

        // Express-like Request Mock
        const req = {
            query: queryParams,
            params: routeParams,
            body: reqBody,
            headers: c.req.header(),
            method: c.req.method,
            url: c.req.url
        };

        // Express-like Response Mock
        const res = {
            status(code) {
                statusCode = code;
                return this;
            },
            set(name, value) {
                headersMap[name] = value;
                return this;
            },
            header(name, value) {
                headersMap[name] = value;
                return this;
            },
            json(data) {
                responseBody = data;
                return this;
            },
            redirect(url) {
                redirectUrl = url;
                return this;
            },
            send(data) {
                responseBody = data;
                return this;
            }
        };

        // Express-like Next Function
        const next = (err) => {
            if (err) {
                throw err;
            }
        };

        // Execute the controller method
        await expressMethod(req, res, next);

        // Apply headers to Hono response context
        if (Object.keys(headersMap).length > 0) {
            for (const [name, value] of Object.entries(headersMap)) {
                c.header(name, value);
            }
        }

        // Return Hono response
        if (redirectUrl) {
            return c.redirect(redirectUrl);
        }

        if (responseBody !== null) {
            if (typeof responseBody === 'object') {
                return c.json(responseBody, statusCode);
            }
            return c.text(responseBody, statusCode);
        }

        return c.body(null, statusCode);
    };
};
