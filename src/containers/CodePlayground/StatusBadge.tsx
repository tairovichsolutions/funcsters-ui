import { cn } from "@/lib";

interface StatusBadgeType {
  pass?: number;
  fail?: number;
}

export const StatusBadge = ({ pass = 0, fail = 0 }: StatusBadgeType) => {
  const isAllPassed = fail === 0;

  return (
    <div
      className={cn(
        "text-xs px-2.5 py-1 font-medium border rounded-full",
        isAllPassed
          ? "bg-success/[0.102] text-success border-success"
          : "bg-danger/[0.102] text-danger border-danger"
      )}
    >
      {isAllPassed
        ? `${pass}/${pass + fail} tests passed`
        : `${fail} of ${pass + fail} tests failed`}
    </div>
  );
};
