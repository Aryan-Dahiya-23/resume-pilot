export type Resume = {
  id: string;
  version: string;
  uploadedAt: string;
  score: number;
  roleTarget?: string;
  targetLevel?: string;
  fileName: string;
};

export type JobStatus = "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";

export type Job = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  when: string;
  link?: string;
  location?: string;
};

export type ResumeFeedback = {
  score: number;
  summary: {
    strengths: string[];
    weaknesses: string[];
  };
  missingKeywords: string[];
  rewriteSuggestions: Array<{
    before: string;
    after: string;
    why: string;
  }>;
  atsChecks: Array<{
    label: string;
    ok: boolean;
  }>;
  nextActions: string[];
};

export type JobDetail = {
  notes: string;
  contact: {
    name: string;
    email: string;
  };
  rounds: Array<{
    name: string;
    status: "Done" | "Upcoming" | "Pending";
  }>;
  followUp: string;
};

export function statusVariant(status: string): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "Offer") return "success";
  if (status === "Interview") return "info";
  if (status === "Applied") return "neutral";
  if (status === "Saved") return "warning";
  if (status === "Rejected") return "danger";
  return "neutral";
}
