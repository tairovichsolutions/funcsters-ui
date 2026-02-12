/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Assets } from "@/constants/assets";
import { Tooltip } from "@/components/ui/tooltip";
import { MatricCard } from "@/components/ui/matric-card";
import { StatsScorePoints } from "@/components/ui/stats-score-points";
import { useActivityCalendar } from "@/queries/useActivityCalendar";
import { DayItem } from "./mockActivityCalendar";
import { cn } from "@/lib";
import { Skeleton } from "@/components/ui/skeleton";

type CalendarCell = {
  date: Date;
  item?: DayItem;
};

const weekDayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatMonthKey = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const monthKeyNum = (monthStr: string) => {
  const [y, m] = monthStr.split("-").map(Number);
  return y * 12 + (m - 1);
};

export const ActivityCalendarCard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = React.useState<string | undefined>(
    undefined,
  );

  const { data: activityCalendarData, isLoading } =
    useActivityCalendar(selectedMonth);

  const loading = isLoading;

  const apiData = activityCalendarData?.data ?? activityCalendarData ?? {};

  const days: DayItem[] = apiData.days ?? [];
  const todayISO: string | undefined = apiData.today;
  const registeredISO: string | undefined = apiData.registeredDate;

  const currentMonthStr = React.useMemo(() => {
    if (selectedMonth) return selectedMonth;
    if (apiData.month) return apiData.month;
    return formatMonthKey(new Date());
  }, [selectedMonth, apiData.month]);

  React.useEffect(() => {
    if (apiData.month && !selectedMonth) setSelectedMonth(apiData.month);
  }, [apiData.month, selectedMonth]);

  const currentMonthDate = React.useMemo(() => {
    const [y, m] = currentMonthStr.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [currentMonthStr]);

  const year = currentMonthDate.getFullYear();
  const monthIndex = currentMonthDate.getMonth();

  const monthLabel = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const registeredMonthStr = registeredISO
    ? registeredISO.slice(0, 7)
    : undefined;
  const todayMonthStr = todayISO ? todayISO.slice(0, 7) : undefined;

  const canGoPrev = React.useMemo(() => {
    if (loading) return false;
    if (!registeredMonthStr) return true;
    return monthKeyNum(currentMonthStr) > monthKeyNum(registeredMonthStr);
  }, [currentMonthStr, registeredMonthStr, loading]);

  const canGoNext = React.useMemo(() => {
    if (loading) return false;
    if (!todayMonthStr) return false;
    return monthKeyNum(currentMonthStr) < monthKeyNum(todayMonthStr);
  }, [currentMonthStr, todayMonthStr, loading]);

  const changeMonth = (delta: number) => {
    if (loading) return;
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
    () => days.reduce((sum, d) => sum + (d.count ?? 0), 0),
    [days],
  );

  const itemByDate = React.useMemo(() => {
    const map = new Map<string, DayItem>();
    days.forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  const cells: CalendarCell[] = React.useMemo(() => {
    const arr: CalendarCell[] = [];

    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const prevMonthLast = new Date(year, monthIndex, 0);
    const prevDaysInMonth = prevMonthLast.getDate();
    const leadingDays = firstWeekday;
    const startPrevDay = prevDaysInMonth - leadingDays + 1;

    for (let d = startPrevDay; d <= prevDaysInMonth; d++) {
      const dateObj = new Date(
        prevMonthLast.getFullYear(),
        prevMonthLast.getMonth(),
        d,
      );
      arr.push({ date: dateObj, item: itemByDate.get(formatDateKey(dateObj)) });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, monthIndex, d);
      arr.push({ date: dateObj, item: itemByDate.get(formatDateKey(dateObj)) });
    }

    const nextMonthFirst = new Date(year, monthIndex + 1, 1);
    let nd = 1;
    while (arr.length < 42) {
      const dateObj = new Date(
        nextMonthFirst.getFullYear(),
        nextMonthFirst.getMonth(),
        nd++,
      );
      arr.push({ date: dateObj, item: itemByDate.get(formatDateKey(dateObj)) });
    }

    return arr;
  }, [year, monthIndex, itemByDate]);

  const isCurrentMonthCell = React.useCallback(
    (d: Date) => d.getFullYear() === year && d.getMonth() === monthIndex,
    [year, monthIndex],
  );

  const streakMetaByDate = React.useMemo(() => {
    const currentMonthDays = days
      .filter((d) => d.date.slice(0, 7) === currentMonthStr)
      .filter((d) => (d.count ?? 0) > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    const meta: Record<string, { len: number; idx: number }> = {};
    if (currentMonthDays.length === 0) return meta;

    const finalize = (s: number, e: number) => {
      const len = e - s + 1;
      if (len < 2) return;
      for (let i = s; i <= e; i++) {
        meta[currentMonthDays[i].date] = { len, idx: i - s + 1 };
      }
    };

    let start = 0;
    for (let i = 1; i < currentMonthDays.length; i++) {
      const prev = new Date(currentMonthDays[i - 1].date);
      const cur = new Date(currentMonthDays[i].date);
      const diffDays = Math.round(
        (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays !== 1) {
        finalize(start, i - 1);
        start = i;
      }
    }
    finalize(start, currentMonthDays.length - 1);
    return meta;
  }, [days, currentMonthStr]);

  const isActiveAt = React.useCallback(
    (idx: number) => {
      const cell = cells[idx];
      if (!cell) return false;
      if (!isCurrentMonthCell(cell.date)) return false;
      return (cell.item?.count ?? 0) > 0;
    },
    [cells, isCurrentMonthCell],
  );

  const GRID_GAP_X_PX = 10;
  const HALF_GAP_X_PX = GRID_GAP_X_PX / 2;

  const getConnectorProps = React.useCallback(
    (idx: number) => {
      if (!isActiveAt(idx)) return null;

      const col = idx % 7;
      const leftActive = col !== 0 && isActiveAt(idx - 1);
      const rightActive = col !== 6 && isActiveAt(idx + 1);

      return {
        className: cn(
          "absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none",
          "h-full bg-[#FFCE5139]",
        ),
        style: {
          left: leftActive ? `${-HALF_GAP_X_PX}px` : "50%",
          right: rightActive ? `${-HALF_GAP_X_PX}px` : "50%",
        } as React.CSSProperties,
      };
    },
    [isActiveAt, HALF_GAP_X_PX],
  );

  const CELL_SIZE = "size-[25px]";
  const CELL_BOX = "h-[25px]";
  const GRID_GAP_X = "gap-x-[10px]";
  const GRID_GAP_Y = "gap-y-[6px]";

  return (
    <MatricCard
      imgSrc={Assets.Svgs.ActivityCalendarImage}
      className="bg-activity-calendar-card flex! gap-3 3xl:gap-10! justify-between"
    >
      <StatsScorePoints value={totalActivity} label="Activities" />

      <div className="relative w-full flex flex-1 flex-col text-[12px] text-white z-10 max-w-[220px]">
        {/* Header */}
        <div className="flex flex-col border-b pb-1 border-white/50 items-end gap-2 w-full">
          <div className="flex items-center gap-2 text-xs w-full justify-between font-medium text-white">
            <span className="ml-1.5">{monthLabel}</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                disabled={!canGoPrev}
                className="flex size-5 cursor-pointer items-center justify-center rounded-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                disabled={!canGoNext}
                className="flex size-5 cursor-pointer items-center justify-center rounded-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Week days */}
        <div className="mb-1 grid grid-cols-7 gap-1.5 justify-center items-center mt-1.5 text-center text-[9px] font-light tracking-wide text-white">
          {weekDayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Grid */}
        <div className={cn("grid grid-cols-7", GRID_GAP_X, GRID_GAP_Y)}>
          {loading
            ? Array.from({ length: 42 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={cn(CELL_SIZE, "rounded-full bg-white/20")}
                />
              ))
            : cells.map((cell, idx) => {
                const d = cell.date;
                const iso = formatDateKey(d);
                const dayNumber = d.getDate();

                const isCur = isCurrentMonthCell(d);
                const activity = isCur ? (cell.item?.count ?? 0) : 0;
                const hasActivity = activity > 0;

                const streak = isCur ? streakMetaByDate[iso] : undefined;
                const inGroup = !!streak;

                const tooltipContent = (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] flex gap-3 justify-between">
                      Activity:{" "}
                      <span className="font-semibold">{activity}</span>
                    </span>

                    {inGroup && (
                      <span className="text-[12px] flex gap-3 justify-between">
                        Consistency:{" "}
                        <span className="font-semibold">
                          day {streak!.idx} of {streak!.len}
                        </span>
                      </span>
                    )}
                  </div>
                );

                const connector = getConnectorProps(idx);

                return (
                  <Tooltip
                    key={iso}
                    className="text-start"
                    content={tooltipContent}
                    place="top"
                  >
                    <div
                      className={cn(
                        "relative w-full flex items-center justify-center",
                        CELL_BOX,
                      )}
                    >
                      {connector && (
                        <div
                          className={connector.className}
                          style={connector.style}
                        />
                      )}

                      {hasActivity ? (
                        <div
                          className={cn(
                            "relative z-1 flex shrink-0 items-center justify-center rounded-full text-[14.5px] font-semibold",
                            CELL_SIZE,
                            "bg-[#FFCE51] cursor-pointer",
                            inGroup ? "text-[#F75900]" : "text-[#1B1B43]",
                          )}
                        >
                          <span className="leading-none">{dayNumber}</span>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "relative z-1 text-[13.5px]",
                            isCur ? "text-white" : "text-white/40",
                          )}
                        >
                          {dayNumber}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                );
              })}
        </div>
      </div>
    </MatricCard>
  );
};
