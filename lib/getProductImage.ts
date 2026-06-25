import fs from "fs";
import path from "path";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
const PLACEHOLDER = "/products/placeholder.svg";

/**
 * Normalize a product name for fuzzy file matching.
 *
 * Strips apostrophes, commas, colons, dashes (all Unicode variants),
 * ampersands, brackets, and other special characters, then collapses
 * whitespace to a single space and trims.
 */
function normalize(name: string): string {
	return name
		.replace(/[''`]/g, "") // apostrophes / backticks
		.replace(/[,.:;!?]/g, "") // punctuation
		.replace(/[-–—]/g, " ") // dashes (ASCII + en-dash + em-dash)
		.replace(/[&]/g, "and") // ampersands → "and"
		.replace(/[[\](){}]/g, "") // brackets
		.replace(/[^\w\s]/g, "") // any remaining special chars
		.replace(/\s+/g, " ") // collapse whitespace
		.trim()
		.toLowerCase();
}

/**
 * Build a file-system-safe lookup cache of every image inside
 * `public/products/`, keyed by normalized basename (without extension).
 *
 * Only called once per server cold start thanks to module-level caching.
 */
function buildImageMap(): Map<string, string> {
	const map = new Map<string, string>();
	const productsDir = path.join(process.cwd(), "public", "products");

	if (!fs.existsSync(productsDir)) return map;

	const files = fs.readdirSync(productsDir);

	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (!(SUPPORTED_EXTENSIONS as readonly string[]).includes(ext)) continue;

		const baseName = path.basename(file, ext);
		const normalizedKey = normalize(baseName);

		// Priority: .jpg > .jpeg > .png > .webp
		// Only overwrite if the new file has higher priority
		const existing = map.get(normalizedKey);
		if (existing) {
			const existingExt = path.extname(existing).toLowerCase();
			const existingPriority = SUPPORTED_EXTENSIONS.indexOf(
				existingExt as (typeof SUPPORTED_EXTENSIONS)[number]
			);
			const newPriority = SUPPORTED_EXTENSIONS.indexOf(
				ext as (typeof SUPPORTED_EXTENSIONS)[number]
			);
			if (newPriority >= existingPriority) continue;
		}

		map.set(normalizedKey, `/products/${file}`);
	}

	return map;
}

// Module-level cache — built once on first import (server-side only)
let imageMap: Map<string, string> | null = null;

function getMap(): Map<string, string> {
	if (!imageMap) {
		imageMap = buildImageMap();
	}
	return imageMap;
}

/**
 * Return the local image path for a product, matched by name.
 *
 * @example
 *   getProductImage("Bata Comfit Leather Loafers")
 *   // → "/products/Bata Comfit Leather Loafers.jpg"
 *
 *   getProductImage("Mi Smart Band 8 Pro")
 *   // → "/products/Mi-Smart-Band-8-Pro.jpg"
 *
 *   getProductImage("Unknown Product XYZ")
 *   // → "/products/placeholder.jpg"
 */
export function getProductImage(productName: string): string {
	const map = getMap();
	const key = normalize(productName);
	return map.get(key) ?? PLACEHOLDER;
}

/**
 * Invalidate the cached image map.
 * Call this if images are added/removed at runtime (e.g. after an upload).
 */
export function invalidateImageCache(): void {
	imageMap = null;
}
