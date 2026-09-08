"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_JOB_DESCRIPTION_LENGTH } from "@/lib/job-description";

export function JobDescriptionField({ value, onChange, disabled }: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <Label htmlFor={id} className="field-label">Job description <span className="font-normal text-zinc-400">(optional)</span></Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        maxLength={MAX_JOB_DESCRIPTION_LENGTH}
        rows={5}
        className="field-input !min-h-32 !max-h-64 !resize-y ![field-sizing:fixed]"
        placeholder="Paste the responsibilities and requirements from the job posting…"
        aria-describedby={`${id}-help ${id}-count`}
      />
      <p id={`${id}-help`} className="field-help">Compare the role’s requirements with your resume and get tailored suggestions.</p>
      <p id={`${id}-count`} className="mt-1 text-right text-xs text-zinc-400">{value.length.toLocaleString()} / {MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()}</p>
    </div>
  );
}
