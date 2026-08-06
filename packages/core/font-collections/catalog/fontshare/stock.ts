import { FONTSHARE_FONT_FAMILIES } from "../../../properties/constants/typography/fontshare-font-families"
import { fontshareDefaultEnabledFamilies } from "./default-enabled"

import type { FontFamilyEntry, StockFontCollection } from "../../types/font-collection"

/** Builds a stable family slot id from a family name, such as `General Sans` -> `general-sans`. */
function slugify(family: string): string {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const families: Record<string, FontFamilyEntry> = {}

for (const font of FONTSHARE_FONT_FAMILIES) {
  families[slugify(font.family)] = {
    name: font.family,
    origin: "fontshare",
    variants: font.variants,
  }
}

/**
 * The `Fontshare` collection. Families load from Fontshare (Indian Type Foundry). This
 * collection is seeded into new workspaces. Its faces are self-hosted for the canvas and
 * export emits a Fontshare CSS API link.
 */
export const collection: StockFontCollection = {
  metadata: {
    id: "fontshare",
    name: "Fontshare",
    description: "Font families served by Fontshare (Indian Type Foundry).",
    intent: "Remote font families loaded from Fontshare when added to a workspace.",
  },
  families,
  defaultEnabledFamilies: [...fontshareDefaultEnabledFamilies],
  seededByDefault: true,
}
