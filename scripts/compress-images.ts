/**
 * Compress all product images in public/products/.
 *
 * - Reads files into memory first (avoids OneDrive file lock issues)
 * - Resizes images to max 800px width
 * - Converts to optimized JPEG at 80% quality
 * - Skips SVG files
 *
 * Usage:  npx ts-node scripts/compress-images.ts
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const MAX_WIDTH = 800;
const JPEG_QUALITY = 80;
const SUPPORTED = [".jpg", ".jpeg", ".png", ".webp"];

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function processFile(filePath: string, file: string): Promise<{ before: number; after: number; status: string }> {
	const ext = path.extname(file).toLowerCase();
	const sizeBefore = fs.statSync(filePath).size;

	// Read entire file into a Buffer to avoid file-lock issues (OneDrive, dev server)
	const inputBuffer = fs.readFileSync(filePath);

	const outputBuffer = await sharp(inputBuffer)
		.resize({ width: MAX_WIDTH, withoutEnlargement: true })
		.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
		.toBuffer();

	if (outputBuffer.length >= sizeBefore) {
		return { before: sizeBefore, after: sizeBefore, status: "skip" };
	}

	// Write compressed version
	const newName = path.basename(file, ext) + ".jpg";
	const newPath = path.join(PRODUCTS_DIR, newName);
	fs.writeFileSync(newPath, outputBuffer);

	// Remove original if extension changed
	if (newName !== file) {
		try { fs.unlinkSync(filePath); } catch { /* ignore */ }
	}

	const saved = ((1 - outputBuffer.length / sizeBefore) * 100).toFixed(1);
	console.log(`  ✅ ${file} — ${formatBytes(sizeBefore)} → ${formatBytes(outputBuffer.length)} (${saved}% saved)`);
	return { before: sizeBefore, after: outputBuffer.length, status: "ok" };
}

async function main() {
	const files = fs.readdirSync(PRODUCTS_DIR);
	let totalBefore = 0;
	let totalAfter = 0;
	let compressed = 0;
	let skipped = 0;
	let failed = 0;

	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (!SUPPORTED.includes(ext)) continue;

		const filePath = path.join(PRODUCTS_DIR, file);

		try {
			const result = await processFile(filePath, file);
			totalBefore += result.before;
			totalAfter += result.after;

			if (result.status === "skip") {
				skipped++;
				console.log(`  ⏩ ${file} — already optimized (${formatBytes(result.before)})`);
			} else {
				compressed++;
			}
		} catch (err) {
			failed++;
			const size = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
			totalBefore += size;
			totalAfter += size;
			console.log(`  ❌ ${file} — ${(err as Error).message}`);
		}
	}

	const savedBytes = totalBefore - totalAfter;
	const savedPct = totalBefore > 0 ? ((savedBytes / totalBefore) * 100).toFixed(1) : "0";

	console.log(`\n📊 Summary:`);
	console.log(`   Compressed: ${compressed}`);
	console.log(`   Skipped:    ${skipped} (already small)`);
	console.log(`   Failed:     ${failed}`);
	console.log(`   Before:     ${formatBytes(totalBefore)}`);
	console.log(`   After:      ${formatBytes(totalAfter)}`);
	console.log(`   Saved:      ${formatBytes(savedBytes)} (${savedPct}%)`);
}

main().catch(console.error);
