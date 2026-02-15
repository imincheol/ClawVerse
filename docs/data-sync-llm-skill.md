# ClawVerse Research + Sync Skill (Manual Execution Guide)

## Skill profile

- **Name**: `clawverse-research-sync`
- **Purpose**: Run one-time data refresh from registered sources (GitHub + ClawHub), verify results, and then trigger newsletter dispatch if needed.
- **Type**: Manual operational skill (LLM-triggerable)
- **Run interval**: On demand
- **Owner scope**: `www.clawverse.io` production deployment

## Inputs (required)

- `SITE_URL` (기본: `https://www.clawverse.io`)
- `CRON_HMAC_SECRET` (또는 `CRON_SECRET`): HMAC 서명용
- `NEWSLETTER_CRON_SECRET`: 뉴스레터 서브시스템 토큰
- `REQUEST_TIMEOUT_MS` (optional): 기본 `10000`

## Execution policy

1. 동기화는 "새로운 탐색(수동 리서치)"이 아니라 등록된 API 소스에서 정기 갱신하는 작업이다.
2. 신규 소스/수동 조사는 `POST /api/submit` 또는 수동 편집으로 반영한다.
3. 모든 요청은 HMAC 서명(`x-cron-signature`)과 타임스탬프(`x-cron-timestamp`) 검증을 통과해야 한다.

## Task: `run_research_sync_once`

### Step 1) GitHub stars sync

POST `/api/cron/github-sync` with:
- `Authorization: Bearer <CRON_HMAC_SECRET or CRON_SECRET>`
- `x-cron-timestamp`
- `x-cron-signature` for payload `${timestamp}.POST./api/cron/github-sync`

### Step 2) ClawHub skill sync

POST `/api/cron/clawhub-sync` with:
- same header rules as above
- signature payload `${timestamp}.POST./api/cron/clawhub-sync`

### Step 3) Newsletter pipeline

POST `/api/cron/newsletter` with:
- `Authorization: Bearer <CRON_HMAC_SECRET or CRON_SECRET>`
- `x-cron-signature` for payload `${timestamp}.POST./api/cron/newsletter`

### Step 4) Verify

Expect status `200` for each endpoint.  
로그의 예시:
- `{"success":true,"synced":N,"errors":0}`
- `{"success":true,"sent":N}`

## Shell prompt template (LLM can run this)

```bash
BASE_URL=${SITE_URL:-https://www.clawverse.io}
SECRET=${CRON_HMAC_SECRET:-$CRON_SECRET}

timestamp() { date +%s; }
sign() {
  local payload="$1"
  printf "%s" "$payload" | openssl dgst -sha256 -hmac "$SECRET" -binary | \
    openssl base64 -A | tr '+/' '-_' | tr -d '='
}

trigger() {
  local path="$1"
  local ts
  ts="$(timestamp)"
  local sig
  sig="$(sign "${ts}.POST.${path}")"
  curl -s -X POST "${BASE_URL}${path}" \
    -H "Authorization: Bearer ${SECRET}" \
    -H "x-cron-timestamp: ${ts}" \
    -H "x-cron-signature: ${sig}"
  echo
}

echo "==> github-sync"
trigger /api/cron/github-sync
echo "==> clawhub-sync"
trigger /api/cron/clawhub-sync
echo "==> newsletter"
trigger /api/cron/newsletter
```

## Reusability for humans / LLM

- 이 문서를 그대로 복사해서 프롬프트에 붙이면 동일한 수동 동기화를 반복 수행할 수 있다.
- 스크립트/시크릿만 바꾸면 스테이징/프로덕션 환경에서 동일하게 사용 가능하다.
- 향후 리서치 대상이 늘면 `Step 2`에 새 동기화 경로만 추가하면 된다.

