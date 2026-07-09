# Portfolio Changelog

## 2026-07 Neutral Minimal 재구성

- 홈과 상세 페이지를 `문제 → 설계 판단 → 결과 → 근거` 순서의 구분선 기반 레이아웃으로 재구성했습니다.
- 프로젝트와 evidence는 `src/content/projects.ts`, 사례는 `src/content/portfolio-cases.ts`만 단일 원천으로 사용합니다.
- 공개 evidence를 `measured`와 `verified`로 제한하고 commit-pinned GitHub permalink를 필수로 만들었습니다.
- 향후 검증은 evidence에서 제거하고 상세 페이지의 접힌 `nextValidation`에만 둡니다.
- Concert 좌석 정합성과 Outbox/DLT 복구를 별도 사례로 분리했습니다.
- Realtime 사례를 조회 N+1이 아니라 구독 인가, room ordering, receiver completeness, reconnect 경계 중심으로 바꿨습니다.
- Billing 주장을 API Key, 사용량 idempotency, webhook, ledger 정합성으로 좁혔습니다.
- BorrowMe는 현재 snapshot과 query-count guard만 공개합니다.
- 웹 이력서와 A4 한 페이지 PDF를 동일한 TypeScript 데이터에서 생성합니다.
- prototype-key route, canonical/OG, 접근성, 반응형, PDF, Playwright/axe 회귀 검증을 추가했습니다.
