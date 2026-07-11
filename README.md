# 성진혁 — Story-first Product Profile

팀 프로젝트에서 Spring API를 실제 화면과 AWS 배포까지 연결하고, 개인 프로젝트에서는 실패 복구를 브라우저 E2E까지 검증한 과정을 보여주는 한국어 백엔드 포트폴리오입니다.

- Live: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)
- GitHub: [github.com/sjh9714](https://github.com/sjh9714)
- Email: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)

## 공개 정보 구조

```text
/                         홈
/projects                 대표 작업 4개
/projects/memory-of-year  팀 화면·AWS 배포
/projects/concert-booking 좌석 경합과 복구
/projects/realtime-chat   저장·전달·재연결
/projects/borrow-me       첫 협업과 대여 생명주기
/resume                   웹·PDF 이력서
```

이전 `/cases/*`, `/flows/*` 주소는 대응 프로젝트의 사례·Flow 앵커로 308 이동합니다. 별도 사례·Flow 목록, Blog, Additional Work는 공개하지 않습니다.

## 읽는 순서

1. 프로젝트를 시작한 맥락과 팀·개인 역할
2. 실제 화면 또는 완성한 사용자 여정
3. 클라이언트를 연결하며 발견한 전환점
4. 선택한 설계와 실패 복구 흐름
5. 공개 커밋·테스트와 주장하지 않는 범위

홈의 프로젝트 순서는 Memory of Year → Concert Booking → Realtime Chat → BorrowMe입니다.

## 콘텐츠 단일 원천

```text
projects.ts ── 프로젝트 스토리와 내장 Flow
sources.ts  ── 공개 permalink와 owner-confirmed 맥락
visuals.ts  ── 실제 화면 자산과 대체 설명
resume.ts   ── 웹 이력서와 PDF 데이터
```

- `owner-confirmed`는 기간·팀·배포·시연 같은 맥락에만 사용합니다.
- 기술 결과는 40자 merge SHA가 고정된 공개 GitHub permalink가 필요합니다.
- 팀 기여와 이후 개인 보강을 같은 시기의 결과처럼 쓰지 않습니다.
- 로컬 테스트를 운영 성능이나 사용자 결과로 확대하지 않습니다.

## 디자인과 접근성

선택된 제품 프로필 시안은 [`docs/design/story-first-option-1.png`](docs/design/story-first-option-1.png)에 보관합니다.

- 따뜻한 밝은 배경, cobalt action, compact metadata
- 실제 Memory 팀 화면과 Concert·Realtime 클라이언트 캡처 사용
- BorrowMe는 과거 화면이 없어 가상 제품 UI를 만들지 않음
- inline SVG 구조도와 좌표 기반 diagram renderer 미사용
- 내장 Flow의 URL state, 키보드, transcript, reduced-motion 지원
- 320/390/768/1280px overflow와 axe serious/critical 회귀 검사

## 개발

Node.js 22와 npm 10을 사용합니다.

```bash
npm ci
npm run dev
```

## 검증

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

Concert와 Realtime의 실제 클라이언트·Docker demo·E2E는 각 저장소에서 관리합니다. 공개 서버를 운영하지 않으므로 포트폴리오에 demo URL이나 준비 중 CTA를 노출하지 않습니다.
