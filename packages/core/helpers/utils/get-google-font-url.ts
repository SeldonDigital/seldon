import { buildGoogleFontAxisParam } from "./font-variant"

/** Every `ital,wght` tuple Google lists, used when no specific variants are requested. */
const ALL_WEIGHTS_AXIS =
  "ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900"

/**
 * Generates a Google Fonts URL for a given font family.
 *
 * @param fontFamily - Font family name
 * @param variants - Variant strings to request (such as `"100"`, `"700italic"`).
 *   When omitted or empty, every weight is requested.
 * @returns Google Fonts URL with `swap` display
 */
export function getGoogleFontURL(
  fontFamily: string,
  variants?: string[],
): string {
  const axis =
    variants && variants.length > 0
      ? buildGoogleFontAxisParam(variants)
      : ALL_WEIGHTS_AXIS
  const params = new URLSearchParams({
    family: `${fontFamily}:${axis}`,
    display: "swap",
  })
  return `https://fonts.googleapis.com/css2?${params.toString()}`
}
