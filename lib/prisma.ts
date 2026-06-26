import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// Eagerly warm up the database connection to avoid cold-start delays
// on the first page request (especially with Supabase PgBouncer).
prisma.$connect().catch((err: unknown) => {
	console.warn("[Prisma] Eager connection failed, will retry on first query:", err);
});

/**
 * Retry wrapper for Prisma queries.
 * Supabase PgBouncer connections can fail on cold starts — this retries
 * the query up to `maxRetries` times with exponential backoff.
 */
export async function prismaWithRetry<T>(
	fn: () => Promise<T>,
	maxRetries = 3,
	baseDelayMs = 500
): Promise<T> {
	let lastError: unknown;
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error: any) {
			lastError = error;
			// Retry on connection / timeout errors (common with PgBouncer cold starts)
			const isRetryable =
				error?.code === "P1001" || // Can't reach database server
				error?.code === "P1002" || // Database server timed out
				error?.code === "P1008" || // Operations timed out
				error?.code === "P1017" || // Server has closed the connection
				error?.code === "P2024" || // Connection pool timeout
				error?.message?.includes("connect ETIMEDOUT") ||
				error?.message?.includes("Connection refused") ||
				error?.message?.includes("connection is insecure") ||
				error?.message?.includes("Can't reach database server") ||
				error?.message?.includes("timed out");

			if (!isRetryable || attempt === maxRetries - 1) {
				throw error;
			}

			const delay = baseDelayMs * Math.pow(2, attempt);
			console.warn(
				`[Prisma] Query failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`,
				error?.code || error?.message
			);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
	throw lastError;
}
