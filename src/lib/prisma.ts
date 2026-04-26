import { PrismaClient } from "@prisma/client";
  import { PrismaNeon } from "@prisma/adapter-neon";
  import { Pool } from "@neondatabase/serverless";

  declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
  }

  function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured.");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    const prismaOptions = {
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    } as unknown as ConstructorParameters<typeof PrismaClient>[0];

    return new PrismaClient(prismaOptions);
  }

  function getPrismaClient() {
    if (globalThis.prismaGlobal) {
      return globalThis.prismaGlobal;
    }

    const client = createPrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalThis.prismaGlobal = client;
    }

    return client;
  }

  export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
      const client = getPrismaClient() as any;
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    }
  });
