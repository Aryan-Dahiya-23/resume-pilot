export function ProgressRing({
  value,
  size = 112,
}: {
  value: number;
  size?: number;
}) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="relative grid shrink-0 place-items-center"
      role="img"
      aria-label={`Resume score: ${pct} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-zinc-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none transition-[stroke-dashoffset] duration-700"
          stroke={pct >= 75 ? "#37765a" : pct >= 50 ? "#b58634" : "#b95645"}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold tracking-tight text-zinc-900">
          {pct}
        </div>
        <div className="mt-0.5 text-xs text-zinc-500">out of 100</div>
      </div>
    </div>
  );
}
