/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLobbyCount } from "../hooks/usePairQueries";
import { resolveAvatarUrl } from "../utils/resolveAvatarUrl";

interface LobbyUser {
  hostId: string;
  hostAvatarUrl: string | null;
  hostUsername: string;
}

interface LobbyData {
  users?: LobbyUser[];
  count?: number;
}

export function LobbyNavLink({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { data } = useLobbyCount() as { data: LobbyData | undefined };
  const active = pathname?.startsWith("/pair/lobby") ?? false;

  const users = data?.users ?? [];
  const count = data?.count ?? 0;

  return (
    <Link
      href="/pair/lobby"
      className={`relative flex my-auto items-center gap-1 px-1 text-sm font-medium transition-colors ${
        active ? "text-blue-600 dark:text-blue-400" : "text-medium-gray hover:text-foreground"
      } ${className}`}
    >
      <span className="dark:text-white"> Lobby</span>

      <div className="flex -space-x-4 items-center">
        {users.slice(0, 3).map((user, index) => (
          <img
            key={user.hostId}
            src={resolveAvatarUrl(user.hostAvatarUrl, user.hostUsername)}
            alt={user.hostUsername}
            style={{ zIndex: (index + 1) * 10 }}
            className="relative h-8 w-8 rounded-full border-2 border-white object-cover dark:border-gray-900"
          />
        ))}

        {count > 0 && (
          <div
            style={{ zIndex: 40 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-sm font-bold text-white dark:border-gray-900"
          >
            {count > 99 ? "99+" : count}
          </div>
        )}
      </div>

      {active && <span className={`absolute inset-x-0 ${users.length > 0 ? "-bottom-[15px]" :"-bottom-[21px]"}   h-[2.5px] bg-primary  `} ></span>}
    </Link>
  );
}