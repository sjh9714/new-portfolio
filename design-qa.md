# Design QA — Story-first Product Profile

기준 시안: `docs/design/story-first-option-1.png`

구현 화면: Playwright Chromium, 1280×900과 390×844, reduced-motion 적용 후 전체 페이지 캡처

비교 이미지: `docs/design/design-qa-comparison.png` (왼쪽 기준 시안, 오른쪽 구현)

## 비교 결과

| 항목          | 확인 결과                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| 정보 위계     | 이름과 지원 직무가 먼저 보이고, 구체적인 경험 문장·CTA·경험 요약이 같은 첫 화면에 들어온다.                          |
| 프로젝트 선택 | Memory of Year를 실제 화면과 함께 크게 보여준 뒤 Concert, Realtime, BorrowMe를 compact row로 제공한다.               |
| 시각 언어     | 따뜻한 밝은 배경, 진한 본문, cobalt action, 얇은 경계와 compact metadata가 시안과 일치한다.                          |
| 사실성        | 시안의 가상 휴대폰 frame, 가상 체크 항목, 확인되지 않은 팀·기술 수치를 복사하지 않았다.                              |
| 이미지        | Memory 팀 화면, Concert·Realtime 실제 클라이언트, diagrams.net PNG만 사용한다. BorrowMe에는 가상 화면이 없다.        |
| 가독성        | 본문 16px 이상, 짧은 hero, 프로젝트마다 맥락·역할·전환점을 같은 위치에서 확인할 수 있다.                             |
| 모바일        | 390px에서 이름·소개·주 CTA가 먼저 보이고, Memory와 나머지 세 작업이 한 열로 이어진다. Flow 자동 재생은 비활성화된다. |
| 접근성        | h1 하나, skip link, 현재 메뉴, 키보드 Flow, transcript, reduced-motion, axe serious/critical 0을 확인했다.           |
| 반응형        | 320/390/768/1280px의 공개 7개 경로에서 문서 가로 overflow가 없다.                                                    |
| 성능          | 390px 홈의 첫 로드가 15 requests와 300KB transfer 예산 안에 있다.                                                    |

시안과 다른 부분은 실제 사실을 지키기 위한 변경이다. 가상 단일 휴대폰 화면 대신 네 실제 팀 화면을 한 장으로 묶었고, 기술 배지와 완료 체크 대신 역할·전환점·공개 근거를 배치했다. 별도 Cases·Flows와 보조 프로젝트도 홈에서 제거했다.

final result: passed
