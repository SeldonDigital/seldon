import type {
  FontCollectionPipelineInput,
  FontFamilyEntry,
  StockFontCollection,
} from "../types/font-collection"

/** Coerces a family entry into a complete `FontFamilyEntry` with a valid origin. */
function normalizeFamily(entry: FontFamilyEntry): FontFamilyEntry {
  return {
    ...entry,
    origin: entry.origin === "remote" ? "remote" : "local",
  }
}

/**
 * Normalizes a collection schema so every family has a valid origin.
 * Runs before `computeFontCollection` resolves the final collection.
 */
export function normalizeFontCollectionInput(
  input: FontCollectionPipelineInput,
): StockFontCollection {
  const families: Record<string, FontFamilyEntry> = {}
  for (const [key, entry] of Object.entries(input.families)) {
    if (!entry) continue
    families[key] = normalizeFamily(entry)
  }
  return { ...input, families } as StockFontCollection
}
