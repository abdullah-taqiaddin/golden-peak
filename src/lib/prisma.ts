 import { PrismaClient } from "@prisma/client";
  import { PrismaNeon } from "@prisma/adapter-neon";
  import { Pool } from "@neondatabase/serverless";

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);

  declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
  }

  const prismaOptions = {
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  } as unknown as ConstructorParameters<typeof PrismaClient>[0];

  export const prisma = globalThis.prismaGlobal ?? new PrismaClient(prismaOptions);

  if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
  }