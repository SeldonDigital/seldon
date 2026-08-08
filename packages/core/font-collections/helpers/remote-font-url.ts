import { getFontshareFontURL } from "../../helpers/utils/get-fontshare-font-url"
import { getGoogleFontURL } from "../../helpers/utils/get-google-font-url"
import { FONT_COLLECTIONS } from "../catalog"
import { isSelfHostedRemoteOrigin } from "../constants/font-origin"

import type { FontOrigin } from "../constants/font-origin"

/** Family name -> origin for every packaged family that self-hosts and emits a host link. */
const REMOTE_FAMILY_ORIGINS: ReadonlyMap<string, FontOrigin> = new Map(
  FONT_COLLECTIONS.flatMap((collection) =>
    Object.values(collection.families)
      .filter((family) => isSelfHostedRemoteOrigin(family.origin))
      .map((family) => [family.name, family.origin] as const),
  ),
)

/** True when `family` names a packaged remote family that may load from a font host. */
export function isRemoteFontFamily(family: string): boolean {
  return REMOTE_FAMILY_ORIGINS.has(family)
}

/**
 * Returns a font host URL for a family, or `null` when the family must not make a network request.
 *
 * Returns `null` for local families, theme tokens such as `@fontFamily.primary`, empty strings,
 * and any family that is not a packaged remote family. Google families resolve to a Google Fonts
 * URL and Fontshare families to a Fontshare CSS API URL. This keeps system fonts request-free and
 * blocks invalid tokens from becoming font host URLs.
 *
 * Pass `variants` to request only those weights and styles. When omitted, every weight is requested.
 */
export function getRemoteFontUrl(family: string, variants?: string[]): string | null {
  if (typeof family !== "string" || family.length === 0) return null
  if (family.startsWith("@")) return null

  const origin = REMOTE_FAMILY_ORIGINS.get(family)

  if (!origin) return null
  if (origin === "fontshare") return getFontshareFontURL(family, variants)

  return getGoogleFontURL(family, variants)
}
