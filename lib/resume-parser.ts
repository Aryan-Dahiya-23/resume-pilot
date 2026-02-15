export type ParsedResume = {
  rawText: string;
  structured: {
    summary: string;
    experience: string[];
    projects: string[];
    skills: string[];
    education: string[];
    misc: string[];
  };
  parserVersion: string;
};

async function loadModule(moduleName: string) {
  return (new Function(`return import("${moduleName}")`)() as Promise<Record<string, unknown>>);
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\u0000/g, "").replace(/\t/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function splitLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

type SectionKey = keyof Omit<ParsedResume["structured"], "summary"> | "summary";

const SECTION_ALIASES: Record<SectionKey, string[]> = {
  summary: ["summary", "profile", "about", "professional summary"],
  experience: ["experience", "work experience", "professional experience"],
  projects: ["projects", "project"],
  skills: ["skills", "technical skills", "technologies", "tech stack"],
  education: ["education", "academic", "academics"],
  misc: [],
};

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function injectSectionBreaks(text: string) {
  let output = text;

  const allAliases = Object.values(SECTION_ALIASES).flat();
  for (const alias of allAliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const re = new RegExp(`\\b(${escaped})\\b:?`, "gi");
    output = output.replace(re, "\n$1\n");
  }

  return output;
}

function detectSectionHeader(line: string): SectionKey | null {
  const normalized = normalizeForMatch(line);
  for (const [section, aliases] of Object.entries(SECTION_ALIASES) as Array<[SectionKey, string[]]>) {
    if (aliases.some((alias) => normalizeForMatch(alias) === normalized)) {
      return section;
    }
  }
  return null;
}

function looksLikeProjectLine(line: string) {
  const lower = line.toLowerCase();
  return (
    (line.includes("|") &&
      /(react|next|node|mongo|postgres|mysql|typescript|javascript|stripe|clerk|socket|cloudinary|prisma|docker|aws)/i.test(
        line,
      )) ||
    /\(live\)|\(code\)|\bapplication\b/.test(lower)
  );
}

function looksLikeSkillLabel(line: string) {
  return /^(languages|frameworks|developer tools|databases|platforms)\s*:/i.test(line);
}

function looksLikeSkillList(line: string) {
  const lower = line.toLowerCase();
  const hits = [
    "react",
    "next",
    "node",
    "express",
    "typescript",
    "javascript",
    "postgres",
    "mongodb",
    "mysql",
    "docker",
    "aws",
    "prisma",
    "python",
    "java",
    "c++",
  ].filter((token) => lower.includes(token)).length;

  return hits >= 2 || (line.includes(",") && hits >= 1);
}

function looksLikeEducationLine(line: string) {
  return /(bachelor|master|b\.?tech|university|institute|college)/i.test(line);
}

function looksLikeContactLine(line: string) {
  return /@|linkedin|github|\+?\d[\d\s-]{7,}/i.test(line);
}

function structureResumeText(rawText: string): ParsedResume["structured"] {
  const prepared = injectSectionBreaks(rawText);
  const lines = splitLines(prepared);
  const sections: ParsedResume["structured"] = {
    summary: "",
    experience: [],
    projects: [],
    skills: [],
    education: [],
    misc: [],
  };

  let currentSection: SectionKey = "misc";

  for (const line of lines) {
    const headerSection = detectSectionHeader(line);
    if (headerSection) {
      currentSection = headerSection;
      continue;
    }

    if (looksLikeContactLine(line)) {
      sections.misc.push(line);
      continue;
    }

    if (looksLikeEducationLine(line) && currentSection !== "experience") {
      sections.education.push(line);
      continue;
    }

    if (looksLikeSkillLabel(line) || looksLikeSkillList(line)) {
      sections.skills.push(line);
      continue;
    }

    if (looksLikeProjectLine(line) && currentSection !== "experience") {
      sections.projects.push(line);
      continue;
    }

    if (currentSection === "summary") {
      sections.summary = sections.summary ? `${sections.summary} ${line}` : line;
      continue;
    }

    sections[currentSection].push(line);
  }

  return sections;
}

async function parsePdf(buffer: Buffer) {
  const importedModule = await loadModule("pdf-parse");
  const parser = (importedModule.default ?? importedModule) as (input: Buffer) => Promise<{ text?: string }>;
  const result = await parser(buffer);
  return result.text ?? "";
}

async function parseDocx(buffer: Buffer) {
  const importedModule = await loadModule("mammoth");
  const parser = importedModule.extractRawText as
    | ((input: { buffer: Buffer }) => Promise<{ value?: string }>)
    | undefined;

  if (!parser) {
    throw new Error("DOCX parser is not available");
  }

  const result = await parser({ buffer });
  return result.value ?? "";
}

export async function parseResumeFile(input: {
  mimeType: string;
  fileName: string;
  buffer: Buffer;
}): Promise<ParsedResume> {
  const mimeType = input.mimeType.toLowerCase();
  const isPdf = mimeType === "application/pdf" || input.fileName.toLowerCase().endsWith(".pdf");
  const isDocx =
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    input.fileName.toLowerCase().endsWith(".docx");

  let raw = "";

  if (isPdf) {
    raw = await parsePdf(input.buffer);
  } else if (isDocx) {
    raw = await parseDocx(input.buffer);
  } else {
    throw new Error(`Unsupported resume format: ${input.mimeType}`);
  }

  const rawText = normalizeText(raw);
  if (!rawText) {
    throw new Error("Parsed resume text is empty");
  }

  return {
    rawText,
    structured: structureResumeText(rawText),
    parserVersion: "real-v1-pdfparse-mammoth",
  };
}
