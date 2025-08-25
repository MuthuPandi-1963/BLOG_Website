import { env } from '../env.js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';


import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from '../../node_modules/@types/pg/index.js';


async function main() {
if (env.NODE_ENV === 'development' && env.DB_DRIVER === 'pg' && env.LOCAL_DATABASE_URL) {
const { Pool } = pg;
const pool = new Pool({ connectionString: env.LOCAL_DATABASE_URL, ssl: false });
const { migrate } = await import('drizzle-orm/node-postgres/migrator');
await migrate(drizzlePg(pool), { migrationsFolder: 'drizzle' });
await pool.end();
console.log('Migrations applied with node-postgres');
return;
}


const sql = neon(env.DATABASE_URL);
const { migrate } = await import('drizzle-orm/neon-http/migrator');
await migrate(drizzleNeon(sql), { migrationsFolder: 'drizzle' });
console.log('Migrations applied with Neon HTTP');
}


main().catch((e) => {
console.error(e);
process.exit(1);
});