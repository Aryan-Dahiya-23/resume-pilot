type ReviewResumeInput = {
  roleTarget?: string | null;
  targetLevel?: string | null;
  rawText: string;
  structuredJson: unknown;
};

type RewriteSuggestion = {
  before: string;
  after: string;
  why: string;
};

export type ResumeReviewOutput = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  rewriteSuggestions: RewriteSuggestion[];
  nextActions: string[];
  model: string;
};

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function takeStringArray(value: unknown, max = 8) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => trimString(item))
    .filter(Boolean)
    .slice(0, max);
}

function sanitizeSuggestions(value: unknown, max = 6): RewriteSuggestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const before = trimString((item as { before?: unknown }).before);
      const after = trimString((item as { after?: unknown }).after);
      const why = trimString((item as { why?: unknown }).why);
      if (!before || !after || !why) return null;
      return { before, after, why };
    })
    .filter((item): item is RewriteSuggestion => Boolean(item))
    .slice(0, max);
}

function parseModelJson(text: string) {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("DeepSeek returned non-JSON content");
  }
}

function toScore(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function buildPrompt(input: ReviewResumeInput) {
  const roleTarget = input.roleTarget?.trim() || "Software Engineer";
  const targetLevel = input.targetLevel?.trim() || "Not specified";
  const structured = JSON.stringify(input.structuredJson ?? {}, null, 2);
  // This is intentionally generated for every review instead of relying on a
  // model's training cutoff or a date hardcoded when the application shipped.
  const reviewDate = new Date().toISOString().slice(0, 10);

  return [
    "You are an expert ATS and hiring resume reviewer.",
    "Calibrate your feedback to the stated target role and level.",
    "Analyze the resume and return STRICT JSON only (no markdown, no extra text).",
    "Use concise, supportive, actionable feedback that the candidate can act on.",
    "",
    "Required JSON shape:",
    "{",
    '  "score": number (0-100),',
    '  "strengths": string[],',
    '  "weaknesses": string[],',
    '  "missingKeywords": string[],',
    '  "rewriteSuggestions": [{"before": string, "after": string, "why": string}],',
    '  "nextActions": string[]',
    "}",
    "",
    "Constraints:",
    "- Provide 3-6 strengths",
    "- Provide 3-6 weaknesses",
    "- Provide 5-12 missingKeywords",
    "- Provide exactly 3 rewriteSuggestions",
    "- Provide exactly 3 nextActions",
    "- Score must reflect ATS readability + role alignment + measurable impact",
    "- Ground every observation in the supplied resume text or parsed sections",
    "- Do not invent employers, titles, dates, achievements, skills, or metrics",
    "- If a bullet lacks a metric, recommend adding a truthful metric if available; never make one up in a rewrite",
    "- Keep rewrite suggestions faithful to the candidate's stated experience and use the original text in before",
    "- Only list missing keywords that are relevant to the target role and are not already evidenced in the resume",
    "",
    "Timeline rules:",
    `- Current review date (UTC): ${reviewDate}`,
    "- Make timeline claims only from explicit dates in the supplied resume",
    "- Do not say that a timeline, role, or date is future-dated unless an explicit date is later than the current review date",
    "- Treat a role marked Present, Current, or an equivalent term as valid and ongoing",
    "- Treat an expected graduation date after the current review date as valid; do not present it as an error",
    "- For month-only dates, the current month is not future-dated; for ambiguous dates, do not infer a timeline problem",
    "",
    `Target role: ${roleTarget}`,
    `Target level: ${targetLevel}`,
    "",
    "Parsed sections JSON:",
    structured,
    "",
    "Raw extracted resume text:",
    input.rawText,
  ].join("\n");
}

export async function reviewResumeWithDeepSeek(
  input: ReviewResumeInput,
): Promise<ResumeReviewOutput> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set");
  }

  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash";
  console.log("[resume-review] Using DeepSeek model:", model);

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: buildPrompt(input) }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek request failed: ${text || response.statusText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: { content?: string | null };
    }>;
  };

  const contentText = payload.choices?.[0]?.message?.content?.trim() || "";

  if (!contentText) {
    throw new Error("DeepSeek returned empty content");
  }

  const parsed = parseModelJson(contentText);
  const review: ResumeReviewOutput = {
    score: toScore(parsed.score),
    strengths: takeStringArray(parsed.strengths, 6),
    weaknesses: takeStringArray(parsed.weaknesses, 6),
    missingKeywords: takeStringArray(parsed.missingKeywords, 12),
    rewriteSuggestions: sanitizeSuggestions(parsed.rewriteSuggestions, 3),
    nextActions: takeStringArray(parsed.nextActions, 3),
    model,
  };

  if (!review.rewriteSuggestions.length) {
    throw new Error("DeepSeek response missing rewriteSuggestions");
  }

  if (!review.nextActions.length) {
    throw new Error("DeepSeek response missing nextActions");
  }

  return review;
}
