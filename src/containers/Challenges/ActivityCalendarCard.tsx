/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { Assets } from "@/constants/assets";
import { DayItem } from "./mockActivityCalendar";
import { Tooltip } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MatricCard } from "@/components/ui/matric-card";
import { StatsScorePoints } from "@/components/ui/stats-score-points";
import { useActivityCalendar } from "@/queries/useActivityCalendar";

type CalendarCell = {
  date: Date | null;
  item?: DayItem;
};

const formatMonthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const monthKey = (monthStr: string) => {
  const [y, m] = monthStr.split("-").map(Number);
  return y * 12 + (m - 1);
};

export const ActivityCalendarCard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = React.useState<string | undefined>(
    undefined
  );

  const { data: activityCalendarData } = useActivityCalendar(selectedMonth);
  const apiData = activityCalendarData?.data ?? activityCalendarData ?? {};

  const days: DayItem[] = apiData.days ?? [];
  const today: string | undefined = apiData.today;
  const registeredDate: string | undefined = apiData.registeredDate;

  const currentMonthStr = React.useMemo(() => {
    if (selectedMonth) return selectedMonth;
    if (apiData.month) return apiData.month;
    return formatMonthKey(new Date());
  }, [selectedMonth, apiData.month]);

  React.useEffect(() => {
    if (apiData.month && !selectedMonth) {
      setSelectedMonth(apiData.month);
    }
  }, [apiData.month, selectedMonth]);

  const currentMonthDate = React.useMemo(() => {
    const [y, m] = currentMonthStr.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [currentMonthStr]);

  const registeredMonthStr = React.useMemo(
    () => (registeredDate ? registeredDate.slice(0, 7) : undefined),
    [registeredDate]
  );
  const todayMonthStr = React.useMemo(
    () => (today ? today.slice(0, 7) : undefined),
    [today]
  );

  const canGoPrev = React.useMemo(() => {
    if (!registeredMonthStr) return true;
    return monthKey(currentMonthStr) > monthKey(registeredMonthStr);
  }, [currentMonthStr, registeredMonthStr]);

  const canGoNext = React.useMemo(() => {
    if (!todayMonthStr) return false;
    return monthKey(currentMonthStr) < monthKey(todayMonthStr);
  }, [currentMonthStr, todayMonthStr]);

  const changeMonth = (delta: number) => {
    setSelectedMonth((prev) => {
      const base = prev
        ? (() => {
            const [y, m] = prev.split("-").map(Number);
            return new Date(y, m - 1, 1);
          })()
        : currentMonthDate;

      const next = new Date(base.getFullYear(), base.getMonth() + delta, 1);
      return formatMonthKey(next);
    });
  };

  const totalActivity = React.useMemo(
    () => days.reduce((sum, d) => sum + d.count, 0),
    [days]
  );

  const year = currentMonthDate.getFullYear();
  const monthIndex = currentMonthDate.getMonth();
  const monthLabel = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const itemByDate = React.useMemo(() => {
    const map = new Map<string, DayItem>();
    days.forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  const streakMetaByDate = React.useMemo(() => {
    const activeDays = days
      .filter((d) => d.count > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    const meta: Record<string, { len: number; idx: number }> = {};
    if (activeDays.length === 0) return meta;

    const finalizeGroup = (startIndex: number, endIndex: number) => {
      const len = endIndex - startIndex + 1;
      if (len < 2) return;
      for (let i = startIndex; i <= endIndex; i++) {
        const iso = activeDays[i].date;
        meta[iso] = { len, idx: i - startIndex + 1 };
      }
    };

    let groupStart = 0;
    for (let i = 1; i < activeDays.length; i++) {
      const prev = new Date(activeDays[i - 1].date);
      const cur = new Date(activeDays[i].date);
      const diffMs = cur.getTime() - prev.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (Math.round(diffDays) !== 1) {
        finalizeGroup(groupStart, i - 1);
        groupStart = i;
      }
    }
    finalizeGroup(groupStart, activeDays.length - 1);
    return meta;
  }, [days]);

  const weeks: CalendarCell[][] = React.useMemo(() => {
    const cells: CalendarCell[] = [];

    const prevMonthDate = new Date(year, monthIndex, 0);
    const prevMonthDays = prevMonthDate.getDate();
    const prevMonthYear = prevMonthDate.getFullYear();
    const prevMonthIndex = prevMonthDate.getMonth();

    const leadingDays = firstWeekday;
    const startPrevDay = prevMonthDays - leadingDays + 1;

    for (let d = startPrevDay; d <= prevMonthDays; d++) {
      const dateObj = new Date(prevMonthYear, prevMonthIndex, d);
      const key = formatDateKey(dateObj);
      cells.push({
        date: dateObj,
        item: itemByDate.get(key),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, monthIndex, day);
      const key = formatDateKey(dateObj);
      cells.push({
        date: dateObj,
        item: itemByDate.get(key),
      });
    }

    const totalCells = 42;
    const nextMonthYear = monthIndex === 11 ? year + 1 : year;
    const nextMonthIndex = (monthIndex + 1) % 12;
    let nextDay = 1;

    while (cells.length < totalCells) {
      const dateObj = new Date(nextMonthYear, nextMonthIndex, nextDay++);
      const key = formatDateKey(dateObj);
      cells.push({
        date: dateObj,
        item: itemByDate.get(key),
      });
    }

    const result: CalendarCell[][] = [];
    for (let w = 0; w < 6; w++) {
      result.push(cells.slice(w * 7, w * 7 + 7));
    }
    return result;
  }, [firstWeekday, daysInMonth, year, monthIndex, itemByDate]);

  const visibleWeeks = weeks;

  const weekDayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <MatricCard
      imgSrc={Assets.Svgs.ActivityCalendarImage}
      className="bg-activity-calendar-card flex! gap-3 3xl:gap-10!  justify-between"
    >
      <StatsScorePoints value={totalActivity} label="Activities" />

      <div className="relative w-full flex flex-1 flex-col text-[12px] text-white z-10 max-w-[240px] bg--500">
        <div className="flex flex-col border-b pb-1 border-white/50 items-end gap-2 w-full">
          <div className="flex items-center gap-2 text-xs w-full justify-between font-medium text-white">
            <span className="ml-1.5">{monthLabel}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                disabled={!canGoPrev}
                className="flex size-5 items-center cursor-pointer justify-center rounded-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                disabled={!canGoNext}
                className="flex size-5 items-center cursor-pointer justify-center rounded-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-y-1 mt-1.5 text-center text-[9px] font-light tracking-wide text-white">
          {weekDayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-[2px]">
          {visibleWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="relative">
              <div className="grid grid-cols-7 text-center">
                {week.map((cell, cellIndex) => {
                  const dateObj = cell.date!;
                  const dayNumber = dateObj.getDate();
                  const iso = formatDateKey(dateObj);

                  const isCurrentMonth =
                    dateObj.getFullYear() === year &&
                    dateObj.getMonth() === monthIndex;

                  const item = isCurrentMonth ? cell.item : undefined;
                  const hasActivity = !!item && item.count > 0;
                  const streak = isCurrentMonth
                    ? streakMetaByDate[iso]
                    : undefined;
                  const inStreak = !!streak;
                  const isFirstInStreak = inStreak && streak!.idx === 1;
                  const isLastInStreak =
                    inStreak && streak!.idx === streak!.len;

                  const tooltipContent = (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] flex gap-3 justify-between">
                        Activity:{" "}
                        <span className="font-semibold">
                          {item?.count ?? 0}
                        </span>
                      </span>
                      {inStreak && (
                        <span className="text-[12px] flex gap-3 justify-between">
                          Consistency:{" "}
                          <span className="font-semibold">
                            day {streak!.idx} of {streak!.len}
                          </span>
                        </span>
                      )}
                    </div>
                  );

                  let containerClasses =
                    "flex h-[26px] w-full items-center justify-center text-[12px]";

                  if (inStreak) {
                    containerClasses += " bg-[#FFCE5139]";
                    if (isFirstInStreak) containerClasses += " rounded-l-full";
                    if (isLastInStreak) containerClasses += " rounded-r-full";
                  }

                  const dayTextClasses = isCurrentMonth
                    ? "text-white"
                    : "text-white/40";

                  if (hasActivity) {
                    return (
                      <Tooltip
                        className="text-start"
                        key={cellIndex}
                        content={tooltipContent}
                        place="top"
                      >
                        <div className={containerClasses}>
                          <div
                            className={[
                              "flex size-[22px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                              "bg-[#FFCE51]",
                              inStreak ? "text-[#F75900]" : "text-[#1B1B43]",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <span className="leading-none mt-0.5">{dayNumber}</span>
                          </div>
                        </div>
                      </Tooltip>
                    );
                  }

                  return (
                    <Tooltip
                      className="text-start"
                      key={cellIndex}
                      content={tooltipContent}
                      place="top"
                    >
                      <div className={containerClasses}>
                        <span className={dayTextClasses}>{dayNumber}</span>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MatricCard>
  );
};
