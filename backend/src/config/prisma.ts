import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$on('error', (e) => {
  console.error('❌ [DATABASE_CRITICAL]:', e.message);
  console.error('⚠️ [DIAGNOSIS]: Possible DNS failure or database is suspended.');
});

prisma.$on('warn', (e) => {
  console.warn('⚠️ [DATABASE_WARN]:', e.message);
});

prisma.$on('info', (e) => {
  console.info('ℹ️ [DATABASE_INFO]:', e.message);
});
