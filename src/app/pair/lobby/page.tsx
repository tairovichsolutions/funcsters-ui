"use client";

import { Users } from "lucide-react";
import { useState } from "react";
import { LobbyFilters, type LobbyFilterState } from "@/features/pair/components/LobbyFilters";
import { PairRequestCard } from "@/features/pair/components/PairRequestCard";
import { useLobby } from "@/features/pair/hooks/usePairQueries";
import PrimaryContainer from "@/components/shared/container/PrimaryContainer";

// TODO(FE-dev): replace with real /api/languages fetch. Kept as a stub list to
// keep the lobby filter self-contained until the languages endpoint is wired.
const LANGUAGE_STUBS = [
  { id: 1, name: "Java" },
  { id: 2, name: "Python" },
  { id: 3, name: "JavaScript" },
  { id: 4, name: "C++" },
];

export default function PairLobbyPage() {
  const [filter, setFilter] = useState<LobbyFilterState>({});
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useLobby({ ...filter, page, size: 20 });

  return (
    <section className="">
      <PrimaryContainer as="div">
        <div className="  w-full  space-y-6  py-6">
          <header>
            <h1 className="flex items-center gap-2 text-2xl md:text-[1.8rem] text-neutral-01 dark:text-white font-bold">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              Pair Programming Lobby
            </h1>
            <p className="mt-1 text-sm  text-muted-foreground ">
              Connect with other developers, share knowledge, and solve challenges together in real-time.
            </p>
          </header>

          <LobbyFilters value={filter} onChange={(next) => { setFilter(next); setPage(0); }} languageOptions={LANGUAGE_STUBS} />

          {isLoading && <LobbyGridSkeleton />}
          {isError && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Failed to load pair requests. Try again in a moment.
            </div>
          )}
          {data && data.content.length === 0 && !isLoading && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No active pair requests match these filters. Try widening them, or create your own request from any challenge page.
            </div>
          )}
          {data && data.content.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.content.map((card) => (
                  <PairRequestCard key={card.id} card={card} />
                ))}
              </div>
              {data.totalPages > 1 && (
                <Pagination page={page} totalPages={data.totalPages} onPage={setPage} />
              )}
            </>
          )}
        </div>
      </PrimaryContainer>
    </section>

  );
}

function LobbyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-xl border border-border bg-muted/30" />
      ))}
    </div>
  );
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
        disabled={page === 0}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-muted-foreground">
        Page {page + 1} of {totalPages}
      </span>
      <button
        className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
        disabled={page + 1 >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
