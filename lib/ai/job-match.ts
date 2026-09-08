import { hasResumeEvidence } from "./review-evidence";

export type JobRequirementMatch = {
  requirement: string;
  status: "supported" | "partial" | "not_evidenced";
  jobEvidence: string;
  resumeEvidence: string;
  explanation: string;
  action: string;
};

export type JobMatch = {
  jobDescription: string;
  requirements: JobRequirementMatch[];
};

export function readJobMatch(value: unknown): JobMatch | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (typeof source.jobDescription !== "string" || !Array.isArray(source.requirements)) return null;
  const requirements = source.requirements.flatMap((item): JobRequirementMatch[] => {
    if (!item || typeof item !== "object") return [];
    const { requirement, status, jobEvidence, resumeEvidence, explanation, action } = item;
    if (!["supported", "partial", "not_evidenced"].includes(status)) return [];
    if (![requirement, jobEvidence, explanation, action].every((text) => typeof text === "string" && text.trim())) return [];
    if (typeof resumeEvidence !== "string") return [];
    return [{ requirement, status, jobEvidence, resumeEvidence, explanation, action }];
  }).slice(0, 12);
  return requirements.length ? { jobDescription: source.jobDescription, requirements } : null;
}

export function verifyJobMatch(value: unknown, jobDescription: string, rawText: string): JobMatch | null {
  const parsed = readJobMatch({ jobDescription, requirements: value });
  if (!parsed) return null;
  const requirements = parsed.requirements.filter((item) =>
    hasResumeEvidence(jobDescription, item.jobEvidence) &&
    (item.status === "not_evidenced"
      ? item.resumeEvidence.trim() === ""
      : hasResumeEvidence(rawText, item.resumeEvidence)),
  );
  return requirements.length ? { jobDescription, requirements } : null;
}
