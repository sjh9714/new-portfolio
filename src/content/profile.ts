export const profile = {
  initials: "SJH",
  name: "성진혁",
  englishName: "JinHyuk Sung",
  role: "신입 Java/Spring 백엔드 개발자",
  email: "jinhyuk9714@gmail.com",
  githubUrl: "https://github.com/sjh9714",
  avatarUrl: "/profile-typewriter.jpg",
  headline:
    "2개월 팀 프로젝트에서 API를 실제 화면과 AWS에 연결했고, 이후 개인 프로젝트에서는 실패 복구를 브라우저 E2E까지 검증했습니다.",
  summary:
    "화면이 필요로 하는 백엔드 경계를 만들고, 실패한 사용자가 다음 행동을 선택할 수 있는지까지 확인합니다.",
} as const;

export const navigationItems = [
  { href: "/projects", label: "작업" },
  { href: "/resume", label: "이력서" },
] as const;
