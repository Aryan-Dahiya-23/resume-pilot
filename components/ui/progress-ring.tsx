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
          className="fill-none stroke-zinc-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none stroke-zinc-900"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold text-zinc-900">{pct}</div>
        <div className="text-xs text-zinc-500">ATS</div>
      </div>
    </div>
  );
}
