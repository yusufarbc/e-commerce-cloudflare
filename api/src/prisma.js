import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

let cachedPrisma = null;

/**
 * Initializes and caches the Prisma Client configured with the Cloudflare D1 Adapter.
 * @param {Object} env - Hono request environment variables (c.env).
 * @returns {PrismaClient}
 */
export function getPrisma(env) {
    if (!cachedPrisma) {
        const adapter = new PrismaD1(env.DB);
        cachedPrisma = new PrismaClient({ adapter });
    }
    return cachedPrisma;
}

/**
 * Global Prisma Client Proxy.
 * Ensures repository and service files do not need to be refactored to consume a dynamic client.
 * Initialized during the first HTTP request middleware execution.
 */
const prismaProxy = new Proxy({}, {
    get(target, prop) {
        if (cachedPrisma) {
            return Reflect.get(cachedPrisma, prop);
        }
        
        // Return a lazy proxy for the database model (e.g. prisma.urun)
        // so that it can be passed to repositories at startup without throwing an error.
        return new Proxy({}, {
            get(modelTarget, modelProp) {
                if (!cachedPrisma) {
                    throw new Error("Prisma client has not been initialized with env yet! Run getPrisma(env) in middleware.");
                }
                const model = Reflect.get(cachedPrisma, prop);
                if (!model) {
                    return undefined;
                }
                const val = Reflect.get(model, modelProp);
                if (typeof val === 'function') {
                    return val.bind(model);
                }
                return val;
            }
        });
    }
});

export default prismaProxy;
