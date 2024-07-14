import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

let sslmode = "";
if (process.env.APP_ENV === "prod") {
  sslmode = "?sslmode=require";
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL! + sslmode,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  export const db = drizzle(pool, { schema, logger: true });

// const queryClient = postgres(process.env.DATABASE_URL!)
// export const db = drizzle(queryClient, { schema })