import { PrismaClient } from '@prisma/client';

let databaseUrl = process.env.DATABASE_URL || '';

// Automatically handle Neon/PgBouncer connection pooling if detected
if (databaseUrl.includes('-pooler') && !databaseUrl.includes('pgbouncer=true')) {
    databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: ['error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
