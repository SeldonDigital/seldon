import { parseFontVariant } from "@seldon/core/helpers/utils/font-variant"
import { getFontFileHref } from "./font-file"

/** One enabled remote family plus the variants to self-host. */
export interface FontFaceFamily {
  name: string
  slot: string
  variants: string[]
}

/** Escapes a family name for use inside a quoted CSS `font-family` value. */
function quoteFamily(name: string): string {
  return `"${name.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

/** Builds one `@font-face` block for a family variant served from local woff2. */
function buildFontFace(name: string, slot: string, variant: string): string {
  const { weight, italic } = parseFontVariant(variant)
  const src = getFontFileHref(slot, variant)
  return [
    "@font-face {",
    `  font-family: ${quoteFamily(name)};`,
    `  font-style: ${italic ? "italic" : "normal"};`,
    `  font-weight: ${weight};`,
    "  font-display: swap;",
    `  src: url("${src}") format("woff2");`,
    "}",
  ].join("\n")
}

/**
 * Builds the combined `@font-face` stylesheet for every enabled remote family,
 * one block per enabled variant. Returns an empty string when nothing is enabled.
 */
export function buildFontFaceCss(families: FontFaceFamily[]): string {
  return families
    .flatMap((family) =>
      family.variants.map((variant) =>
        buildFontFace(family.name, family.slot, variant),
      ),
    )
    .join("\n\n")
}
