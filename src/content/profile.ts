export const profile = {
  initials: "SJH",
  name: "성진혁",
  englishName: "JinHyuk Sung",
  role: "Java / Spring Backend Developer",
  email: "jinhyuk9714@gmail.com",
  githubUrl: "https://github.com/sjh9714",
  avatarUrl: "/profile-typewriter.jpg",
  headline:
    "팀에서 만든 기능을 실제 화면에 연결하고, 시간이 지나도 깨지지 않도록 다시 검증합니다.",
  summary:
    "협업에서 맡은 범위를 분명히 남기고, 혼자 만든 시스템도 사용 가능한 제품 흐름과 재현 가능한 테스트까지 연결합니다.",
} as const;

export const navigationItems = [
  { href: "/projects", label: "Work" },
  { href: "/flows", label: "Flows" },
  { href: "/resume", label: "Resume" },
] as const;
