import { getGoogleFontURL } from "../../helpers/utils/get-google-font-url"
import { FONT_COLLECTIONS } from "../catalog"

/** Family names from every packaged collection whose `origin` is `remote`. */
const REMOTE_FAMILY_NAMES: ReadonlySet<string> = new Set(
  FONT_COLLECTIONS.flatMap((collection) =>
    Object.values(collection.families)
      .filter((family) => family.origin === "remote")
      .map((family) => family.name),
  ),
)

/** True when `family` names a packaged remote family that may load from a font host. */
export function isRemoteFontFamily(family: string): boolean {
  return REMOTE_FAMILY_NAMES.has(family)
}

/**
 * Returns a font host URL for a family, or `null` when the family must not make a network request.
 *
 * Returns `null` for local families, theme tokens such as `@fontFamily.primary`, empty strings,
 * and any family that is not a packaged remote family. This keeps system fonts request-free and
 * blocks invalid tokens from becoming font host URLs.
 *
 * Pass `variants` to request only those weights and styles. When omitted, every weight is requested.
 */
export function getRemoteFontUrl(
  family: string,
  variants?: string[],
): string | null {
  if (typeof family !== "string" || family.length === 0) return null
  if (family.startsWith("@")) return null
  if (!REMOTE_FAMILY_NAMES.has(family)) return null
  return getGoogleFontURL(family, variants)
}
