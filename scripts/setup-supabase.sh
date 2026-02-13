#!/bin/bash
#
# ClawVerse — Supabase Setup Script
#
# Usage:
#   chmod +x scripts/setup-supabase.sh
#   ./scripts/setup-supabase.sh
#

set -e

echo "================================="
echo " ClawVerse — Supabase Setup"
echo "================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
  echo "[!] .env.local already exists."
  read -p "    Overwrite? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Keeping existing .env.local"
    echo ""
  else
    rm .env.local
  fi
fi

# Step 1: Get Supabase credentials
echo ""
echo "Step 1: Supabase Project Credentials"
echo "--------------------------------------"
echo "Go to: https://supabase.com/dashboard → Your Project → Settings → API"
echo ""

if [ ! -f .env.local ]; then
  read -p "Supabase URL (https://xxx.supabase.co): " SUPABASE_URL
  read -p "Anon Key (eyJ...): " ANON_KEY
  read -p "Service Role Key (eyJ...): " SERVICE_KEY

  if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ] || [ -z "$SERVICE_KEY" ]; then
    echo "[!] All three values are required."
    exit 1
  fi

  # Generate a random CRON_SECRET
  CRON_SECRET=$(openssl rand -hex 24)

  cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY}

# Cron Authentication
CRON_SECRET=${CRON_SECRET}

# GitHub (optional — for higher API rate limits)
# GITHUB_TOKEN=ghp_your_token_here
EOF

  echo ""
  echo "[OK] .env.local created"
fi

# Step 2: Run migrations
echo ""
echo "Step 2: Run Database Migrations"
echo "--------------------------------------"
echo "Opening migration files. Paste these into Supabase SQL Editor:"
echo "  Dashboard → SQL Editor → New Query"
echo ""
echo "  1. supabase/migrations/001_initial_schema.sql"
echo "  2. supabase/migrations/002_phase4_schema.sql"
echo ""
read -p "Press Enter after running both migrations... "

# Step 3: Seed data
echo ""
echo "Step 3: Seed Initial Data"
echo "--------------------------------------"

# Source env vars
export $(grep -v '^#' .env.local | xargs)

echo "Running seed script..."
npx tsx scripts/seed.ts

# Step 4: GitHub OAuth (optional)
echo ""
echo "Step 4: GitHub OAuth (Optional)"
echo "--------------------------------------"
echo "To enable GitHub login:"
echo "  1. Go to github.com → Settings → Developer Settings → OAuth Apps → New"
echo "  2. Set callback URL to: ${SUPABASE_URL}/auth/v1/callback"
echo "  3. Copy Client ID and Client Secret"
echo "  4. Go to Supabase Dashboard → Auth → Providers → GitHub"
echo "  5. Paste Client ID and Client Secret"
echo ""

# Step 5: Vercel env vars
echo "Step 5: Set Vercel Environment Variables"
echo "--------------------------------------"
echo "Run these commands (or set in Vercel Dashboard):"
echo ""
echo "  vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  vercel env add SUPABASE_SERVICE_ROLE_KEY"
echo "  vercel env add CRON_SECRET"
echo ""

# Step 6: GitHub Actions secrets
echo "Step 6: GitHub Actions Secrets (for daily cron)"
echo "--------------------------------------"
echo "Go to: GitHub Repo → Settings → Secrets and Variables → Actions"
echo ""
echo "  Secrets:"
echo "    CRON_SECRET = ${CRON_SECRET}"
echo ""
echo "  Variables:"
echo "    SITE_URL = https://clawverse.io  (or your Vercel URL)"
echo ""

echo "================================="
echo " Setup Complete!"
echo "================================="
echo ""
echo "Test locally:"
echo "  npm run dev"
echo "  open http://localhost:3000"
echo ""
