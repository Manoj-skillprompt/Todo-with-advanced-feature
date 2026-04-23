// import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';
const adapter = new PrismaMariaDb({
  host: 'localhost',
  password: 'password',
  user: 'root',
  database: 'todoDB',
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
