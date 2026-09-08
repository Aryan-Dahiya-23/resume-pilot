export const MAX_JOB_DESCRIPTION_LENGTH = 12_000;

export function parseJobDescription(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new Error("Job description must be text.");
  if (value.length > MAX_JOB_DESCRIPTION_LENGTH) {
    throw new Error("Job description must be 12,000 characters or fewer.");
  }
  return value.trim() || null;
}
