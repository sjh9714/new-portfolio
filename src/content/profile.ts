export const profile = {
  initials: "SJH",
  name: "성진혁",
  role: "Backend Engineer",
  githubUrl: "https://github.com/sjh9714",
  email: "jinhyuk9714@gmail.com",
  blogUrl: "",
  headline:
    "동시성, 이벤트 정합성, 실시간 메시징, 과금/정산 도메인을 테스트와 수치로 검증하는 Java/Spring 백엔드 개발자입니다.",
  summary:
    "고동시성 예약, Kafka/Redis 기반 메시징, 멀티테넌트 과금 흐름을 문제-해결-결과 구조로 정리한 백엔드 포트폴리오입니다.",
} as const;

export const navigationItems = [
  { href: "/case-studies", label: "Case Studies" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "Contact" },
] as const;
