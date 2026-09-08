import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const requireDependency = createRequire(import.meta.url);

// Load application TypeScript with explicit boundary mocks; no live credentials,
// database, or paid model calls are used by these regression tests.
function load(file, mocks = {}) {
  const filename = path.resolve(file);
  const loadedModule = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const resolve = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith(".")) return load(path.resolve(path.dirname(filename), id + ".ts"), mocks);
    return requireDependency(id);
  };
  new Function("require", "module", "exports", source)(resolve, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const evidence = load("lib/ai/review-evidence.ts");
const rawText = "Built accessible React dashboards\nfor internal operations.";
const finding = {
  kind: "improvement",
  observation: "Clarify the dashboard outcome.",
  evidence: "Built accessible React dashboards for internal operations.",
  action: "Explain who used the dashboards and what improved, if known.",
};

test("evidence accepts extraction whitespace but rejects invented and trivial quotes", () => {
  assert.equal(evidence.hasResumeEvidence(rawText, finding.evidence), true);
  assert.equal(evidence.hasResumeEvidence(rawText, "Increased revenue by 40%"), false);
  assert.equal(evidence.hasResumeEvidence(rawText, "React"), false);
  assert.deepEqual(evidence.verifyFindings([finding, { ...finding, evidence: "Invented employer experience" }, null], rawText), [finding]);
});

test("legacy and malformed findings remain safe to read", () => {
  assert.deepEqual(evidence.readFindings(undefined), []);
  assert.deepEqual(evidence.readFindings([{ ...finding, action: 42 }, { ...finding, kind: "unknown" }]), []);
});

test("AI review removes unsupported findings and rewrites and rejects invalid results", async () => {
  const originalFetch = global.fetch;
  const previousKey = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = "test-only";
  let response = {
    score: 73,
    findings: [finding, { ...finding, evidence: "An invented accomplishment" }],
    rewriteSuggestions: [
      { before: finding.evidence, after: "Built accessible React dashboards supporting internal operations.", why: "Clarifies purpose." },
      { before: "Managed a team of 20 people", after: "Led 20 engineers.", why: "Stronger verb." },
    ],
    nextActions: ["Clarify the dashboard outcome."],
  };
  global.fetch = async (_url, options) => {
    assert.ok(options.signal);
    const prompt = JSON.parse(options.body).messages[0].content;
    assert.ok(prompt.includes(new Date().toISOString().slice(0, 10)));
    return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(response) } }] }) };
  };
  try {
    const { reviewResumeWithDeepSeek } = load("lib/ai/review-resume.ts");
    const input = { rawText, structuredJson: {} };
    const result = await reviewResumeWithDeepSeek(input);
    assert.equal(result.findings.length, 1);
    assert.equal(result.rewriteSuggestions.length, 1);
    assert.deepEqual(result.weaknesses, [finding.observation]);
    response = { ...response, score: null };
    await assert.rejects(() => reviewResumeWithDeepSeek(input), /invalid score/);
    response = { ...response, score: 73, findings: [] };
    await assert.rejects(() => reviewResumeWithDeepSeek(input), /verifiable resume evidence/);
  } finally {
    global.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = previousKey;
  }
});

test("transient processing failure remains active until retries are exhausted", async () => {
  const statuses = [];
  let shouldFail = true;
  let saves = 0;
  const { processResume } = load("lib/inngest/functions/process-resume.ts", {
    "@/lib/inngest/client": { inngest: { createFunction: (options, handler) => ({ options, handler }) } },
    "@/lib/db/resumes": {
      getResumeById: async () => ({ storageKey: "test", fileName: "resume.pdf" }),
      updateResumeStatus: async (_id, status) => statuses.push(status),
      upsertResumeParse: async () => {},
      saveCompletedResumeReview: async (_id, runId) => { assert.equal(runId, "run-1"); saves++; },
    },
    "@/lib/ai/review-resume": { reviewResumeWithDeepSeek: async () => {
      if (shouldFail) throw new Error("temporary timeout");
      return { findings: [finding] };
    } },
    "@/lib/resume-parser": { parseResumeFile: async () => ({ rawText, structured: {} }) },
    "@/lib/supabase-storage": { downloadResumeFileFromSupabaseStorage: async () => Buffer.from("test") },
  });
  const input = { event: { name: "resume/uploaded", data: { resumeId: "resume-1" } }, runId: "run-1", step: { run: (_name, action) => action() } };
  await assert.rejects(() => processResume.handler(input), /temporary timeout/);
  assert.deepEqual(statuses, ["PARSING", "REVIEWING"]);
  assert.equal(saves, 0);
  shouldFail = false;
  await processResume.handler(input);
  assert.equal(saves, 1);
  await processResume.options.onFailure({ event: { data: { event: input.event } } });
  assert.equal(statuses.at(-1), "FAILED");
});

test("rerun rejects active or concurrently claimed work and recovers from queue failures", async () => {
  let status = "REVIEWING";
  let claimCount = 1;
  let sends = 0;
  const { POST } = load("app/api/resumes/[id]/rerun/route.ts", {
    "@clerk/nextjs/server": { auth: async () => ({ userId: "clerk-1" }) },
    "next/server": { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
    "@/lib/db/users": { ensureCurrentDbUser: async () => ({ id: "user-1" }) },
    "@/lib/db/resumes": {
      getResumeByIdForUser: async () => ({ id: "resume-1", status, updatedAt: new Date() }),
      claimResumeReview: async () => ({ count: claimCount }),
      updateResumeStatus: async (_id, value) => { status = value; },
    },
    "@/lib/inngest/client": { inngest: { send: async () => { sends++; throw new Error("queue unavailable"); } } },
  });
  const context = { params: Promise.resolve({ id: "resume-1" }) };
  assert.equal((await POST(null, context)).status, 409);
  assert.equal(sends, 0);
  status = "READY";
  claimCount = 0;
  assert.equal((await POST(null, context)).status, 409);
  assert.equal(sends, 0);
  claimCount = 1;
  assert.equal((await POST(null, context)).status, 503);
  assert.equal(status, "FAILED");
});

test("completed review save uses one transaction and a stable history ID", async () => {
  const calls = [];
  const model = (name) => ({
    upsert: (args) => { calls.push({ name, args }); return Promise.resolve(); },
    update: (args) => { calls.push({ name, args }); return Promise.resolve(); },
  });
  const { saveCompletedResumeReview } = load("lib/db/resumes.ts", {
    "@/lib/prisma": { prisma: {
      resumeReviewHistory: model("history"),
      resumeReview: model("review"),
      resume: model("resume"),
      $transaction: async (operations) => { assert.equal(operations.length, 3); await Promise.all(operations); },
    } },
    "@prisma/client": {},
  });
  await saveCompletedResumeReview("resume-1", "run-1", { score: 73, findings: [finding], strengths: [], weaknesses: [], nextActions: [], missingKeywords: [], rewriteSuggestions: [], model: "test" });
  assert.equal(calls[0].args.where.id, "run-1");
  assert.deepEqual(calls[0].args.update, {});
  assert.equal(calls[2].args.data.status, "READY");
});
