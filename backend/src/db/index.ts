import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { neon } from '@neondatabase/serverless';
import pg from '../../node_modules/@types/pg/index.js';
import 'dotenv/config'
import * as schema from './schema.js';
import { EnvLoader } from '../env.js';


export const db = (() => {
if ( (EnvLoader("NODE_ENV","string") === 'development') && (EnvLoader("DB_DRIVER","string") == 'pg') && (EnvLoader("LOCAL_DATABASE_URL","string"))) {
const { Pool } = pg;
const pool = new Pool({ connectionString: EnvLoader("LOCAL_DATABASE_URL","string"), ssl: false });
return drizzlePg(pool, { schema });
}
const sql = neon(EnvLoader("DATABASE_URL","string"));
return drizzleNeon(sql, { schema });
})();