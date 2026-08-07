import type { FontOrigin } from "../constants/font-origin"

/** `IBM Plex Sans` -> `ibm-plex-sans`, the slug both vendors use in their URLs. */
function slugify(family: string): string {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Returns the vendor's public web page for a family, or `null` when the origin
 * has no hosted page (such as `local` system fonts). Google families resolve to
 * their Google Fonts specimen page and Fontshare families to their Fontshare
 * font page. Add a new remote vendor by adding its origin case here.
 */
export function getFontFamilyWebsiteUrl(family: string, origin: FontOrigin): string | null {
  if (typeof family !== "string" || family.length === 0) return null

  if (origin === "remote") {
    return `https://fonts.google.com/specimen/${family.replace(/ /g, "+")}`
  }

  if (origin === "fontshare") {
    return `https://www.fontshare.com/fonts/${slugify(family)}`
  }

  return null
}
