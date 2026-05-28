import { IconCategory, iconCategories } from "../categories"
import { IconSetId } from "../types"

/**
 * Extracts icon set ID from a variant ID
 *
 * Handles both main variants and category variants:
 * - Main: "variant-icon-set-{iconSetId}-{nodeId}"
 * - Category: "variant-icon-set-{iconSetId}-{category}-{subcategory}-{nodeId}"
 *
 * @param variantId - The variant ID to extract from
 * @returns The icon set ID, or null if not found or invalid
 *
 * @example
 * extractIconSetIdFromVariantId("variant-icon-set-seldon-abc123") // "seldon"
 * extractIconSetIdFromVariantId("variant-icon-set-google-material-xyz456") // "google-material"
 * extractIconSetIdFromVariantId("variant-icon-set-seldon-common-actions-def789") // "seldon"
 */
export function extractIconSetIdFromVariantId(
  variantId: string,
): IconSetId | null {
  if (!variantId.startsWith("variant-icon-set-")) return null

  // Remove prefix to get the rest: {iconSetId}-{...}
  const withoutPrefix = variantId.replace("variant-icon-set-", "")

  // Try each valid icon set ID (longest first to match "google-material" before "google")
  const validIconSetIds: IconSetId[] = [
    "google-material", // Must check before any single-word IDs
    "carbon",
    "lucide",
    "seldon",
  ]

  for (const iconSetId of validIconSetIds) {
    if (withoutPrefix.startsWith(`${iconSetId}-`)) {
      // Check if what follows is NOT a category name (to distinguish from icon sheets)
      const afterIconSetId = withoutPrefix.replace(`${iconSetId}-`, "")
      const firstPart = afterIconSetId.split("-")[0]

      // If it's a category name, this is an icon sheet, not a main variant
      // But we still return the icon set ID since that's what was requested
      return iconSetId
    }
  }

  return null
}
