export type ViewMode = "card" | "list";

export type Filters = {
  search: string;
  tags: string[];
  view: ViewMode;
  status: string[];
  difficulty: string[];
};
