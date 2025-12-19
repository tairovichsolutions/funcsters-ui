"use client";

import {
  useRouter,
  usePathname,
  useSearchParams,
  ReadonlyURLSearchParams,
} from "next/navigation";
import * as React from "react";
import type { ChallengesTypes } from "@/types";
import { Pagination } from "@/components/Pagination";
import { ChallengeCardView } from "@/containers/Challenges";
import { ChallengeCardSkeleton } from "@/skeletons/ChallengeCardSkeleton";
import { ChallengeTableView } from "@/containers/Challenges/ChallengeTableView";
import { DataNotAvailable } from "@/components/ui/data-not-available";

type ViewMode = "card" | "list";

type ChallengesListSectionProps = {
  isLoading: boolean;
  currentView: ViewMode;
  allChallenges: ChallengesTypes[];
};

const DEFAULT_PAGE_SIZE = 12;

function usePageFromSearchParams(sp: ReadonlyURLSearchParams): number {
  const raw = sp.get("page");
  const parsed = raw ? Number(raw) : 1;
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

function usePageSizeFromSearchParams(sp: ReadonlyURLSearchParams): number {
  const raw = sp.get("pageSize");
  const parsed = raw ? Number(raw) : DEFAULT_PAGE_SIZE;
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PAGE_SIZE;
  return parsed;
}

export const ChallengesListSection = React.memo(
  ({ isLoading, currentView, allChallenges }: ChallengesListSectionProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const BASE_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

    const pageFromUrl = usePageFromSearchParams(searchParams);
    const pageSizeFromUrl = usePageSizeFromSearchParams(searchParams);

    const totalItems = allChallenges.length;

    const { currentPage, pageSize, paginatedItems } = React.useMemo(() => {
      const pageSizeSafe = pageSizeFromUrl || DEFAULT_PAGE_SIZE;
      const totalPages =
        pageSizeSafe > 0
          ? Math.max(1, Math.ceil(totalItems / pageSizeSafe))
          : 1;
      const safePage =
        pageFromUrl > totalPages ? totalPages : Math.max(1, pageFromUrl);
      const startIndex = (safePage - 1) * pageSizeSafe;
      const endIndex = startIndex + pageSizeSafe;

      return {
        currentPage: safePage,
        pageSize: pageSizeSafe,
        paginatedItems: allChallenges.slice(startIndex, endIndex),
      };
    }, [allChallenges, totalItems, pageFromUrl, pageSizeFromUrl]);

    const pageSizeOptions = React.useMemo<number[]>(() => {
      if (totalItems <= 0) return [...BASE_PAGE_SIZE_OPTIONS];
      const opts = BASE_PAGE_SIZE_OPTIONS.filter((opt) => opt <= totalItems);
      if (opts.length === 0) {
        return [totalItems];
      }
      return opts;
    }, [totalItems]);

    const handlePageSizeChange = React.useCallback(
      (nextSize: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("pageSize", String(nextSize));
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: true });
      },
      [pathname, router, searchParams]
    );

    const handlePageChange = React.useCallback(
      (nextPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextPage));
        router.replace(`${pathname}?${params.toString()}`, { scroll: true });
      },
      [pathname, router, searchParams]
    );

    return (
      <div className="lg:p-4 p-3 flex flex-col gap-4">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <ChallengeCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && totalItems > 0 && (
          <>
            {currentView === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
                {paginatedItems.map((item) => (
                  <ChallengeCardView {...item} key={item.id} />
                ))}
              </div>
            ) : (
              <ChallengeTableView items={paginatedItems} />
            )}

            <Pagination
              totalItems={totalItems}
              page={currentPage}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              disabled={isLoading}
            />
          </>
        )}

        {!isLoading && totalItems === 0 && <DataNotAvailable />}
      </div>
    );
  }
);
