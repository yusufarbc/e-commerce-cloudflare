import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

let cachedPrisma = null;

/**
 * Cloudflare D1 için Prisma Client'ı başlatır ve önbelleğe alır.
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
 * Global Prisma Client Proxy nesnesi.
 * Repositories ve Services içindeki mevcut kodların değişmeden çalışmasını sağlar.
 * İlk HTTP isteğinde middleware tarafından getPrisma(c.env) çağrıldığında initialize olur.
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
