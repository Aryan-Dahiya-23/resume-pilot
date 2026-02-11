export type Resume = {
  id: string;
  version: string;
  uploadedAt: string;
  score: number;
  roleTarget?: string;
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

export const mockData = {
  user: { name: "Aryan" },
  resumes: [
    {
      id: "r3",
      version: "v3",
      uploadedAt: "2 days ago",
      score: 78,
      roleTarget: "SWE (General)",
      fileName: "Aryan_Resume_v3.pdf",
    },
    {
      id: "r2",
      version: "v2",
      uploadedAt: "1 week ago",
      score: 71,
      roleTarget: "Frontend Engineer",
      fileName: "Aryan_Resume_v2.pdf",
    },
    {
      id: "r1",
      version: "v1",
      uploadedAt: "3 weeks ago",
      score: 62,
      roleTarget: "Fullstack Engineer",
      fileName: "Aryan_Resume_v1.pdf",
    },
  ] as Resume[],
  resumeFeedback: {
    r3: {
      score: 78,
      summary: {
        strengths: [
          "Projects are relevant (payments, dashboards, realtime)",
          "Clear tech stack alignment for modern product teams",
          "Good use of action verbs and ownership language",
        ],
        weaknesses: [
          "Experience bullets need measurable outcomes",
          "Skills section is long and not prioritized",
          "Summary is generic — should be role-specific",
        ],
      },
      missingKeywords: ["Webhooks", "Caching", "Observability", "CI/CD", "Rate limiting", "RBAC"],
      rewriteSuggestions: [
        {
          before: "Built seller dashboard from scratch using Next.js and integrated multiple APIs.",
          after:
            "Built a seller dashboard (Next.js) used by 120+ sellers, reducing support tickets by 22% through improved order + payout visibility.",
          why: "Adds scale + impact + what improved.",
        },
        {
          before: "Worked on payments and subscriptions systems.",
          after:
            "Implemented payments + subscription flows (Stripe) including webhooks, retries, and proration handling, improving payment success rate by 9%.",
          why: "Adds specifics and real-world details recruiters look for.",
        },
      ],
      atsChecks: [
        { label: "One-column layout", ok: true },
        { label: "No images/icons", ok: true },
        { label: "Dates consistent", ok: true },
        { label: "Contact info present", ok: true },
        { label: "Too many skill keywords", ok: false },
        { label: "Impact metrics present", ok: false },
      ],
      nextActions: [
        "Rewrite 3 experience bullets with measurable impact",
        "Move top skills to the first 2 lines (React, Next.js, Go, Postgres)",
        "Tailor summary for your target role (Frontend / Fullstack)",
      ],
    },
  } as Record<string, ResumeFeedback>,
  jobs: [
    {
      id: "j1",
      company: "Stripe",
      role: "Frontend Engineer",
      status: "Applied",
      when: "Today",
      link: "https://example.com",
      location: "Remote",
    },
    {
      id: "j2",
      company: "Atlassian",
      role: "Software Engineer",
      status: "Saved",
      when: "Yesterday",
      link: "https://example.com",
      location: "Remote",
    },
    {
      id: "j3",
      company: "Remote Startup",
      role: "Fullstack (Next.js + Go)",
      status: "Interview",
      when: "3 days ago",
      link: "https://example.com",
      location: "Dubai / Remote",
    },
    {
      id: "j4",
      company: "Coinbase",
      role: "Backend Engineer",
      status: "Rejected",
      when: "5 days ago",
      link: "https://example.com",
      location: "Remote",
    },
    {
      id: "j5",
      company: "Shopify",
      role: "Frontend Engineer",
      status: "Applied",
      when: "1 week ago",
      link: "https://example.com",
      location: "Remote",
    },
  ] as Job[],
  jobDetails: {
    j3: {
      notes:
        "Recruiter call scheduled. Focus on React performance, Next.js SSR, and Go services. Prepare stories about payments + dashboard.",
      contact: {
        name: "Recruiter",
        email: "recruiter@startup.com",
      },
      rounds: [
        { name: "Recruiter Screen", status: "Done" },
        { name: "Technical Round", status: "Upcoming" },
        { name: "HM Round", status: "Pending" },
      ],
      followUp: "In 2 days",
    },
  } as Record<string, JobDetail>,
};

export function statusVariant(status: string): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "Offer") return "success";
  if (status === "Interview") return "info";
  if (status === "Applied") return "neutral";
  if (status === "Saved") return "warning";
  if (status === "Rejected") return "danger";
  return "neutral";
}
