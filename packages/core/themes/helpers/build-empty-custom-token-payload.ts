/**
 * Default payload for a new custom token, per custom-capable section.
 *
 * Returns the `add_theme_custom_{section}` payload minus `themeId`. The editor
 * spreads it onto a dispatched add action; centralizing the defaults here keeps
 * the same shapes available to agents.
 */
import { Unit } from "../../properties/constants/shared/units"
import { ValueType } from "../../properties/constants/shared/value-types"
import { Colorspace } from "../constants/colorspace"
import { LOOK_FACETS, isLookSection } from "../looks/look-facets"

/** Add-action payload without the `themeId` field. */
export type EmptyCustomTokenPayload = {
  name: string
  intent?: string
} & Record<string, unknown>

const EMPTY_FACET_VALUE = { type: ValueType.EMPTY, value: null } as const

/** Scale sections whose default cell is a modulated step on the scale. */
const MODULATED_SCALE_SECTIONS: readonly string[] = [
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "corners",
  "fontSize",
  "blur",
  "spread",
]

function buildEmptyLookParameters(
  section: keyof typeof LOOK_FACETS,
): Record<string, typeof EMPTY_FACET_VALUE> {
  const parameters: Record<string, typeof EMPTY_FACET_VALUE> = {}
  for (const facet of LOOK_FACETS[section]) {
    parameters[facet.facet] = EMPTY_FACET_VALUE
  }
  return parameters
}

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

  if (MODULATED_SCALE_SECTIONS.includes(section)) {
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
