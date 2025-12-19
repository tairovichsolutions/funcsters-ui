interface StatsScorePointsProps {
  label: string;
  className?: string;
  value?: number | string;
}

export const StatsScorePoints = ({
  label,
  value = 0,
  className,
}: StatsScorePointsProps) => {
  return (
    <div className={`space-y-1 ${className || ""}`}>
      <h2 className="text-white font-extrabold font-inter text-5xl">{value}</h2>
      <p className="text-white font-medium font-inter text-[13px]">{label}</p>
    </div>
  );
};
