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
    throw new Error("Gemini returned non-JSON content");
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

  return [
    "You are an expert ATS and hiring resume reviewer for software roles.",
    "Analyze the resume and return STRICT JSON only (no markdown, no extra text).",
    "Use concise, actionable feedback.",
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

export async function reviewResumeWithGemini(input: ReviewResumeInput): Promise<ResumeReviewOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed: ${text || response.statusText}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const contentText =
    payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";

  if (!contentText) {
    throw new Error("Gemini returned empty content");
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
    throw new Error("Gemini response missing rewriteSuggestions");
  }

  if (!review.nextActions.length) {
    throw new Error("Gemini response missing nextActions");
  }

  return review;
}
