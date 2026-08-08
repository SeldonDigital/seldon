import { parseFontVariant } from "./font-variant"

/** `General Sans` -> `general-sans` (Fontshare CSS API family slug). */
function toSlug(family: string): string {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Maps a variant string to the number the Fontshare CSS API expects. Fontshare
 * numbers uprights by their weight and italics by weight plus one, so `700` is
 * bold upright and `701` is bold italic.
 */
function toFontshareStyleNumber(variant: string): number {
  const { weight, italic } = parseFontVariant(variant)

  return italic ? weight + 1 : weight
}

/**
 * Generates a Fontshare CSS API URL for a font family.
 *
 * @param fontFamily - Font family name, such as `Satoshi`.
 * @param variants - Variant strings to request, such as `"regular"` or `"700italic"`.
 *   When omitted or empty, every style the family ships is requested.
 * @returns Fontshare CSS API URL with `swap` display.
 */
export function getFontshareFontURL(fontFamily: string, variants?: string[]): string {
  const slug = toSlug(fontFamily)
  const base = "https://api.fontshare.com/v2/css"

  if (!variants || variants.length === 0) {
    return `${base}?f[]=${slug}&display=swap`
  }

  const numbers = [...new Set(variants.map(toFontshareStyleNumber))].sort((a, b) => a - b)

  return `${base}?f[]=${slug}@${numbers.join(",")}&display=swap`
}
