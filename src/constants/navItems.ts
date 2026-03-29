import { Navigation } from "./navigation";

export interface NavItemProps {
  id: string;
  name: string;
  href: string | ((id: string) => string);
  icon?: string;
}

export const NavItems: NavItemProps[] = [
  {
    id: "0",
    name: "Challenges",
    href: Navigation.Challenges,
  },
  {
    id: "lobby",
    name: "Lobby (50)",
    href: Navigation.Lobby,
  },
];

export const ChallengesItems: NavItemProps[] = [
  {
    id: "0",
    name: "Challenges Detail",
    href: Navigation.ChallengesDetail,
    icon: "codicon:question",
  },
  {
    id: "1",
    name: "Community Solutions",
    href: Navigation.CommunitySolutions,
    icon: "token:chat",
  },
  {
    id: "2",
    name: "Thinking Assistant",
    href: Navigation.ThinkingAssistant,
    icon: "hugeicons:idea-01",
  },
];
