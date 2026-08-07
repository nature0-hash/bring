/**
 * Shared database helpers.
 *
 * Two drivers are supported behind a single `sql(strings, ...values)` interface:
 *   1. Neon serverless (default, for Vercel production) — used when DATABASE_URL
 *      points at a Neon endpoint.
 *   2. node-postgres `pg` (for local preview) — used when DATABASE_URL points at
 *      a local Postgres (localhost / 127.0.0.1) or when USE_PG=1 is set.
 *
 * All API routes use `query` / `queryOne`, which funnel through `sql`, so the
 * route code is identical regardless of driver.
 */
import { neon, neonConfig } from "@neondatabase/serverless";
import pg from "pg";

// Force HTTP transport for Neon (more reliable in serverless cold starts).
neonConfig.poolQueryViaFetch = true;

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("[db] DATABASE_URL is not set. API routes will return 500.");
}

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<unknown[]>;

function makeSql(url: string): SqlFn {
  const useLocalPg =
    process.env.USE_PG === "1" ||
    /@(localhost|127\.0\.0\.1)[:/]/.test(url) ||
    url.includes("host=localhost") ||
    url.includes("host=127.0.0.1");

  if (useLocalPg) {
    const pool = new pg.Pool({ connectionString: url });
    return async (strings: TemplateStringsArray, ...values: unknown[]) => {
      let text = "";
      strings.forEach((part, i) => {
        text += part;
        if (i < values.length) text += `$${i + 1}`;
      });
      const result = await pool.query(text, values as unknown[]);
      return result.rows;
    };
  }

  const neonSql = neon(url);
  return ((strings: TemplateStringsArray, ...values: unknown[]) =>
    neonSql(strings, ...values) as Promise<unknown[]>) as SqlFn;
}

export const sql: SqlFn | null = DATABASE_URL ? makeSql(DATABASE_URL) : null;

/** Run a query and assert the database is configured. */
export async function query<T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  return (await sql(strings, ...values)) as T[];
}

/** Run a query and return the first row, or null. */
export async function queryOne<T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T | null> {
  const rows = await query<T>(strings, ...values);
  return rows[0] ?? null;
}
