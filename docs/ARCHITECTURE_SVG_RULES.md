# Architecture SVG Rules

문제 구간 아키텍처 SVG는 raw SVG를 직접 편집하지 않습니다.

## Workflow

1. `src/architecture/specs/*.ts`에서 nodes / edges / containers를 수정합니다.
2. `npm run generate:architecture`로 `public/architecture/cases/*.svg`를 생성합니다.
3. `npm run check:architecture`로 spec과 generated SVG가 일치하는지 확인합니다.

## Case Diagram Rules

- 모든 node 좌표와 크기는 20px grid에 맞춥니다.
- 모든 edge는 `fromPort` / `toPort`에서 시작하고 끝납니다.
- edge는 직각 routing만 사용합니다. 대각선 path는 금지합니다.
- text는 `text` + `tspan`으로 수동 줄바꿈합니다.
- edge label은 흰 배경 rect 위에 렌더링합니다.
- `foreignObject`, PNG/JPG/WebP, 기술 아이콘, gradient는 사용하지 않습니다.
- generated SVG에는 source spec 경로와 “do not edit directly” 주석을 남깁니다.

## Overall Diagram Rules

`public/architecture/overall/*.svg`는 프로젝트 전체 맥락을 보여주는 수동 SVG입니다.
전체 구조를 크게 바꿀 때만 갱신하고, 문제 구간 상세 다이어그램과 같은 수치나 claim을 새로 만들지 않습니다.
