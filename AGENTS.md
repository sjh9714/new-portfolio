# AGENTS.md

## 제품 목표

이 저장소는 신입 Java/Spring 백엔드 개발자 성진혁의 한국어 포트폴리오다. 바쁜 면접관이 30초 안에 다음 사실을 파악할 수 있어야 한다.

1. 팀 프로젝트에서 API를 실제 화면과 AWS 배포까지 연결했다.
2. 개인 프로젝트에서 동시성·재시도·재연결 실패를 클라이언트와 브라우저 E2E로 재현했다.
3. 팀 기여와 이후 개인 보강의 시점을 구분한다.
4. 기술 주장은 공개 커밋과 테스트 permalink로 확인할 수 있다.

## 공개 정보 구조

- `/`
- `/projects`
- `/projects/memory-of-year`
- `/projects/concert-booking`
- `/projects/realtime-chat`
- `/projects/borrow-me`
- `/resume`

`/cases/*`와 `/flows/*`는 새 콘텐츠 페이지가 아니라 대응 프로젝트의 앵커로 308 이동하는 legacy 경로다. Blog, Additional Work, Billing, Agent-Gate, FocusYou는 공개하지 않는다.

## 콘텐츠 단일 원천

- 프로젝트 스토리와 내장 Flow: `src/content/projects.ts`
- 공개 근거: `src/content/sources.ts`
- 실제 시각 자료 메타데이터: `src/content/visuals.ts`
- 웹 이력서와 PDF: `src/content/resume.ts`

페이지와 컴포넌트에 프로젝트 사실이나 수치를 다시 복사하지 않는다.

## 사실과 근거 규칙

- 수치, 기간, 팀 규모, 경력, 학력, 수상, 사용자 수를 만들지 않는다.
- `owner-confirmed`는 팀 규모·기간·배포·시연 같은 맥락에만 사용한다.
- 기술 결과는 공개 저장소의 40자 merge SHA가 포함된 commit-pinned permalink가 필수다.
- private PR URL을 공개 근거로 사용하지 않는다.
- BorrowMe의 과거 `1,010→23ms`, `201→3` 비교를 공개하지 않는다.
- 로컬·통합·브라우저 테스트를 운영 성능이나 실사용자 결과로 표현하지 않는다.
- 팀 결과와 개인 후속 보강의 시점을 섞지 않는다.

## 프로젝트 순서와 역할

1. Memory of Year — 팀 화면·AWS 배포 경험
2. Concert Booking — 좌석 경합 패자의 복구와 이벤트 실패 복구
3. Realtime Chat — persist-before-broadcast와 재연결 동기화
4. BorrowMe — 첫 백엔드 협업과 2026 대여 생명주기

홈에는 위 네 프로젝트만 노출한다.

## 디자인 방향

- 선택된 `docs/design/story-first-option-1.png`을 기준으로 한다.
- 따뜻한 밝은 배경, 진한 본문, cobalt 액션, compact metadata를 사용한다.
- hero는 짧게 유지하고 900px 높이 안에 첫 프로젝트 진입점을 보여준다.
- 실제 작업 화면을 설명보다 늦게 배치하지 않는다.
- Memory는 실제 팀 화면, Concert·Realtime은 실제 클라이언트 캡처를 사용한다.
- BorrowMe는 과거 화면이 없으므로 가상 제품 UI를 만들지 않는다.
- handcrafted SVG, inline SVG 구조도, CSS로 그린 가상 화면, AI 생성 서비스 화면을 사용하지 않는다.
- 외부 웹폰트, 다크 모드, glass, gradient, terminal UI, dashboard 모자이크를 사용하지 않는다.
- 본문은 16px 이상, 데스크톱 제목은 약 56px 이하, 모바일 제목은 약 38px 이하를 기준으로 한다.
- 320/390/768/1280px에서 문서 가로 overflow를 허용하지 않는다.
- 터치 영역은 44px 이상, 정상 페이지의 h1은 하나다.

## 내장 Flow

- Flow는 프로젝트 상세 안의 sticky 상태 카드와 단계 목록으로 제공한다.
- 기본은 정지이며 사용자가 재생할 때만 약 2.5초 간격으로 진행한다.
- URL `flow`, `variant`, `step`, 이전/다음, Space, 화살표, Home/End를 지원한다.
- 현재 단계는 `aria-live`로 읽고 전체 transcript를 제공한다.
- 모바일은 모든 단계를 세로로 읽을 수 있어야 하며 자동 재생하지 않는다.
- `prefers-reduced-motion`에서는 자동 재생을 비활성화한다.

## 필수 검증

```bash
npm run check:content
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
npm run e2e
npm run resume:pdf
npm run resume:check -- public/resume-sung-jinhyuk-backend.pdf
npm audit --omit=dev --audit-level=high
```

완료 전 실제 브라우저에서 390px·1280px 화면을 선택 시안과 나란히 비교하고 `design-qa.md`의 최종 결과를 `passed`로 남긴다. 사용자가 둔 미추적 파일이나 다른 작업트리는 수정하거나 삭제하지 않는다.
