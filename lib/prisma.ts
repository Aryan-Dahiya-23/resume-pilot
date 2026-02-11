import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const dbUrl = new URL(connectionString);
const shouldUseTls =
  dbUrl.searchParams.has("sslmode") || dbUrl.hostname.endsWith("supabase.co");

const pool = new Pool({
  connectionString,
  ...(shouldUseTls
    ? {
        // Supabase connection endpoints require TLS; this avoids local cert chain failures.
        ssl: { rejectUnauthorized: false },
      }
    : {}),
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
