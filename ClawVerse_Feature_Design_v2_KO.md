# ClawVerse.io — 기능 설계 v2

> 이전 컨셉에서 업데이트. 핵심 전략 변경:
> "직접 만들지 않는다. 흩어진 것을 모아서, 검증하고, 분류한다."

---

## 핵심 원칙

1. **우리가 하위 사이트가 하는 걸 다시 할 필요 없다** — ClawHub가 스킬 레지스트리를 하고 있고, SimpleClaw가 배포를 하고 있다. 우리는 그것들의 **메타 레이어**다.
2. **흩어진 정보를 한곳에** — 스킬 관련만 해도 ClawHub, awesome-openclaw-skills, Moltbooks.app, 개별 GitHub 등 소스가 분산되어 있다. 이걸 통합 검색/브라우징으로 보여준다.
3. **보안 검수로 신뢰 제공** — VirusTotal 연동, 코드 리뷰 상태, 커뮤니티 신고 등을 종합해서 안전한 스킬/프로젝트만 필터링.
4. **분류가 곧 가치** — 용도별, 레이어별, 난이도별, 보안등급별 분류로 사용자가 원하는 걸 빠르게 찾게 한다.

---

## 카테고리 설계

### 1️⃣ 스킬 허브 (Skills Hub)

> ClawHub + awesome-openclaw-skills + Moltbooks.app + GitHub 개별 레포 → 한곳에서 통합 검색

**데이터 소스 통합:**

| 소스 | 수량 | 특징 | 우리가 할 것 |
|------|------|------|-------------|
| ClawHub (공식) | 5,705개 | 퍼블리시/버전/벡터검색 | API로 메타데이터 크롤링 |
| awesome-openclaw-skills | 2,999개 (큐레이티드) | 카테고리 분류됨 | 카테고리 매핑 |
| Moltbooks.app | 멀티플랫폼 인덱스 | Codex/Claude Code 등 포함 | 크로스 플랫폼 호환 정보 추가 |
| GitHub 개별 레포 | 수백~수천 | 비등록 스킬 | 발굴 → 등록 유도 |

**보안 필터링 시스템:**

```
┌─────────────────────────────────────────┐
│         ClawVerse 스킬 신뢰 등급         │
├─────────────────────────────────────────┤
│                                          │
│  🟢 Verified (검증됨)                    │
│  ├─ VirusTotal 스캔 통과                 │
│  ├─ 코드 리뷰 완료 (커뮤니티 or 자동)     │
│  ├─ 100+ 인스톨                          │
│  └─ 악성 신고 0건                         │
│                                          │
│  🟡 Reviewed (리뷰됨)                    │
│  ├─ VirusTotal 스캔 통과                 │
│  ├─ 기본 코드 검사 통과                   │
│  └─ 10+ 인스톨                           │
│                                          │
│  🟠 Unreviewed (미검토)                  │
│  ├─ 새로 등록됨                          │
│  └─ 자동 스캔만 완료                      │
│                                          │
│  🔴 Flagged (경고)                       │
│  ├─ 악성 코드 의심                        │
│  ├─ API 키 탈취 패턴 감지                 │
│  └─ 커뮤니티 신고 접수                    │
│                                          │
│  ⛔ Blocked (차단)                       │
│  ├─ 확인된 악성 스킬                      │
│  └─ 표시하되 설치 경고                    │
│                                          │
└─────────────────────────────────────────┘
```

> 참고: 최근 400+ 악성 스킬이 ClawHub와 GitHub에서 발견됨 (API 키, SSH 키, 브라우저 비밀번호, 크립토 지갑 탈취). ClawVerse의 보안 필터링은 실질적 가치가 있음.

**스킬 카드 UI 정보:**
- 스킬 이름 + 한줄 설명
- 보안 등급 뱃지 (🟢🟡🟠🔴)
- 인스톨 수 / 별점 / 리뷰 수
- 출처 표시 (ClawHub / GitHub / etc)
- 호환 플랫폼 (OpenClaw / Claude Code / Codex 등)
- 권한 요구사항 (파일 접근 / 쉘 / 네트워크 / API 키)
- "비슷한 스킬" 추천

---

### 2️⃣ 배포 가이드 (Deploy Hub)

> SimpleClaw, EasyClaw, ClawNest, ClawStack, Moltworker, DigitalOcean, Kuberns, Vercel, Docker 등 → 비교 + 가이드

**배포 옵션 비교표:**

| 항목 | 기술 수준 | 비용 | 셋업 시간 | 보안 | 확장성 |
|------|----------|------|----------|------|--------|
| SimpleClaw | ⭐ (초보) | 유료 | 1분 | 중 | 낮음 |
| EasyClaw | ⭐ (초보) | 유료 | 1분 | 중 | 중 |
| ClawNest | ⭐ (초보) | 유료 | 5분 | 높음 | 중 |
| ClawStack | ⭐⭐ | 유료 | 수분 | 중 | 중 |
| DigitalOcean 1-Click | ⭐⭐ | $12/월~ | 10분 | 높음 | 높음 |
| Kuberns | ⭐⭐ | 유료 | 수분 | 중 | 높음 |
| Moltworker (Cloudflare) | ⭐⭐⭐ | $5/월~ | 30분 | 높음 | 높음 |
| Vercel | ⭐⭐⭐ | 무료~ | 30분 | 중 | 높음 |
| Docker (직접) | ⭐⭐⭐⭐ | 무료~ | 1시간+ | 설정에 따라 | 높음 |
| 로컬 (Mac/Linux) | ⭐⭐⭐⭐ | 무료 | 1-3시간 | 낮음 | - |
| NanoClaw (컨테이너) | ⭐⭐⭐ | 무료 | 30분 | 매우 높음 | 낮음 |

**배포 가이드 콘텐츠:**
- "나에게 맞는 배포 방법 찾기" 퀴즈/플로우차트
- 각 옵션별 스텝바이스텝 가이드 (링크 + 요약)
- 비용 계산기 (월 예상 비용)
- 보안 체크리스트
- 마이그레이션 가이드 (A → B로 옮기기)

---

### 3️⃣ 프로젝트 디렉토리 (Project Directory)

> 배포/호스팅 이외의 모든 프로젝트 — 소셜, 협업, 신뢰, 도구 등

**레이어별 분류:**

```
📂 프로젝트 디렉토리
├── 🦞 코어 (Core)
│   └── OpenClaw, Pi, Nix-OpenClaw
├── 🤝 소셜 (Social)
│   └── Moltbook, ClankedIn, ClawVerse.app, OnlyCrabs
├── 🔄 협업 (Collaboration)
│   └── Claw-Swarm, Clawork, Composio
├── 🔐 신뢰 (Trust)
│   └── ClawPrint, Crustafarian
├── 🧪 실험 (Experimental)
│   └── Gibberlink, ClawGrid, NanoBot
└── ⚠️ 주의 (Caution)
    └── $MOLT 토큰, MoltRoad (경고 표시)
```

**프로젝트 카드 UI 정보:**
- 프로젝트명 + 로고 + 한줄 설명
- 레이어 뱃지
- GitHub 스타/포크 (있을 경우)
- 최근 업데이트일
- 공식/커뮤니티/비공식 구분
- 커뮤니티 평점 + 리뷰
- "이 프로젝트와 함께 쓰면 좋은 것" 추천

---

### 4️⃣ 커뮤니티 (Community)

- **토론 포럼** — 프로젝트별 Q&A, 일반 토론
- **주간 픽** — 이번 주 뜨는 스킬/프로젝트
- **RFC** — "이런 도구가 필요해요" 제안
- **스택 큐레이션** — "My Claw Stack" 공유

### 5️⃣ 뉴스 & 트렌드 (Pulse)

- 신규 프로젝트/스킬 알림
- OpenClaw 릴리즈 노트 요약
- 보안 이슈 속보
- 에코시스템 주간 리포트

---

## 페이지 구조

```
clawverse.io/
├── /                    ← 랜딩 (히어로 + 하이라이트)
├── /skills              ← 스킬 허브 (통합 검색/필터)
│   ├── /skills?filter=verified    ← 검증된 스킬만
│   ├── /skills?category=browser   ← 카테고리별
│   ├── /skills?source=clawhub     ← 소스별
│   └── /skills/:id                ← 스킬 상세
├── /deploy              ← 배포 가이드
│   ├── /deploy/compare            ← 비교표
│   ├── /deploy/quiz               ← 나에게 맞는 배포법
│   └── /deploy/:provider          ← 제공자별 가이드
├── /projects            ← 프로젝트 디렉토리
│   ├── /projects?layer=social     ← 레이어별
│   └── /projects/:id              ← 프로젝트 상세
├── /community           ← 포럼 / 토론
│   ├── /community/weekly-picks
│   ├── /community/rfc
│   └── /community/stacks
├── /pulse               ← 뉴스 & 트렌드
│   ├── /pulse/new
│   ├── /pulse/trending
│   └── /pulse/security
├── /about               ← 소개
└── /api                 ← 퍼블릭 API (에이전트용)
```

---

## 차별화 포인트 요약

| 기존 | 문제 | ClawVerse 해결책 |
|------|------|-----------------|
| ClawHub | 공식 스킬만 | **모든 소스** 통합 (ClawHub + GitHub + 독립 레포) |
| awesome-openclaw-skills | 정적 리스트 | **실시간** 검색 + 필터 + 리뷰 |
| Moltbooks.app | 멀티플랫폼 인덱스 | **보안 등급** + 권한 분석 추가 |
| 각 배포 서비스 사이트 | 자기 서비스만 홍보 | **중립적 비교** + 사용자 맞춤 추천 |
| 개별 프로젝트 사이트 | 자기 프로젝트만 | **생태계 전체 지도** + 관계 시각화 |

### 킬러 밸류: 보안

> OpenClaw 생태계에서 400+ 악성 스킬이 발견됨.
> API 키, SSH 키, 브라우저 비밀번호, 크립토 지갑 탈취.
> **ClawVerse의 보안 필터링은 "있으면 좋은 것"이 아니라 "반드시 필요한 것".**

---

## 데이터 파이프라인

```
[ClawHub API] ──┐
[GitHub API] ────┤
[Moltbooks] ─────┼──→ [크롤러/어그리게이터] ──→ [보안 스캔] ──→ [ClawVerse DB]
[수동 등록] ─────┤         │                        │
[커뮤니티 제보] ──┘         ↓                        ↓
                    [메타데이터 추출]          [VirusTotal]
                    - 이름, 설명              [코드 패턴 분석]
                    - 권한 요구사항            [API 키 탈취 탐지]
                    - 의존성                  [커뮤니티 신고]
                    - 호환성 정보                    │
                           │                        │
                           ↓                        ↓
                    [카테고리 자동분류]     [보안 등급 부여]
                           │                        │
                           └────────┬───────────────┘
                                    ↓
                           [ClawVerse 프론트엔드]
                           - 통합 검색
                           - 필터 (보안/카테고리/소스)
                           - 스킬 카드 렌더링
                           - 비교/추천
```

---

## MVP 우선순위 (수정)

### Phase 0 (지금)
- [x] 컨셉 문서
- [x] 랜딩 페이지
- [x] 시딩용 프로젝트 목록 (38개)
- [ ] 도메인 확보
- [ ] Discord 커뮤니티

### Phase 1: 스킬 허브 MVP (1~4주)
1. ClawHub API 크롤링 → DB 저장
2. awesome-openclaw-skills 카테고리 매핑
3. 기본 검색/필터 UI
4. VirusTotal 연동 (보안 뱃지)
5. 스킬 상세 페이지

### Phase 2: 배포 가이드 + 프로젝트 디렉토리 (5~8주)
1. 배포 옵션 비교 페이지
2. "나에게 맞는 배포법" 퀴즈
3. 프로젝트 디렉토리 (38개 시딩)
4. 커뮤니티 리뷰 시스템

### Phase 3: 커뮤니티 + 뉴스 (9~12주)
1. 토론 포럼
2. 주간 픽
3. 스택 큐레이션
4. Pulse (뉴스피드)

### Phase 4: 에이전트 레이어 (13주+)
1. 에이전트용 API
2. A2A 발견
3. Pro/Enterprise 플랜

---

*ClawVerse.io — Every Claw. One Universe.* 🦞
