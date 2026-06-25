import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BRANDS = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "IKEA", "Zara", "Puma"];
const DISCOUNTS = [0, 0, 0, 10, 15, 20, 25, 30, 40, 50]; // 0 is more common

async function main() {
  console.log("Seeding brands and discounts...");
  const products = await prisma.product.findMany();

  for (const product of products) {
    const randomBrand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const randomDiscount = DISCOUNTS[Math.floor(Math.random() * DISCOUNTS.length)];

    await prisma.product.update({
      where: { id: product.id },
      data: {
        brand: randomBrand,
        discount: randomDiscount,
      },
    });
  }

  console.log(`Updated ${products.length} products with random brands and discounts!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
