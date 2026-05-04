import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const keywordImages: Array<{ keyword: RegExp; url: string }> = [
  {
    keyword: /laptop|macbook|notebook/i,
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /headphones|earbuds/i,
    url: "https://images.unsplash.com/photo-1518441902110-18d6f9cde8b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /smartphone|phone|mobile/i,
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /sneakers|shoes/i,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /shirt|t-shirt|tshirt|polo/i,
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /jeans|denim/i,
    url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /sofa|couch/i,
    url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /table|desk/i,
    url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /chair|recliner/i,
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /dumbbell|kettlebell|barbell/i,
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /treadmill/i,
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  },
  {
    keyword: /book|novel|biography/i,
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
  },
];

const fallbackByCategory: Record<string, string> = {
  Electronics:
    "https://images.unsplash.com/photo-1512446816042-444d64126703?auto=format&fit=crop&w=800&q=80",
  Fashion:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  Home:
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  Fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  Books:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
};

const resolveImage = (name: string, category: string) => {
  const matched = keywordImages.find((entry) => entry.keyword.test(name));
  if (matched) return matched.url;
  return fallbackByCategory[category] ?? fallbackByCategory.Electronics;
};

const localImagePath = (id: number) => `/products/${id}.jpg`;

const localImageExists = (id: number) => {
  const absolutePath = path.resolve(
    process.cwd(),
    "public",
    "products",
    `${id}.jpg`
  );
  return fs.existsSync(absolutePath);
};

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true },
  });

  const updates = products.map((product) => {
    const image = localImageExists(product.id)
      ? localImagePath(product.id)
      : resolveImage(product.name, product.category);
    return {
      id: product.id,
      image,
      images: [image],
    };
  });

  for (const update of updates) {
    await prisma.product.update({
      where: { id: update.id },
      data: { image: update.image, images: update.images },
    });
  }

  console.log(`Updated ${updates.length} product images.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
