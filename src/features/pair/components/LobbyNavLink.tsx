"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLobbyCount } from "../hooks/usePairQueries";

/**
 * Top-nav "Lobby(X)" link. X is the live count of currently-broadcasting
 * pair requests (spec v2 global rule 2).
 *
 * Rendered as: the word "Lobby" + a pill badge with the number (> 99 shows "99+").
 * In the Figma the count is shown with a tiny stack of user avatars; we skip
 * that ornament for the functional version — the FE dev can re-skin.
 */
export function LobbyNavLink({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { data: count = 0 } = useLobbyCount();
  const active = pathname?.startsWith("/pair/lobby") ?? false;

  return (
    <Link
      href="/pair/lobby"
      className={`relative inline-flex items-center gap-2 px-1 pb-2 text-sm font-medium transition-colors ${
        active ? "text-blue-600 dark:text-blue-400" : "text-foreground/70 hover:text-foreground"
      } ${className}`}
    >
      Lobby
      {count > 0 && (
        <span
          aria-label={`${count} active pair requests`}
          className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />}
    </Link>
  );
}
