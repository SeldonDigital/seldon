import { GOOGLE_FONT_FAMILIES } from "../../../properties/constants/typography/font-families"
import type {
  FontFamilyEntry,
  StockFontCollection,
} from "../../types/font-collection"

/** Builds a stable family slot id from a family name, such as `IBM Plex Sans` -> `ibm-plex-sans`. */
function slugify(family: string): string {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const families: Record<string, FontFamilyEntry> = {}
for (const font of GOOGLE_FONT_FAMILIES) {
  families[slugify(font.family)] = {
    name: font.family,
    origin: "remote",
    variants: font.variants,
  }
}

/**
 * The `Google Fonts` collection. Families load from Google Fonts. This collection is not
 * seeded by default. A workspace adds it through `add_font_collection`.
 */
const collection: StockFontCollection = {
  metadata: {
    id: "googleFonts",
    name: "Google Fonts",
    description: "Font families served by Google Fonts.",
    intent:
      "Remote font families loaded from Google Fonts when added to a workspace.",
  },
  families,
}

export default collection
