# AGENTS.md

## Product Goal

이 저장소는 성진혁의 한국어 Java/Spring 포트폴리오다. 바쁜 면접관이 30초 안에 다음을 이해해야 한다.

1. 누구와 어떤 상황에서 만들었는가
2. 성진혁이 직접 맡은 범위는 무엇인가
3. 실제 화면이나 사용자 흐름을 연결하며 무엇이 드러났는가
4. 지금 다시 확인할 수 있는 공개 근거는 무엇인가

기술 목록이나 성능 숫자가 이야기보다 먼저 나오면 안 된다.

## Content Graph

- `src/content/projects.ts`: 프로젝트 이야기와 시간축
- `src/content/cases.ts`: 프로젝트 아래의 한 가지 엔지니어링 경계
- `src/content/flows.ts`: 단계별 재생 상태
- `src/content/diagrams.ts`: 새 inline SVG 구조도
- `src/content/sources.ts`: 공개 permalink와 owner-confirmed 사실의 단일 레지스트리

프로젝트는 product breadth와 협업 맥락, 사례는 하나의 failure boundary, Flow는 그 경계의 상태 전이를 맡는다. 홈에 별도 Featured Cases 섹션을 만들지 않는다.

## Evidence Rules

- 수치·기간·팀 규모·배포·사용자 수를 만들지 않는다.
- 코드·테스트 기술 주장은 commit-pinned GitHub URL이 있어야 한다.
- 팀 시연처럼 사용자가 직접 확인한 사실은 `owner-confirmed`로 기록할 수 있지만 기술 검증 근거로 사용하지 않는다.
- BorrowMe의 출처가 불완전한 과거 전후 수치를 다시 공개하지 않는다.
- Agent-Gate는 라이선스가 없으므로 오픈소스라고 부르지 않는다.
- FocusYou의 App Store 공개 출시나 외부 사용자 검증을 주장하지 않는다.
- Concert 결제는 항상 데모 결제라고 표시한다.
- Concert·Realtime의 공개 demoUrl이 없으면 CTA 자체를 숨긴다.

## Design Direction

- Bright Profile Hub: 밝은 커뮤니티 프로필과 selected work 흐름
- 배경 `#F6F8FA`, 표면 `#FFFFFF`, 본문 `#1F2328`, 액션 `#2457D6`
- 이름·프로필 이미지·실제 작업 미디어가 첫 인상을 만든다.
- terminal hero, dashboard card mosaic, glass, decorative gradient, dark mode를 사용하지 않는다.
- 프로젝트 미디어가 없는 과거 팀 작업에 가상의 실제 UI를 만들지 않는다.
- Flow node는 이동하지 않고 현재 node·edge·state만 전환한다.
- reduced-motion에서 전환을 제거한다.
- 320/390/768/1280px에서 문서 가로 overflow를 허용하지 않는다.

## Accessibility

- 모든 최상위 페이지 h1은 정확히 하나다.
- skip link, `aria-current`, 44px touch target을 유지한다.
- 모바일 메뉴와 dialog는 Escape로 닫혀야 한다.
- Flow는 키보드와 전체 transcript를 제공한다.
- axe serious/critical 위반은 0이어야 한다.

## Required Verification

```bash
npm run check:content
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
npm run e2e
npm run resume:pdf
npm audit --omit=dev --audit-level=high
```

## Preservation

사용자의 기존 dirty worktree와 미추적 파일을 수정하거나 삭제하지 않는다. 새 사실은 source registry에서 시작하며 컴포넌트 안에 복사하지 않는다.
