# 성진혁 — Story-first Backend Portfolio

팀에서 실제 화면까지 연결한 경험과, 개인 시스템 프로젝트를 사용 가능한 제품 흐름으로 끝낸 과정을 함께 보여주는 Bright Profile Hub입니다.

- Live: [new-portfolio-smoky-one-41.vercel.app](https://new-portfolio-smoky-one-41.vercel.app)
- GitHub: [github.com/sjh9714](https://github.com/sjh9714)
- Email: [jinhyuk9714@gmail.com](mailto:jinhyuk9714@gmail.com)

## Information architecture

```text
/                    Profile Hub
/projects            Selected work
/projects/[project]  Project story
/cases               Engineering case index
/cases/[case]        One engineering boundary
/flows               Interactive flow index
/flows/[flow]        Interactive state playback
/resume              Web/PDF resume source
```

Project, Case, Flow의 역할을 분리합니다.

- Project: 팀·사용자·역할·시간에 따른 변화
- Case: 사용자에게 영향을 주는 하나의 failure boundary
- Flow: 문제와 개선 흐름을 단계별 상태로 재생
- Source: 공개 permalink와 owner-confirmed 사실의 provenance

## Selected work

1. BorrowMe — 팀 알림·프론트 연동과 이후 조회·재고 회귀 보강
2. Concert Booking — 좌석 경쟁을 실제 예약·복구 경험으로 연결
3. Realtime Chat — persisted delivery와 reconnect를 실제 채팅 UI로 연결
4. Memory of Year — 간지톤 팀에서 맡은 인증·앨범·편지·사진 기반

## Content source

모든 공개 내용은 `src/content`의 TypeScript graph에서 파생됩니다.

```text
projects.ts  → cases.ts → flows.ts
      └──────── sources.ts
diagrams.ts ────────────┘
```

코드와 테스트 주장은 commit-pinned GitHub permalink가 필요합니다. 사용자가 확인한 팀 시연 같은 사실은 별도의 `owner-confirmed` source로 기록하며 기술 검증과 섞지 않습니다.

## Development

```bash
npm install
npm run dev
```

Node.js 22와 npm 10을 사용합니다.

## Verification

```bash
npm run check:content
npm run format:check
npm run typecheck
npm test
npm run lint
npm run build
npm run e2e
npm run resume:pdf
npm run resume:check
npm audit --omit=dev --audit-level=high
```

PDF를 다시 만들 때:

```bash
npm run build
npm run resume:pdf
```

## Deployment boundary

포트폴리오는 Vercel에 배포합니다. Concert와 Realtime의 실제 클라이언트·Docker demo·E2E는 각 저장소에서 관리하지만 공개 서버를 운영하기 전까지 `demoUrl`과 준비 중 CTA를 노출하지 않습니다.
