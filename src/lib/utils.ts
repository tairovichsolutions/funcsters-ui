import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clampToRange(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calcTotalPages(total: number, perPage: number) {
  return Math.max(1, Math.ceil(total / Math.max(1, perPage)));
}

export function buildRange(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | "...")[] {
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(2, page - siblingCount);
  const right = Math.min(totalPages - 1, page + siblingCount);

  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < totalPages - 1;

  const middle = Array.from({ length: right - left + 1 }, (_, i) => left + i);

  if (!showLeftEllipsis && showRightEllipsis) {
    const count = 3 + 2 * siblingCount;
    const range = Array.from({ length: count }, (_, i) => i + 1);
    return [...range, "...", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const count = 3 + 2 * siblingCount;
    const range = Array.from(
      { length: count },
      (_, i) => totalPages - count + 1 + i
    );
    return [1, "...", ...range];
  }

  return [1, "...", ...middle, "...", totalPages];
}
