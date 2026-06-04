/**
 * Helpers for font variant strings such as `"100"`, `"regular"`, `"italic"`, and
 * `"700italic"`. A variant pairs a numeric weight with an italic flag.
 */

export interface ParsedFontVariant {
  weight: number
  italic: boolean
}

/** Parses a Google-style variant string into a weight and italic flag. */
export function parseFontVariant(variant: string): ParsedFontVariant {
  const italic = variant.endsWith("italic")
  const weightPart = italic ? variant.slice(0, -"italic".length) : variant
  if (weightPart === "" || weightPart === "regular") {
    return { weight: 400, italic }
  }
  const weight = Number(weightPart)
  return { weight: Number.isFinite(weight) ? weight : 400, italic }
}

/** Returns the `ital,wght` tuple for a variant, such as `"1,700"`. */
export function fontVariantToAxisTuple(variant: string): string {
  const { weight, italic } = parseFontVariant(variant)
  return `${italic ? 1 : 0},${weight}`
}

/** Returns a human label for a variant, such as `"700 Italic"`. */
export function fontVariantDisplayLabel(variant: string): string {
  const { weight, italic } = parseFontVariant(variant)
  return `${weight}${italic ? " Italic" : ""}`
}

/**
 * Sorts variant strings into a stable order: uprights before italics, then
 * ascending by weight. Google lists variants per the font's upstream metadata,
 * which is inconsistent across families, so normalize here. Returns a new array.
 */
export function sortFontVariants(variants: string[]): string[] {
  return [...variants].sort((a, b) => {
    const pa = parseFontVariant(a)
    const pb = parseFontVariant(b)
    return (
      Number(pa.italic) - Number(pb.italic) || pa.weight - pb.weight
    )
  })
}

/**
 * Builds the `ital,wght@...` family axis parameter from variant strings. Tuples
 * are deduped and sorted ascending by italic then weight, as Google requires.
 * Returns an empty string when no variants are given.
 */
export function buildGoogleFontAxisParam(variants: string[]): string {
  if (variants.length === 0) return ""
  const byKey = new Map<string, { ital: number; wght: number }>()
  for (const variant of variants) {
    const { weight, italic } = parseFontVariant(variant)
    const ital = italic ? 1 : 0
    byKey.set(`${ital},${weight}`, { ital, wght: weight })
  }
  const sorted = Array.from(byKey.values()).sort(
    (a, b) => a.ital - b.ital || a.wght - b.wght,
  )
  return `ital,wght@${sorted.map((t) => `${t.ital},${t.wght}`).join(";")}`
}
