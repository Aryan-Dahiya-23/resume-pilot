"use client";

import { useId } from "react";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";

const levels = ["Internship", "0-1 years", "1-3 years", "3-5 years", "5+ years"];

export function ExperienceLevelSelector({ value, onChange, disabled = false }: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const selectedIndex = levels.indexOf(value);

  return (
    <fieldset disabled={disabled} aria-describedby={`${id}-help`} className="min-w-0">
      <legend className="field-label">
        Target experience level <span className="font-normal text-zinc-400">(optional)</span>
      </legend>
      <p id={`${id}-help`} className="mb-3 text-xs leading-5 text-zinc-500">
        Choose the level you’re applying for.
      </p>
      <div className="sm:hidden">
        <FormSelect
          aria-label="Target experience level"
          value={value || "unspecified"}
          onValueChange={(next) => onChange(next === "unspecified" ? "" : next)}
          disabled={disabled}
          className="field-input w-full"
        >
          <SelectItem value="unspecified">Not specified</SelectItem>
          {levels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}
        </FormSelect>
      </div>
      <div className="hidden sm:block">
        <div className="relative grid grid-cols-5 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-lg bg-[#e5eed8] shadow-sm transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: "calc((100% - 8px) / 5)", transform: `translateX(${Math.max(0, selectedIndex) * 100}%)`, opacity: selectedIndex < 0 ? 0 : 1 }}
          />
          {levels.map((level) => (
            <label key={level} className="relative min-w-0 cursor-pointer">
              <input
                type="radio"
                name={id}
                value={level}
                checked={value === level}
                onChange={() => onChange(level)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center justify-center rounded-lg px-1 text-center text-xs text-zinc-600 peer-checked:font-medium peer-checked:text-[#38502a] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#6b9150] peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                {level}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex min-h-6 items-center justify-between gap-2 text-xs text-zinc-500">
          <span>{value || "No level selected"}</span>
          {value && <button type="button" onClick={() => onChange("")} className="rounded px-2 py-1 underline underline-offset-4 disabled:opacity-50">Clear selection</button>}
        </div>
      </div>
    </fieldset>
  );
}
