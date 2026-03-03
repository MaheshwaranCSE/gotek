import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

export const db =
  global.cachedPrisma ??
  new PrismaClient({
    // Optional: log configuration can go here if needed
  });

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = db;
}

