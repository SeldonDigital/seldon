/**
 * Default payload for a new custom token, per custom-capable section.
 *
 * Returns the `add_theme_custom_{section}` payload minus `themeId`. The editor
 * spreads it onto a dispatched add action; centralizing the defaults here keeps
 * the same shapes available to agents.
 */
import { Unit } from "../../properties/constants/shared/units"
import { Colorspace } from "../constants/colorspace"
import { MODULATED_SCALE_SECTIONS } from "../constants/scale-sections"
import { buildEmptyLookParameters, isLookSection } from "../looks/look-facets"

/** Add-action payload without the `themeId` field. */
export type EmptyCustomTokenPayload = {
  name: string
  intent?: string
} & Record<string, unknown>

/** Builds the default add payload (minus `themeId`) for a custom token. */
export function buildEmptyCustomTokenPayload(
  section: string,
): EmptyCustomTokenPayload {
  const name = "New Token"

  if (isLookSection(section)) {
    return {
      name,
      intent: "Custom token",
      parameters: buildEmptyLookParameters(section),
    }
  }

  if (section === "swatch") {
    return {
      name,
      intent: "Custom token",
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 0, saturation: 0, lightness: 0 },
      },
    }
  }

  if ((MODULATED_SCALE_SECTIONS as readonly string[]).includes(section)) {
    return {
      name,
      intent: "Custom token",
      kind: "modulated",
      parameters: { step: 0 },
    }
  }

  if (section === "borderWidth") {
    return { name, intent: "Custom token", parameters: { step: 0 } }
  }

  if (section === "fontWeight") {
    return {
      name,
      intent: "Custom token",
      parameters: { unit: Unit.NUMBER, value: 400 },
    }
  }

  if (section === "lineHeight") {
    return {
      name,
      intent: "Custom token",
      parameters: { unit: Unit.NUMBER, value: 1.2 },
    }
  }

  return { name, intent: "Custom token" }
}
