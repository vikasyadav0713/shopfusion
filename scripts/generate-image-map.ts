/**
 * Scan public/products/ and generate a JSON mapping of
 * normalized product names → image file paths.
 *
 * Usage:
 *   npx ts-node scripts/generate-image-map.ts
 *
 * Output:
 *   public/products/image-map.json
 */

import fs from "fs";
import path from "path";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const OUTPUT_FILE = path.join(PRODUCTS_DIR, "image-map.json");

function normalize(name: string): string {
	return name
		.replace(/[''`]/g, "")
		.replace(/[,.:;!?]/g, "")
		.replace(/[-–—]/g, " ")
		.replace(/[&]/g, "and")
		.replace(/[[\](){}]/g, "")
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase();
}

function main() {
	if (!fs.existsSync(PRODUCTS_DIR)) {
		console.error(`❌ Directory not found: ${PRODUCTS_DIR}`);
		process.exit(1);
	}

	const files = fs.readdirSync(PRODUCTS_DIR);
	const mapping: Record<string, { normalized: string; path: string; extension: string }> = {};
	let imageCount = 0;

	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

		const baseName = path.basename(file, ext);
		const normalizedKey = normalize(baseName);
		const imagePath = `/products/${file}`;

		// Priority: .jpg > .jpeg > .png > .webp
		if (mapping[normalizedKey]) {
			const existingPriority = SUPPORTED_EXTENSIONS.indexOf(
				mapping[normalizedKey].extension
			);
			const newPriority = SUPPORTED_EXTENSIONS.indexOf(ext);
			if (newPriority >= existingPriority) continue;
		}

		mapping[normalizedKey] = {
			normalized: normalizedKey,
			path: imagePath,
			extension: ext,
		};
		imageCount++;
	}

	// Create a clean output map: normalized_name → path
	const outputMap: Record<string, string> = {};
	for (const [key, value] of Object.entries(mapping)) {
		outputMap[key] = value.path;
	}

	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputMap, null, 2), "utf-8");

	console.log(`\n✅ Image map generated successfully!`);
	console.log(`   📁 Output: ${OUTPUT_FILE}`);
	console.log(`   🖼️  Images found: ${imageCount}`);
	console.log(`   🔑 Unique products: ${Object.keys(outputMap).length}`);
	console.log(`\n📋 Sample entries:`);

	const entries = Object.entries(outputMap).slice(0, 5);
	for (const [key, val] of entries) {
		console.log(`   "${key}" → ${val}`);
	}

	if (Object.keys(outputMap).length > 5) {
		console.log(`   ... and ${Object.keys(outputMap).length - 5} more\n`);
	}
}

main();
