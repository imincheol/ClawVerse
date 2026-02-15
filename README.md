# ClawVerse
clawverse.io - Every Claw. One Universe.

## Operations

- 매일 동기화: `GitHub stars` + `ClawHub skills` + `newsletter` 트리거는 `docs/data-sync-llm-skill.md`의 `clawverse-research-sync`로 실행합니다.
- 신규 후보 발굴: GitHub/ClawHub 검색 기반 자동 후보 생성은 `clawverse-discovery-scan`으로 처리하고, 승인/반영은 `submissions` 큐에서 진행합니다.

- [LLM 실행용 수동 리서치/동기화 스킬 문서](docs/data-sync-llm-skill.md): GitHub/ClawHub 동기화 및 뉴스레터 트리거를 한 번에 실행하는 재사용 템플릿입니다.

## Product metrics

- 프로젝트 상세 페이지: 최근 30일 GitHub growth snapshots + page view 통계
- 스킬 상세 페이지: page view 통계
- API:
  - `GET /api/metrics/projects/[slug]/growth?days=30`
  - `GET /api/metrics/page-views?path=/projects/xxx&days=30`
- 수집 이벤트: `POST /api/analytics/page-view`
