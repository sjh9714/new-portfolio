# feedback.md 구현 감사

이 문서는 `feedback.md`를 대표 레포 4개 기준으로 다시 쪼개 현재 작업 트리에서 확인되는
구현/문서/증거 상태를 기록한다. 목적은 포트폴리오 사이트의 문장과 GitHub 레포의 실제 증거가
어긋나지 않게 만드는 것이다.

## 감사 기준

- 새 수치나 운영 claim을 만들지 않는다.
- 이미 측정된 수치, local smoke, 시나리오 검증, 추가 측정 예정 항목을 분리한다.
- `feedback.md`가 요구한 항목 중 새 benchmark나 운영 환경 증거가 필요한 것은 완료로 간주하지 않는다.
- 각 레포는 기능 저장소가 아니라 포트폴리오 증거 저장소로 읽혀야 한다.

## 공통 요구사항

| 요구사항                                                                                                                                       | 현재 증거                                                                            | 상태 |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---- |
| README 상단에서 문제, 해결, 결과, 도메인을 바로 보여줄 것                                                                                      | 4개 대표 레포 README가 evidence matrix와 한계/문서 링크를 포함                       | 충족 |
| `docs/DESIGN.md`, `docs/PERF_RESULT.md`, `docs/TESTING.md`, `docs/RUNBOOK.md`, `docs/LIMITATIONS.md`, `docs/INTERVIEW_GUIDE.md` 구조를 맞출 것 | 4개 대표 레포 모두 해당 문서가 존재                                                  | 충족 |
| 측정 완료, 시나리오 검증, 추가 측정 예정 구분                                                                                                  | 각 README/PERF/LIMITATIONS와 포트폴리오 `projects.ts`, `portfolio-cases.ts`에서 분리 | 충족 |
| 운영 성능/운영 시스템 claim을 과장하지 않을 것                                                                                                 | 각 레포 LIMITATIONS와 포트폴리오 case limitations에서 production claim을 제한        | 충족 |
| 새 수치를 만들지 않을 것                                                                                                                       | 포트폴리오 테스트가 placeholder/pending/legacy term guard를 포함                     | 충족 |

## Concert Booking

### feedback.md 요구사항

- D/E/F k6 시나리오를 pending에서 검증 가능한 evidence로 올리기.
- Runbook, lock strategy guide, Outbox 상태 전이, monitoring template을 보강하기.
- 관측성은 metric 설명에 그치지 말고 dashboard/alerting/SLO는 실제 증거가 있을 때만 주장하기.

### 현재 증거

- `README.md`: 동일 좌석 100 concurrent, 분산 좌석 50명, mixed load 200 VU, D/E/F repeat 검증을 분리.
- `docs/PERF_RESULT.md`: 측정 환경과 k6 evidence를 정리.
- `docs/RUNBOOK.md`: 예약 경합, Outbox/DLT, Redis reconciliation 대응 절차.
- `docs/LOCK_STRATEGY_GUIDE.md`: pessimistic/optimistic/Redis lock 선택 기준.
- `docs/TESTING.md`, `docs/LIMITATIONS.md`, `docs/INTERVIEW_GUIDE.md`: 테스트 범위와 주장하지 않는 항목.
- `docs/evidence/`: D/E/F local repeat와 k6 artifact 보존.
- `monitoring/`: Prometheus/Grafana/alert rule template.
- `SPRING_PROFILES_ACTIVE=local-monitoring`, `docker-compose.monitoring.yml`, `monitoring/prometheus.local.yml`:
  로컬 전용 ADMIN bootstrap과 bearer-token Prometheus/Grafana harness.
- `scripts/capture-monitoring-evidence.sh`, `scripts/validate-monitoring-evidence.py`,
  `scripts/test-monitoring-evidence-validator.py`: 실제 local Prometheus target/rule/query artifact를
  `capture-summary.json`으로 검산하는 도구. production observability claim은 하지 않음.
- `PrometheusScrapeContractIntegrationTest`: alert rule과 Grafana dashboard가 참조하는 metric name을 보호된
  `/actuator/prometheus` 응답과 대조.
- `monitoring/alert-rules.test.yml`: synthetic time series 기반 alert rule expression unit test.
- `.github/workflows/ci.yml`: Prometheus config, alert rule, Grafana dashboard JSON syntax check와 alert rule unit test.
- 포트폴리오 `src/content/portfolio-cases.ts`: Outbox/DLT case에 `혼합 부하 측정 조건`과 D/E/F formal local repeat 검증 조건 연결.
- 실제 Outbox enum은 `PENDING`, `PUBLISHED`, `FAILED`, `DEAD`이다. `CONSUMED`는 현재 코드의
  Outbox 상태가 아니므로 구현된 상태 전이처럼 문서화하지 않는다.

### 상태

- 대표 포트폴리오 증거 저장소 기준은 충족.
- D/E/F는 branch/threshold checks 기반의 formal local repeat evidence이며, throughput/latency/error-rate
  성능 측정 완료 근거가 아니다.
- 실제 Prometheus server scrape 결과, alert firing 결과, Grafana 운영 screenshot, tracing/SLO 운영 증거는 아직 없다.
- 따라서 monitoring은 local-only scrape harness, actuator metric name contract, template syntax,
  synthetic alert rule test, 로컬 운영 초안으로만 설명해야 하며 운영 실적 claim은 추가 측정 예정으로 유지한다.

## Realtime Chat

### feedback.md 요구사항

- connection smoke와 실제 message delivery 품질을 분리하기.
- send-to-receive p50/p95/p99, delivery completeness, mixed traffic, room ordering을 측정하기.
- Redis presence/rate limit/cache 한계를 문서화하기.

### 현재 증거

- `README.md`: 조회 API RPS/p95/N+1 측정, WebSocket smoke, 50-user/500-user receiver matrix local repeat3를 분리.
- `docs/PERF_RESULT.md`: N+1 개선, 50-user repeat3, 500-user repeat3 local receiver matrix evidence.
- `docs/WEBSOCKET_MEASUREMENT.md`: sender/receiver matrix 측정 절차와 claim boundary.
- `docs/REDIS_LIMITATIONS.md`: Redis presence, reconnect, rate-limit/cache 한계.
- `docs/TESTING.md`, `docs/LIMITATIONS.md`, `docs/RUNBOOK.md`, `docs/INTERVIEW_GUIDE.md`: 검증 범위와 pending 항목.
- `scripts/delivery-matrix*.mjs`: receiver matrix 실행/스모크 도구.
- `scripts/ws-delivery-runner.mjs`: `--rooms`, `--users-per-room`, `--senders-per-room` 옵션으로
  multi-room receiver matrix 후보 artifact를 만들 수 있음.
- `scripts/delivery-matrix.mjs`: `byRoom` summary로 room별 expected/actual/missing/unexpected denominator를 분리.
- `docs/evidence/DELIVERY_MATRIX_BY_ROOM_GUARD_2026-05-22.md`: cross-room receive가 aggregate에 묻히지 않는
  deterministic fixture guard.
- `scripts/ws-delivery-runner.mjs`: `--mixed-http-probes true` 옵션으로 room list, message history, read
  receipt HTTP probe를 `http.jsonl`과 `mixedHttp` summary로 분리. receiver denominator는 smoke fixture로 불변 확인.
- `scripts/ws-delivery-runner.mjs`: 성공 artifact에 `manifest.json`을 저장해 실행 옵션, expected sessions/rooms/messages,
  mixed HTTP probe 포함 여부, claim boundary를 남김.
- `scripts/validate-delivery-evidence.mjs`, `scripts/delivery-evidence-validator-smoke-test.mjs`: manifest, summary,
  raw JSONL, regenerated summary, byRoom coverage, mixedHttp failed 0 조건을 검산해 artifact 승격 전 claim boundary를 확인.
- `.github/workflows/ci.yml`: 현재 README 문구에 맞춘 pending boundary policy와
  `delivery-evidence-validator-smoke-test.mjs` 실행으로 validator 계약을 CI에서 확인.
- `docs/evidence/DELIVERY_EVIDENCE_VALIDATOR_MANIFEST_2026-05-22.md`: 실제 2-user local artifact의
  `manifest.json`, raw JSONL, `summary.json`, `byRoom` 검산이 통과한 작은 시나리오 검증. benchmark claim은 하지 않음.
- `docs/evidence/receiver-matrix-500users-20260522-summary.json`: 500-user repeat3 aggregate evidence.
- 포트폴리오 `src/content/projects.ts`: 50-user repeat3와 500-user repeat3를 local snapshot으로만 표시하고, 1,000 session benchmark는 pending 유지.

### 상태

- “연결 가능”과 “전달 품질”을 분리하라는 핵심 요구는 충족.
- 50-user/500-user local repeat3는 시나리오 검증 근거로 사용할 수 있다.
- current evidence는 local single-room receiver matrix와 room별 denominator/evidence validator guard에 강하다.
  runner는 multi-room 후보 artifact를 만들고 manifest/validator로 승격 전 검산할 수 있게 보강했지만,
  feedback.md가 예로 든 10 rooms x 50 users, 50 msg/s, 100 msg/s, 1,000 session benchmark 결과는 아직 없다.
- room ordering은 통합 테스트와 sender-local diagnostic으로 보조 설명할 수 있지만, messageId/Kafka offset 기준
  room-global ordering under load evidence는 아직 없다.
- 1,000 session benchmark, mixed traffic p95, room-global ordering, cache hit/miss ratio, Redis rate-limit burst 비교,
  운영형 latency claim은 새 benchmark/metric evidence가 필요하므로 미완료/pending이다.

## AI Usage Billing Gateway

### feedback.md 요구사항

- invoice scheduler, strict quota reservation, refund reversal ledger, gateway request idempotency를 구현하기.
- mixed usage k6 benchmark를 준비하되 실제 throughput/latency/error-rate가 없으면 pending으로 둘 것.
- dashboard/alerting/tracing/SLO는 실제 운영 증거 없이 주장하지 않을 것.

### 현재 증거

- `README.md`: API Key, usage idempotency, quota counter reservation, invoice scheduler, webhook, refund reversal ledger, append-only ledger를 evidence matrix로 분리.
- `src/main/java/.../billing/MonthlyInvoiceScheduler.java`: 월별 invoice scheduler.
- `src/main/java/.../quota/QuotaService.java`, `QuotaCounterRepository.java`, `V10__create_quota_counters.sql`: monthly quota counter reservation.
- `src/main/java/.../gateway/GatewayService.java`: gateway retry idempotency와 usage record 흐름.
- `README.md`: gateway 호출 흐름을 실제 구현 순서인 gateway retry 확인, usage event + quota reservation,
  Redis rate limit, mock response 순서로 맞춤.
- `src/main/java/.../ledger/LedgerService.java`, `V9__add_ledger_original_transaction_group.sql`: refund reversal ledger와 original group 추적.
- `src/test/java/.../MonthlyInvoiceSchedulerIT.java`, `ApiKeyUsageQuotaIT.java`, `BillingPaymentLedgerAuditIT.java`, gateway/quota/billing tests: 시나리오 검증.
- `k6/mixed-usage-test.js`, `scripts/run-full-mixed-evidence.sh`,
  `scripts/validate-k6-full-mixed-summary.mjs`, `docs/evidence/K6_EVIDENCE_MANIFEST.md`, `docs/PERF_RESULT.md`:
  mixed usage smoke, 반복 artifact capture 절차, summary validator, benchmark claim boundary.
- `K6_REQUIRE_OPTIONAL_PATHS=true`: full mixed smoke readiness guard에서 모든 check 통과, HTTP failure 0,
  invoice/webhook branch 1회 이상, optional skip 0건을 threshold와 summary validator로 강제.
- `scripts/summarize-full-mixed-evidence.mjs`, `scripts/test-k6-evidence-tools.mjs`: repeated capture directory를
  `capture-summary.json` readiness metadata로 묶고, 실패/누락 summary를 거부한다. 이 rollup은 benchmark
  aggregate를 만들지 않는다.
- `MetricsService`: gateway request/rate-limit, idempotency conflict, webhook conflict, ledger group created 같은
  low-cardinality outcome counter를 등록.
- `docs/RUNBOOK.md`: scheduler/quota/Prometheus/dashboard/tracing/SLO artifact가 있어야 운영 증거로 승격한다는 경계.

### 상태

- feedback.md의 핵심 구현 항목은 시나리오 검증 수준으로 충족.
- full mixed smoke readiness guard, 반복 evidence capture script, summary validator, capture rollup, outcome counter는
  보강됐지만 review된 반복 benchmark throughput/latency/error-rate, production scheduler lock/partitioning, quota
  reconciliation dashboard, tracing/SLO 운영 증거는 없다.
- 따라서 AI Billing은 “성능 측정 완료”가 아니라 “정합성/보안 시나리오 검증 + mixed smoke 준비”로 표현해야 한다.

## BorrowMe

### feedback.md 요구사항

- CI badge/workflow를 추가하기.
- N+1 개선 문서, 예약 정합성 문서, 팀 기여 문서, Testcontainers/query-count guard, Flyway 또는 migration 전략을 보강하기.
- 팀 프로젝트에서 본인 기여와 원본 수치의 한계를 흐리지 않을 것.

### 현재 증거

- `.github/workflows/ci.yml`: Java 17 기반 test/build CI.
- `README.md`: CI badge, 원본 측정 기록, 현재 local snapshot, query-count guard, Flyway baseline validation, 팀 기여 범위.
- `docs/PRODUCT_LIST_PERF.md`: 상품 목록 N+1 개선, 원본 README 수치, 현재 query-count/EXPLAIN guard, 한계.
- `docs/RESERVATION_CONSISTENCY.md`: 재고 50/100 concurrent reservation consistency와 k6 snapshot.
- `docs/TEAM_CONTRIBUTION.md`: 11인 팀 프로젝트에서 본인 담당 범위와 claim boundary.
- `docs/MIGRATION_STRATEGY.md`: Flyway baseline validation과 production migration claim 제한.
- `src/test/java/.../ProductQueryTest.java`, `ReservationConcurrencyTest.java`, `FlywayMigrationTest.java`: MySQL Testcontainers 기반 guard.
- `ProductQueryTest`: `FollowService.getFollowedUserIds()` bulk follow lookup이 SQL 1회로 유지되는지 guard.
- `ProductQueryTest`: 인증 `GET /api/products` 응답에서 팔로우 여부 true/false와 SQL 5회 이하를 guard.
- `ProductQueryTest`: ranking data path의 상위 사용자, 최근 상품, 팔로우 여부 조회 조합이 SQL 5회 이하로 유지되는지 guard.
- `ProductQueryTest`: `GET /ranking` handler/model assembly에서 topUsers/currentUser/recentProducts/followed
  flag 구성과 SQL 6회 이하를 guard. README evidence table에서도 no-op view 기반 handler/model assembly이며
  실제 템플릿 렌더링 시간이나 HTTP 성능 claim은 아님을 명시.
- `ProductQueryTest`: 운동 추천/검색 응답의 exercise hashtag DTO 변환이 SQL 1회로 유지되는지 guard.
- `docs/evidence/k6/`, `docs/evidence/explain/`: local snapshot과 EXPLAIN artifact.
- 포트폴리오 `src/content/projects.ts`: BorrowMe 쿼리 수 evidence label을 `상품 목록 쿼리 수 원본 기록 + 현재 guard`로
  바꿔 원본 README 기록과 현재 query-count guard의 경계를 라벨에서부터 드러냄.

### 상태

- repo 마감과 기본기 증거 저장소 요구는 충족.
- 원본 p95/throughput raw artifact는 보존되어 있지 않으므로 원본 README 기록으로만 설명해야 한다.
- clean commit 기준 반복 측정, ranking HTTP 렌더링 성능, remote CI 성공 결과는 후속 증거가 필요하다.

## 남은 항목의 성격

| 항목                                              | 왜 아직 완료가 아닌가                                                                                                              | 다음 행동                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Realtime 1,000 session p50/p95/p99                | 현재 50/500-user local repeat3까지만 증거가 있음                                                                                   | 1,000 session benchmark 실행 및 artifact 보존                     |
| Realtime mixed traffic p95 / room-global ordering | 별도 scenario와 artifact가 필요                                                                                                    | mixed benchmark script와 반복 실행                                |
| AI Billing full mixed benchmark                   | smoke는 있지만 반복/환경 고정 benchmark가 아님                                                                                     | hardware/JVM/DB/Redis 조건과 p50/p95/p99/error-rate 기록          |
| Concert monitoring 운영 증거                      | local monitoring harness와 capture validator는 있으나 실제 Prometheus server scrape artifact/alert firing/dashboard 운영 결과 없음 | local Prometheus server scrape + alert test + screenshot/evidence |
| BorrowMe clean commit repeated perf               | 현재 snapshot은 dirty worktree artifact                                                                                            | clean commit 후 재측정 artifact 보존                              |
| BorrowMe ranking HTTP rendering/perf              | handler/model assembly guard는 추가됐으나 실제 템플릿 렌더링 시간이나 HTTP 성능 수치는 아님                                        | 템플릿 렌더링/HTTP 경로 raw artifact 보존                         |

## 현재 결론

`feedback.md`의 “레포를 포트폴리오 증거 저장소로 바꾸라”는 요구는 네 대표 레포 모두 상당 부분 충족했다.
다만 목표 전체 완료를 주장하려면 위의 남은 benchmark/운영 증거가 필요하다. 현재 상태에서는 다음처럼 말하는
것이 가장 안전하다.

- Concert Booking: 대표 1순위, 동시성/정합성/Outbox 근거는 강함. 운영 monitoring은 actuator contract/template 수준.
- Realtime Chat: 조회 API/N+1과 50/500-user local receiver matrix는 검증됨. 1,000/mixed/운영 지연은 pending.
- AI Billing: invoice/quota/refund/gateway idempotency는 시나리오 검증됨. full benchmark와 운영 SLO는 pending.
- BorrowMe: N+1/예약/Flyway/Testcontainers/팀 기여 증거는 보강됨. 원본 p95 raw artifact와 clean repeat는 pending.
