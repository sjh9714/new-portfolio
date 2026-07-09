# AGENTS.md

## Product Goal

이 저장소는 한국어 Java/Spring 백엔드 개발자 포트폴리오다.

바쁜 면접관이 30초 안에 다음 순서로 강점을 이해할 수 있어야 한다.

1. 문제
2. 설계 판단
3. 결과
4. 재현 가능한 근거

대표 영역은 동시성, 이벤트 복구, 실시간 메시징, API Key·사용량·Webhook·Ledger 정합성이다.

## Content Source

- 공개 프로젝트와 evidence의 단일 원천은 `src/content/projects.ts`다.
- 상세 사례의 단일 원천은 `src/content/portfolio-cases.ts`다.
- MDX나 컴포넌트 안에 별도 사실·수치를 복사하지 않는다.
- Hero와 카드의 수치는 evidence ID에서 파생한다.
- 공개 evidence에는 commit-pinned GitHub permalink가 반드시 있어야 한다.

## Non-negotiable Rules

- 수치, 기간, 학력, 경력, 기여 내용을 만들지 않는다.
- 측정 수치는 날짜·시나리오·환경이 모두 있을 때만 `measured`로 공개한다.
- 반복 가능한 테스트는 방법과 permalink가 있을 때만 `verified`로 공개한다.
- `pending`은 evidence 상태로 사용하지 않는다.
- 향후 작업은 카드나 지표가 아니라 상세 페이지의 `nextValidation`에만 둔다.
- BorrowMe의 과거 `1,010→23ms`, `201→3` 비교는 공개하지 않는다.
- Billing은 실제 근거가 있는 API Key, idempotency, webhook, ledger 경계만 주장한다.
- vague marketing copy와 운영·production 성능을 암시하는 문구를 쓰지 않는다.

## Featured Content Contract

대표 프로젝트는 다음 필드를 모두 가진다.

1. 문제
2. 설계 판단
3. 결과
4. 공개 근거
5. 기술 스택 최대 5개
6. 사례 및 GitHub 링크

모든 대표 사례는 다음 섹션을 가진다.

- 요약
- 문제
- 단순 구현에서의 문제
- 구조와 흐름
- 설계 판단
- 검증 결과
- 근거
- 한계와 다음 확인
- 예상 면접 질문

각 본문 섹션은 1~3개 bullet로 유지한다.

## Design Direction

- 순백색·쿨그레이·스틸블루 기반 Neutral Minimal
- 카드 모자이크보다 구분선, 큰 타이포, 여백, 비대칭 컬럼 사용
- 그림자, 그래디언트, 글래스, 장식 이미지, 다크 모드 사용 금지
- 외부 웹폰트 없이 한국어 시스템 산세리프와 시스템 모노스페이스 사용
- motion은 hero 진입, 프로젝트 행 hover, 구조도 modal에만 사용
- `prefers-reduced-motion`에서 motion 제거
- 320/390/768/1280px에서 문서 가로 overflow 금지
- 터치 영역 최소 44px, 주요 페이지 h1 정확히 하나
- skip link, `aria-current`, 키보드 메뉴·modal 동작 유지

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 스타일 primitives
- lucide-react
- Vitest
- Playwright + axe

## Required Verification

마무리 전에 다음 명령을 순서대로 통과시킨다.

```bash
npm run check:architecture
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
npm run e2e
npm audit --omit=dev --audit-level=high
```

PDF 변경 시 추가로 실행한다.

```bash
npm run resume:pdf
```

## Done Criteria

- 콘텐츠 validator, TypeScript, format, lint, build가 모두 통과한다.
- Playwright와 axe serious/critical 회귀가 통과한다.
- prototype-key 사례 slug가 404이고 legacy alias가 308이다.
- unsupported metric과 pending evidence가 공개 HTML에 없다.
- 모든 canonical, OG title/URL이 현재 route와 일치한다.
- PDF가 A4 한 페이지이며 잘림·빈 페이지가 없다.
- `npm audit --omit=dev`의 high/critical이 0이다.
- 사용자가 둔 미추적 파일을 수정하거나 삭제하지 않는다.
