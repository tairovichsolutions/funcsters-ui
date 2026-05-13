export interface ConnectionItem {
  id: string;
  name: string;
  Icon: string;
  connected: boolean;
  identifier?: string;
}

export const initialConnections: ConnectionItem[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    connected: false,
    Icon: "skill-icons:linkedin",
  },
  {
    id: "github",
    name: "GitHub",
    connected: true,
    Icon: "mdi:github",
  },
  {
    id: "gmail",
    name: "Gmail",
    connected: false,
    Icon: "logos:google-gmail",
  },
];
