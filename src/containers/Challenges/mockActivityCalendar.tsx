export type DayItem = {
  date: string;
  count: number;
};

export type ActivityCalendarAPI = {
  month?: string;
  days?: DayItem[];
  today?: string;
  registeredDate?: string;
};
