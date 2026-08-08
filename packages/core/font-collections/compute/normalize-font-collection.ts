import type { FontOrigin } from "../constants/font-origin"
import type {
  FontCollectionPipelineInput,
  FontFamilyEntry,
  StockFontCollection,
} from "../types/font-collection"

const FONT_ORIGINS: ReadonlySet<FontOrigin> = new Set<FontOrigin>(["local", "remote", "fontshare"])

/** Coerces a family entry into a complete `FontFamilyEntry` with a valid origin. */
function normalizeFamily(entry: FontFamilyEntry): FontFamilyEntry {
  return {
    ...entry,
    origin: FONT_ORIGINS.has(entry.origin) ? entry.origin : "local",
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
