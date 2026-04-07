export const Navigation = {
  Root: "/",
  NotFound: "/*",
  Challenges: `/challenges`,
  CrashCourse: `/crash-course`,
  ChallengesDetail: (id: string) => `/challenges/${id}/detail`,
  CommunitySolutions: (id: string) => `/challenges/${id}/community-solutions`,
  ThinkingAssistant: (id: string) => `/challenges/${id}/thinking-assistant`,
  Lobby: "/lobby",
};
