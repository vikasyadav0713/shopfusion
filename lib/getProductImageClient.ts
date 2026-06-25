/**
 * Client-safe product image helper.
 *
 * On the client we cannot read the filesystem, so we resolve the image path
 * using a static mapping that is generated at build/dev time by the
 * `scripts/generate-image-map.ts` script, OR we fall back to a simple
 * name-based path guess that tries each supported extension via the
 * `onError` handler in the component.
 *
 * For server components, prefer the server-side `lib/getProductImage.ts`
 * which reads the filesystem directly.
 */

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
const PLACEHOLDER = "/products/placeholder.svg";

/**
 * Normalize a product name for matching (same logic as server-side).
 */
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

/**
 * Get the best-guess product image path for client-side rendering.
 * Returns the first candidate path (name as-is + .jpg).
 * The component should use `onError` to cycle through extensions.
 */
export function getProductImageClient(productName: string): string {
	if (!productName || typeof productName !== "string") return PLACEHOLDER;
	return `/products/${productName.trim()}.jpg`;
}

/**
 * Generate all candidate image paths for a product name.
 * Used by ProductImage component to cycle through on error.
 */
export function getProductImageCandidates(productName: string): string[] {
	if (!productName || typeof productName !== "string") return [PLACEHOLDER];

	const trimmed = productName.trim();
	const candidates: string[] = [];

	// Try exact name with each extension
	for (const ext of SUPPORTED_EXTENSIONS) {
		candidates.push(`/products/${trimmed}${ext}`);
	}

	// Try with dashes instead of spaces (some files use dashes)
	const dashed = trimmed.replace(/\s+/g, "-");
	if (dashed !== trimmed) {
		for (const ext of SUPPORTED_EXTENSIONS) {
			candidates.push(`/products/${dashed}${ext}`);
		}
	}

	// Fallback
	candidates.push(PLACEHOLDER);

	return candidates;
}
