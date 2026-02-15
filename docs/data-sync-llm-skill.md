# ClawVerse Operations Skill Pack (Manual Execution Guide)

## 1) `clawverse-research-sync`

- **Purpose**: 기존 등록 소스(GitHub / ClawHub / newsletter)를 동기화한다.  
- **Type**: Manual operational skill (LLM-triggerable)  
- **Run interval**: Daily + on demand

### Inputs

- `SITE_URL` (default: `https://www.clawverse.io`)
- `CRON_HMAC_SECRET` (preferred) or `CRON_SECRET` (fallback): HMAC + bearer secret
- `NEWSLETTER_CRON_SECRET`: newsletter 전용 토큰(다르면 이 값 사용)

### Meaning

- 이 스킬은 **기존 등록 데이터의 업데이트**를 갱신한다.  
- 신규 탐색/리서치가 아니다.
- 데일리/수동으로 실행할 수 있다.

### Shell

```bash
BASE_URL=${SITE_URL:-https://www.clawverse.io}
SYNC_SECRET=${CRON_HMAC_SECRET:-$CRON_SECRET}

timestamp() { date +%s; }
sign() {
  local payload="$1"
  printf "%s" "$payload" | openssl dgst -sha256 -hmac "$2" -binary | \
    openssl base64 -A | tr '+/' '-_' | tr -d '='
}

trigger() {
  local path="$1"
  local secret="${2:-$SYNC_SECRET}"
  local ts
  local sig
  ts="$(timestamp)"
  sig="$(sign "${ts}.POST.${path}" "$secret")"

  curl -s -X POST "${BASE_URL}${path}" \
    -H "Authorization: Bearer ${secret}" \
    -H "x-cron-timestamp: ${ts}" \
    -H "x-cron-signature: ${sig}"
  echo
}

echo "==> github-sync"
trigger /api/cron/github-sync
echo "==> clawhub-sync"
trigger /api/cron/clawhub-sync
echo "==> newsletter"
trigger /api/cron/newsletter "$NEWSLETTER_CRON_SECRET"
```

---

## 2) `clawverse-discovery-scan`

- **Purpose**: GitHub/ClawHub에서 새 후보(프로젝트/스킬)를 탐색해 큐(`submissions`)에 넣는다.  
- **Type**: Manual operational skill (LLM-triggerable)  
- **Run interval**: On demand

### Inputs

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_TOKEN` (optional)
- `CLAWHUB_API_KEY` (optional)
- `DISCOVERY_GITHUB_QUERY` (optional, default: `openclaw OR clawhub OR claw`)
- `DISCOVERY_MAX_RESULTS` (optional, default: `12`)
- `DISCOVERY_DRY_RUN=1` (optional)

### Run

```bash
export NEXT_PUBLIC_SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
export GITHUB_TOKEN=...
export CLAWHUB_API_KEY=...
export DISCOVERY_MAX_RESULTS=20
export DISCOVERY_GITHUB_QUERY="openclaw OR clawhub OR claw"

npx tsx scripts/run-discovery.ts
```

### Note

- 이 스킬은 **신규 소스 발굴(탐색)** 전용이다.
- 기존 등록 항목 업데이트는 `clawverse-research-sync` 경로로 처리한다.
- `DISCOVERY_DRY_RUN=1`로 먼저 후보만 점검한 뒤 실제 삽입 여부를 결정한다.

### Recommended human flow

1. `DISCOVERY_DRY_RUN=1`로 결과 확인  
2. 이상 없으면 dry-run 해제 후 실행  
3. `/admin/submissions`에서 승인  
4. 승인 후 기존 `/submit` 승인 흐름과 동일하게 반영
