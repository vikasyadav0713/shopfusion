/**
 * prisma/download-images.ts
 *
 * Downloads product images from loremflickr (with Unsplash fallback),
 * saves them to `/public/products/{id}.jpg`, and updates the Prisma database
 * `images` field to point to the local path.
 *
 * Usage:
 *   npx ts-node prisma/download-images.ts
 *   — or —
 *   npx tsx prisma/download-images.ts
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// ─── Config ──────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.resolve(process.cwd(), "public", "products");
const DELAY_MS = 200;          // polite delay between requests
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 300;
const MAX_RETRIES = 2;

// ─── Prisma ───────────────────────────────────────────────────────────────────

const prisma = new PrismaClient();

// ─── Keyword extraction ───────────────────────────────────────────────────────

/**
 * Derives a focused search keyword from a product name + category.
 *
 * Rules:
 *  - Strip author attribution after em-dash / hyphen   ("Atomic Habits – James Clear" → "Atomic Habits")
 *  - Strip parenthetical edition notes                 ("Mein Kampf (Historical Reference Edition)" → "Mein Kampf")
 *  - Strip trailing noise words                        ("Set of 6", "3-Piece", …)
 *  - Books  → append "book cover"
 *  - Others → append the category as a context hint
 */
function extractKeyword(name: string, category: string): string {
  // 1. Remove everything after an em-dash or " – " (author names)
  let clean = name
    .split(/\s*[–—]\s*/)[0]
    .trim();

  // 2. Remove parenthetical suffixes  e.g. "(Historical Reference Edition)"
  clean = clean.replace(/\(.*?\)/g, "").trim();

  // 3. Remove common noise suffixes that hurt image search relevance
  const noiseSuffixes = [
    /\bset of \d+\b/i,
    /\d+-piece\b/i,
    /\b\d+kg\b/i,
    /\b\d+m\b/i,
    /\b\d+L\b/i,
    /\binch\b/i,
    /\bpro\b$/i,
  ];
  for (const rx of noiseSuffixes) {
    clean = clean.replace(rx, "").trim();
  }

  // 4. Append category-specific suffix
  if (category === "Books") {
    return `${clean} book cover`;
  }

  // For other categories use the category word as a search hint only when
  // it isn't already implied by the product name.
  const categoryHints: Record<string, string> = {
    Electronics: "product",
    Fashion: "fashion product",
    Home: "home product",
    Fitness: "fitness equipment",
  };

  const hint = categoryHints[category] ?? category.toLowerCase();
  return `${clean} ${hint}`;
}

// ─── URL builders ─────────────────────────────────────────────────────────────

function loremFlickrUrl(keyword: string): string {
  // loremflickr accepts comma-separated tags. Encode each tag but keep commas.
  const tags = keyword.split(/\s+/).map((t) => encodeURIComponent(t)).join(",");
  return `https://loremflickr.com/${IMAGE_WIDTH}/${IMAGE_HEIGHT}/${tags}`;
}

function unsplashFallbackUrl(keyword: string): string {
  // For source.unsplash.com use + between words
  const q = keyword.split(/\s+/).map((t) => encodeURIComponent(t)).join("+");
  return `https://source.unsplash.com/${IMAGE_WIDTH}x${IMAGE_HEIGHT}/?${q}`;
}

// ─── Download helper ──────────────────────────────────────────────────────────

async function downloadImage(
  url: string,
  destPath: string,
  retries = MAX_RETRIES
): Promise<boolean> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
      timeout: 15_000,
      maxRedirects: 5,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProductImageBot/1.0)",
      },
    });

    // Validate we actually got image bytes (not an HTML error page)
    const contentType = String(response.headers["content-type"] ?? "");
    if (!contentType.startsWith("image/")) {
      throw new Error(`Non-image content-type received: ${contentType}`);
    }

    fs.writeFileSync(destPath, Buffer.from(response.data));
    return true;
  } catch (err: unknown) {
    if (retries > 0) {
      await delay(500);
      return downloadImage(url, destPath, retries - 1);
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ Download failed after retries: ${message}`);
    return false;
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// ─── Stats tracker ────────────────────────────────────────────────────────────

interface Stats {
  total: number;
  skipped: number;
  downloaded: number;
  failed: number;
  usedFallback: number;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🚀 Starting product image downloader…\n");

  ensureDir(OUTPUT_DIR);

  // 1. Fetch all products from the database
  const products = await prisma.product.findMany();
  console.log(`📦 Found ${products.length} products in database.\n`);

  const stats: Stats = {
    total: products.length,
    skipped: 0,
    downloaded: 0,
    failed: 0,
    usedFallback: 0,
  };

  for (const product of products) {
    const destPath = path.join(OUTPUT_DIR, `${product.id}.jpg`);
    const dbPath = `/products/${product.id}.jpg`;

    // 2. Skip if file already exists
    if (fs.existsSync(destPath)) {
      console.log(`⏭  Skipping (exists): ${product.name}`);
      stats.skipped++;
      continue;
    }

    // 3. Build keyword
    const keyword = extractKeyword(product.name, product.category);
    console.log(`⬇  Downloading: "${product.name}"`);
    console.log(`   Keyword : ${keyword}`);

    // 4. Try primary source (loremflickr)
    const primaryUrl = loremFlickrUrl(keyword);
    console.log(`   Primary : ${primaryUrl}`);

    let success = await downloadImage(primaryUrl, destPath);
    let usedFallback = false;

    // 5. Fallback to Unsplash if primary failed
    if (!success) {
      const fallbackUrl = unsplashFallbackUrl(keyword);
      console.log(`   Fallback: ${fallbackUrl}`);
      success = await downloadImage(fallbackUrl, destPath);
      usedFallback = true;
    }

    if (!success) {
      console.error(`   ✗ FAILED to download image for: ${product.name}\n`);
      stats.failed++;
      await delay(DELAY_MS);
      continue;
    }

    // 6. Update database with local path
    await prisma.product.update({
      where: { id: product.id },
      data: { image: dbPath, images: [dbPath] },
    });

    stats.downloaded++;
    if (usedFallback) stats.usedFallback++;

    const size = (fs.statSync(destPath).size / 1024).toFixed(1);
    console.log(`   ✓ Saved  : ${dbPath} (${size} KB)\n`);

    // 7. Polite delay
    await delay(DELAY_MS);
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log("─".repeat(55));
  console.log("✅ Image download complete!\n");
  console.log(`  Total products : ${stats.total}`);
  console.log(`  Downloaded     : ${stats.downloaded}`);
  console.log(`  Skipped        : ${stats.skipped}`);
  console.log(`  Failed         : ${stats.failed}`);
  console.log(`  Used fallback  : ${stats.usedFallback}`);
  console.log("─".repeat(55));
}

main()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });