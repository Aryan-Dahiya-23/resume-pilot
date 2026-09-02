import { Inngest } from "inngest";

const isInngestDev =
  process.env.INNGEST_DEV === "1" || process.env.NODE_ENV !== "production";

export const inngest = new Inngest({
  id: "ai-resume-reviewer",
  isDev: isInngestDev,
});
