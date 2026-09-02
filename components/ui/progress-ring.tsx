export function ProgressRing({ value }: { value: number }) {
  const size = 92;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative grid place-items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none stroke-brand transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold tracking-[-0.03em] text-foreground">
          {pct}
        </div>
        <div className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          ATS
        </div>
      </div>
    </div>
  );
}
