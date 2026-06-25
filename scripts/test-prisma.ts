import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("Testing connection with Prisma...");
  try {
    const products = await prisma.product.findMany({
      take: 1
    });
    console.log("Success! Products:", products);
  } catch (error) {
    console.error("Prisma Connection Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
