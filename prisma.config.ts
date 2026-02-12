import "dotenv/config";
import { defineConfig } from "prisma/config";

function withSslMode(url?: string) {
  if (!url) return undefined;
  const parsed = new URL(url);
  if (!parsed.searchParams.get("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }
  return parsed.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: withSslMode(process.env.DIRECT_URL ?? process.env.DATABASE_URL),
  },
});
