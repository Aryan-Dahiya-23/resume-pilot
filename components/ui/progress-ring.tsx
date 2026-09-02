import * as React from "react";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const boundedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedValue / 100) * circumference;

  const scoreColor =
    boundedValue >= 80
      ? "text-emerald-500 stroke-emerald-500"
      : boundedValue >= 60
        ? "text-teal-500 stroke-teal-500"
        : boundedValue >= 40
          ? "text-amber-500 stroke-amber-500"
          : "text-rose-500 stroke-rose-500";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-100 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("fill-none transition-all duration-700 ease-out", scoreColor)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
          {boundedValue}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
          ATS Score
        </span>
      </div>
    </div>
  );
}
