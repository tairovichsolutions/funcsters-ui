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

export const ActivityCalendarCardV2: React.FC = () => {
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
        while (arr.length < 35) {
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
console.log({cells});
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

    const CELL_SIZE = "size-[28px]";
    const CELL_BOX = "h-[28px]";
    const GRID_GAP_X = "gap-x-[10px]";
    const GRID_GAP_Y = "gap-y-[6px]";

    return (
     <div className="flex flex-col border bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl 2xl:p-3.5 p-1 w-full mx-auto">


    <div className="relative w-full flex flex-1  flex-col z-10 mt-3">
        {/* Header - Month Title & Swipe Controls */}
        <div className="flex flex-row items-center justify-between w-full  pb-3">

            <div className={` flex text-sm font-semibold  items-center justify-center gap-1 `}>
                <p className="text-black dark:text-white font-inter ">Activities</p>
                <h2 className="text-black dark:text-white font-inter ">{totalActivity}</h2>
            </div>
            <div className="flex items-center ">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    disabled={!canGoPrev}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="size-[18px]" strokeWidth={2.5} />
                </button>
                <span className="font-bold text-xs text-[#878A8C] dark:text-slate-400 tracking-tight">
                    {monthLabel}
                </span>
                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    disabled={!canGoNext}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="size-[18px]" strokeWidth={2.5} />
                </button>
            </div>
        </div>

        <div className="bg-[#F0F1F6] dark:bg-slate-800/50 rounded-sm border dark:border-slate-800 px-2">
            {/* Week days */}
            <div className="mb-4 mt-3 grid grid-cols-7  justify-items-center text-center text-xs  font-bold tracking-wider text-[#0D1A26] dark:text-slate-300 uppercase">
                {weekDayLabels.map((label) => (
                    <span key={label}>
                        {label === "SAT" 
                            ? label.slice(0, 2).toUpperCase()
                            : label.charAt(0).toUpperCase() }
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div className={cn("grid grid-cols-7 justify-items-center bg-[#F0F1F6] dark:bg-transparent ", GRID_GAP_X, GRID_GAP_Y)}>
                {loading
                    ? Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className={cn(CELL_SIZE, "rounded-full bg-slate-200 dark:bg-slate-700")}
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
                            <div className="flex flex-col gap-0.5 text-white">
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
                                                "relative z-1 flex shrink-0 items-center justify-center rounded-full text-[14px] font-semibold",
                                                CELL_SIZE,
                                                "bg-blue-base text-white cursor-pointer",
                                                inGroup ? "text-[#F75900]" : "text-white",
                                            )}
                                        >
                                            <span className="leading-none">{dayNumber}</span>
                                        </div>
                                    ) : (
                                        <span
                                            className={cn(
                                                "relative z-1 text-[14px] font-semibold",
                                                isCur ? "text-slate-900 dark:text-slate-200" : "text-slate-300 dark:text-slate-600",
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
    </div>
</div>
    );
};