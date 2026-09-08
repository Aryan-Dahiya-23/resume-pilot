export type ReviewFinding = {
  kind: "strength" | "improvement";
  observation: string;
  evidence: string;
  action: string;
};

function normalize(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

// Permit extraction whitespace differences, but never fuzzy-match invented text.
export function hasResumeEvidence(rawText: string, quote: string) {
  const evidence = normalize(quote);
  return evidence.length >= 12 && normalize(rawText).includes(evidence);
}

export function readFindings(value: unknown): ReviewFinding[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): ReviewFinding[] => {
    if (!item || typeof item !== "object") return [];
    const { kind, observation, evidence, action } = item;
    if (kind !== "strength" && kind !== "improvement") return [];
    if (![observation, evidence, action].every((text) => typeof text === "string" && text.trim())) return [];
    return [{ kind, observation: observation.trim(), evidence: evidence.trim(), action: action.trim() }];
  }).slice(0, 12);
}

export function verifyFindings(value: unknown, rawText: string) {
  return readFindings(value).filter((finding) => hasResumeEvidence(rawText, finding.evidence));
}
