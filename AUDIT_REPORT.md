# ClawVerse System Audit Report

**Date:** 2026-02-28
**Auditor:** Claude Code
**Scope:** Full codebase security, quality, and configuration audit

---

## Executive Summary

ClawVerse is a well-structured Next.js 16 application with 18,665 lines of TypeScript across 45 pages, 36 API routes, 24 components, and 25 test files (212 tests). The audit uncovered **1 critical**, **5 high**, and **4 medium** severity issues. All fixable issues have been resolved in this commit.

### Results After Fix

| Check | Before | After |
|-------|--------|-------|
| Tests | 212/212 passed | 212/212 passed |
| ESLint | 2 warnings | 0 warnings |
| TypeScript | 4 errors | 0 errors |
| npm audit | 3 vulnerabilities (2 high, 1 moderate) | 0 vulnerabilities |
| Coverage | Stmts 69.7%, Branch 53.5%, Funcs 81.6%, Lines 72.5% | (unchanged) |

---

## Issues Found & Fixed

### CRITICAL

#### 1. Middleware Not Registered - CSRF Never Issued
- **File:** `src/middleware.ts` (created)
- **Problem:** `src/proxy.ts` contained all middleware logic (CSRF cookie issuance, admin route protection, security headers) but was never registered as Next.js middleware. No `middleware.ts` file existed.
- **Impact:** CSRF tokens were never generated, so all `requireCsrf: true` API routes (reviews, stacks, profile, admin) would reject all legitimate requests. Admin page `/admin` had no route-level access control.
- **Fix:** Created `src/middleware.ts` that re-exports from `proxy.ts`. Also fixed double `getUser()` call in `proxy.ts`.

### HIGH

#### 2. PostgREST Filter Injection in Search Queries
- **Files:** `src/lib/data/projects.ts`, `src/lib/data/deploy.ts`, `src/lib/data/submissions.ts`
- **Problem:** Search input only stripped commas but allowed PostgREST-special characters (`.`, `(`, `)`, `%`, `"`) through. An attacker could inject additional filter clauses via crafted search strings.
- **Fix:** Extended sanitization to strip all PostgREST filter operators: `,`, `.`, `(`, `)`, `"`, `'`, `\`, `%`. Also removed `.` from the `flagSkillByName` allowlist.

#### 3. Hardcoded Fallback Secret in Newsletter Token Generation
- **File:** `src/app/api/newsletter/send/route.ts:22`
- **Problem:** `generateUnsubscribeToken()` fell back to hardcoded `"dev-secret"` when `NEWSLETTER_CRON_SECRET` was not set, allowing token forgery. Also used a different secret resolution chain than the verify function.
- **Fix:** Changed to use `NEWSLETTER_CRON_SECRET || CRON_SECRET` (matching the verify function) and throw an error when neither is configured.

#### 4. HTML Injection in Email Templates
- **File:** `src/lib/email/templates.ts`
- **Problem:** User-supplied values (submission names, descriptions, rejection reasons, newsletter content) were interpolated directly into HTML email templates without escaping, enabling HTML/script injection via malicious content.
- **Fix:** Added `escapeHtml()` utility function and applied it to all user-supplied values across all 5 template functions.

#### 5. Missing Input Validation in Reviews API
- **File:** `src/app/api/reviews/route.ts`
- **Problem:** `target_type` and `target_id` were passed directly to Supabase queries without validation. No whitelist check for allowed target types.
- **Fix:** Added `validTargetTypes` whitelist (`skill`, `project`, `deploy`, `agent`, `mcp`, `plugin`) to both GET and POST handlers.

### MEDIUM

#### 6. Missing Cron Routes in vercel.json
- **File:** `vercel.json`
- **Problem:** Only 2 of 4 cron jobs were configured (`virustotal-scan`, `newsletter`). `github-sync` and `clawhub-sync` were missing and would never run on Vercel.
- **Fix:** Added both missing cron routes with appropriate daily schedules.

#### 7. Supabase Error Messages Leaked to Clients
- **Files:** 7 API routes across `newsletter/`, `reviews/vote/`, `profile/`, `stacks/`, `stacks/[id]/`, `stacks/[id]/items/`
- **Problem:** Raw Supabase error messages (`error.message`) were returned in API responses, potentially revealing database schema details.
- **Fix:** Replaced with generic error messages and added `console.error` for server-side logging.

#### 8. ESLint Warnings - Unused Variables
- **Files:** `src/app/agents/[slug]/page.tsx`, `src/components/AgentCard.tsx`
- **Problem:** `SECURITY_CONFIG` was imported and `sec` variable assigned but never used.
- **Fix:** Removed unused imports and variable assignments.

#### 9. TypeScript Errors in Test Files
- **Files:** `src/data/agents.data.test.ts`, `src/data/projects.data.test.ts`, `src/lib/seo.test.ts`
- **Problem:** Type mismatches - `Set<AgentType>.has(string)`, `Set<ProjectLayer>.has(string)`, and missing `.type`/`.card` properties on Next.js metadata types.
- **Fix:** Added explicit `Set<string>` type annotations and `Record<string, unknown>` casts.

---

## Issues Identified (Not Fixed - Require Architecture Decisions)

### MEDIUM

#### 10. N+1 Query Problem in Reviews and Stacks APIs
- **Files:** `src/app/api/reviews/route.ts` (GET), `src/app/api/stacks/route.ts` (GET)
- **Problem:** For each review/stack, 2-3 additional DB queries are executed (vote counts, user profiles). 20 reviews = 40-60 queries per request.
- **Recommendation:** Use Supabase joins, RPC calls, or database views to batch these queries.

#### 11. CSP in Report-Only Mode with unsafe-inline/eval
- **File:** `next.config.ts`
- **Problem:** Content-Security-Policy is set as `Report-Only` with `'unsafe-inline'` and `'unsafe-eval'` for scripts, making it effectively unenforced.
- **Recommendation:** Move to enforcing CSP with nonces for inline scripts once stable.

#### 12. Metrics Endpoints Publicly Accessible
- **Files:** `src/app/api/metrics/page-views/route.ts`, `src/app/api/metrics/projects/[slug]/growth/route.ts`
- **Problem:** Page view analytics and project growth data are accessible without authentication.
- **Recommendation:** Add authentication or at minimum rate limiting to these endpoints.

#### 13. API Key Validation is a No-Op
- **File:** `src/lib/api-auth.ts`
- **Problem:** `validateApiKey()` accepts any non-empty string as valid. Contains a TODO comment about production validation.
- **Recommendation:** Implement key validation against a database table before enabling API key features.

### LOW

#### 14. In-Memory Rate Limiting Ineffective in Serverless
- **File:** `src/lib/rate-limit.ts`
- **Problem:** Default in-memory `Map` store provides no cross-instance rate limiting in Vercel's serverless environment.
- **Recommendation:** Configure Upstash Redis for production rate limiting.

#### 15. Static Data Files in Client Bundles
- **Files:** `src/data/skills.ts` (33K lines), `src/data/projects.ts` (25K lines), etc.
- **Problem:** Large static data files are imported by client components, increasing bundle size.
- **Recommendation:** Move data fetching to server components and pass as props.

#### 16. Build Failure in Offline Environments
- **File:** `src/app/layout.tsx`, `src/app/**/opengraph-image.tsx`
- **Problem:** `next/font/google` and `ImageResponse` require network access during build to fetch fonts from Google Fonts and cdn.jsdelivr.net. Builds fail in restricted network environments.
- **Impact:** CI/CD only. Works correctly on Vercel.
- **Recommendation:** No action needed for production. For offline CI, consider `next/font/local` with bundled font files.

---

## Project Health Summary

| Metric | Value |
|--------|-------|
| **Source Files** | 110+ TypeScript/TSX files |
| **Test Files** | 25 (212 test cases) |
| **Coverage** | 69.7% statements, 81.6% functions |
| **API Routes** | 36 endpoints |
| **DB Migrations** | 5 migration files |
| **CI/CD Workflows** | 4 GitHub Actions |
| **Security Features** | CSRF, rate limiting, HMAC cron auth, RLS, CSP |
| **Dependencies** | 6 runtime, 12 dev (all up to date, 0 vulnerabilities) |

### Architecture Strengths
- Clean separation: data layer, API routes, components
- Comprehensive security middleware (CSRF, origin checks, rate limiting)
- Row Level Security on all Supabase tables
- Graceful fallback when Supabase is not configured (static data)
- Good test coverage for security and data layer modules

### Architecture Concerns
- Large static data files (~150K lines) may need database migration
- N+1 query patterns need optimization before scaling
- CSP needs tightening before production launch
- Some API routes lack rate limiting on read endpoints
