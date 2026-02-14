#!/usr/bin/env node

const isProdDeploy =
  process.env.VERCEL_ENV === "production" ||
  process.env.ENFORCE_REQUIRED_ENV === "1";

const errors = [];

function has(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0;
}

if (has("NEXT_PUBLIC_SUPABASE_URL") !== has("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
  errors.push(
    "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set together."
  );
}

if (isProdDeploy) {
  if (!has("CSRF_SECRET")) {
    errors.push("CSRF_SECRET is required for production deploys.");
  }
  if (!has("CRON_SECRET")) {
    errors.push("CRON_SECRET is required for production deploys.");
  }
}

if (errors.length > 0) {
  console.error("Environment validation failed:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log("Environment validation passed.");
