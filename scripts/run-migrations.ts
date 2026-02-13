/**
 * Run SQL migrations against Supabase PostgreSQL
 *
 * Usage: npx tsx scripts/run-migrations.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
// @ts-expect-error — pg types not installed
import pg from "pg";

const MIGRATIONS = [
  resolve(__dirname, "../supabase/migrations/001_initial_schema.sql"),
  resolve(__dirname, "../supabase/migrations/002_phase4_schema.sql"),
];

// Extract project ref from Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error("Cannot extract project ref from URL");
  process.exit(1);
}

const dbPassword = process.env.SUPABASE_DB_PASSWORD || "pIetDHEsJpq2hRM2";

const connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`;

async function main() {
  console.log("ClawVerse — Database Migration");
  console.log("===============================\n");

  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected!\n");

    for (const migrationPath of MIGRATIONS) {
      const filename = migrationPath.split("/").pop();
      console.log(`Running: ${filename}`);

      const sql = readFileSync(migrationPath, "utf-8");

      // Split by statements that are separated by semicolons
      // But handle $$ function bodies correctly
      try {
        await client.query(sql);
        console.log(`  ✓ ${filename} — success\n`);
      } catch (err: unknown) {
        const pgErr = err as { message: string; detail?: string };
        // "already exists" errors are OK (idempotent migrations)
        if (pgErr.message?.includes("already exists")) {
          console.log(`  ✓ ${filename} — already applied (skipped)\n`);
        } else {
          console.error(`  ✗ ${filename} — ${pgErr.message}`);
          if (pgErr.detail) console.error(`    ${pgErr.detail}`);
          // Try individual statements
          console.log("  Retrying statement by statement...");
          const statements = sql
            .split(/;\s*$/m)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

          let ok = 0;
          let skip = 0;
          for (const stmt of statements) {
            try {
              await client.query(stmt);
              ok++;
            } catch (stmtErr: unknown) {
              const pgStmtErr = stmtErr as { message: string };
              if (pgStmtErr.message?.includes("already exists")) {
                skip++;
              } else {
                console.error(`    ✗ ${pgStmtErr.message.slice(0, 80)}`);
              }
            }
          }
          console.log(`  Done: ${ok} applied, ${skip} skipped\n`);
        }
      }
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Connection failed:", err);
    console.log("\nTrying alternative connection...");

    // Try direct connection
    const directConn = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;
    const client2 = new pg.Client({ connectionString: directConn, ssl: { rejectUnauthorized: false } });

    try {
      await client2.connect();
      console.log("Connected via direct connection!\n");

      for (const migrationPath of MIGRATIONS) {
        const filename = migrationPath.split("/").pop();
        const sql = readFileSync(migrationPath, "utf-8");
        console.log(`Running: ${filename}`);

        const statements = sql
          .split(/;\s*$/m)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        let ok = 0;
        let skip = 0;
        for (const stmt of statements) {
          try {
            await client2.query(stmt);
            ok++;
          } catch (stmtErr: unknown) {
            const pgStmtErr = stmtErr as { message: string };
            if (pgStmtErr.message?.includes("already exists")) {
              skip++;
            } else {
              console.error(`  ✗ ${pgStmtErr.message.slice(0, 100)}`);
            }
          }
        }
        console.log(`  ✓ ${filename} — ${ok} applied, ${skip} skipped\n`);
      }

      console.log("Migration complete!");
      await client2.end();
    } catch (err2) {
      console.error("Direct connection also failed:", err2);
      console.log("\n=== Manual Migration Required ===");
      console.log("Paste the SQL files in Supabase Dashboard → SQL Editor:");
      console.log("  1. supabase/migrations/001_initial_schema.sql");
      console.log("  2. supabase/migrations/002_phase4_schema.sql");
    }
  } finally {
    try {
      await client.end();
    } catch {
      // already closed
    }
  }
}

main();
