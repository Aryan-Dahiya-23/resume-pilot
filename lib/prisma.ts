import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or DIRECT_URL) is not set");
}

const dbUrl = new URL(connectionString);
const isSupabaseHost =
  dbUrl.hostname.endsWith("supabase.co") ||
  dbUrl.hostname.endsWith("supabase.com");
const sslMode = dbUrl.searchParams.get("sslmode");
const shouldUseTls = Boolean(sslMode) || isSupabaseHost;
const shouldRelaxTlsValidation =
  isSupabaseHost && sslMode !== "verify-full" && sslMode !== "verify-ca";

const pool = new Pool({
  connectionString,
  ...(shouldUseTls
    ? {
        ssl: shouldRelaxTlsValidation
          ? { rejectUnauthorized: false }
          : true,
      }
    : {}),
});
const adapter = new PrismaPg(pool);

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
}

const cachedPrisma = globalForPrisma.prisma;
const hasJobDelegate =
  cachedPrisma &&
  typeof (cachedPrisma as unknown as { job?: unknown }).job !== "undefined";

export const prisma = cachedPrisma && hasJobDelegate ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
