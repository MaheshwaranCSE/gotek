import { PrismaClient } from "@prisma/client";

declare global {
    var cachedPrisma: PrismaClient | undefined;
}

// In development, Next.js hot reloading can cause too many database connections.
// Here we cache the instance globally in development environments to prevent issues.
export const db =
    global.cachedPrisma ??
    new PrismaClient({
        // Optional: Log queries during development for debugging
        // log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.cachedPrisma = db;
}
