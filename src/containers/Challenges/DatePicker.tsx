"use client";

import React from "react";
import Calendar from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayItem } from "./mockActivityCalendar";

type DatePickerProps = {
  activityData?: DayItem[];
};

const buildActivityIndex = (days?: DayItem[]) => {
  const map = new Map<string, number[]>();

  if (!days) return map;

  for (const item of days) {
    if (item.count <= 0) continue;

    const d = new Date(item.date);
    if (Number.isNaN(d.getTime())) continue;

    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const list = map.get(key) ?? [];
    list.push(d.getDate());
    map.set(key, list);
  }

  return map;
};

export const DatePicker: React.FC<DatePickerProps> = ({ activityData }) => {
  const activityIndex = React.useMemo(
    () => buildActivityIndex(activityData),
    [activityData]
  );

  const getMonthKey = (date: Date) =>
    `${date?.getFullYear()}-${date?.getMonth()}`;

  const hasActivity = (day: number, date: Date) => {
    const key = getMonthKey(date);
    const activeDays = activityIndex.get(key) ?? [];
    return activeDays.includes(day);
  };

  const isConnected = (day: number, date: Date) => {
    const key = getMonthKey(date);
    const activeDays = activityIndex.get(key) ?? [];
    return activeDays.includes(day - 1) || activeDays.includes(day + 1);
  };

  return (
    <div className="space-y-1">
      <Calendar
        inline
        selected={null}
        onChange={() => {}}
        formatWeekDay={(day) => day.substring(0, 3).toUpperCase()}
        onMonthChange={() => {}}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          const month = date?.toLocaleString("default", { month: "long" });
          const year = date?.getFullYear();

          return (
            <div className="flex justify-between items-center px-1">
              <h3 className="text-white text-xs font-semibold font-inter">
                {month} {year}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="text-white cursor-pointer"
                  disabled={prevMonthButtonDisabled}
                  onClick={decreaseMonth}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="text-white cursor-pointer"
                  disabled={nextMonthButtonDisabled}
                  onClick={increaseMonth}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        }}
        renderDayContents={(day, date) => {
          const active = hasActivity(day, date);
          const connected = isConnected(day, date);

          const bgStyle = active
            ? connected
              ? "bg-yellow-400/90"
              : "bg-yellow-400"
            : "bg-transparent";

          return (
            <div
              className={`text-white text-[8px] size-4 flex justify-center items-center rounded-full leading-none font-inter font-normal ${bgStyle}`}
            >
              {day}
            </div>
          );
        }}
      />
    </div>
  );
};
