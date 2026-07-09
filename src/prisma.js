import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '18051999@#may',
  database: 'aws-notes',
});

const prisma = new PrismaClient({ adapter });

export default prisma;
