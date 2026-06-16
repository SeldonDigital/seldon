import { ValueType } from "../../properties/constants"
import type { ComputedTheme, StockTheme } from "../types/theme"
import type {
  ThemeBorderKey,
  ThemeFontKey,
  ThemeShadowKey,
} from "../types/theme-reference-keys"
import type {
  ThemeBorderId,
  ThemeFontId,
  ThemeGradientId,
  ThemeShadowId,
} from "../types/theme-token-ids"
import { TokenType } from "../values"
import type { ThemeBorder } from "../values/appearance/border"
import type { ThemeGradient } from "../values/effects/gradient"
import type { ThemeScrollbar } from "../values/effects/scrollbar"
import type { ThemeShadow } from "../values/effects/shadow"
import type { ThemeFont } from "../values/typography/font"
import { LOOK_FACETS } from "./look-facets"

export const SHADOW_LOOK_NONE = "@shadow.none" as const satisfies ThemeShadowKey
export const BORDER_LOOK_NONE = "@border.none" as const satisfies ThemeBorderKey
export const FONT_LOOK_NORMAL = "@font.normal" as const satisfies ThemeFontKey

export type BuiltInLookSection = "shadow" | "gradient" | "border" | "font"

export const BUILT_IN_LOOK_SECTIONS: readonly BuiltInLookSection[] = [
  "shadow",
  "gradient",
  "border",
  "font",
] as const

/**
 * Look sections that carry a built-in cleared look (`none` / `normal`). The
 * `gradient` section is a look section without a cleared look: a gradient layer
 * resets through its `Default` (EMPTY) preset, not a `@gradient.none` token.
 */
export type ClearedLookSection = "shadow" | "border" | "font"

export const CLEARED_LOOK_SECTIONS: readonly ClearedLookSection[] = [
  "shadow",
  "border",
  "font",
] as const

/** Every look section that must always carry its full reserved id set. */
export type ReservedLookSection = BuiltInLookSection | "scrollbar"

/** Facet keys per section, derived from the shared {@link LOOK_FACETS} descriptor. */
const PARAMETER_KEYS_BY_SECTION = {
  shadow: LOOK_FACETS.shadow.map((facet) => facet.facet),
  gradient: LOOK_FACETS.gradient.map((facet) => facet.facet),
  border: LOOK_FACETS.border.map((facet) => facet.facet),
  font: LOOK_FACETS.font.map((facet) => facet.facet),
  scrollbar: LOOK_FACETS.scrollbar.map((facet) => facet.facet),
} satisfies Record<ReservedLookSection, readonly string[]>

/**
 * Reserved (named) look ids per section. These must always be present in a
 * computed theme so their rows never disappear from the editor, even when a
 * theme or variant fails to author one. Mirrors the reserved keys in
 * `types/theme-token-ids.ts`.
 */
export const RESERVED_LOOK_IDS: Record<ReservedLookSection, readonly string[]> = {
  shadow: ["none", "xlight", "light", "moderate", "strong", "xstrong"],
  gradient: ["primary", "gradient1", "gradient2"],
  border: ["none", "hairline", "thin", "normal", "thick", "bevel"],
  font: [
    "normal",
    "display",
    "heading",
    "subheading",
    "title",
    "subtitle",
    "callout",
    "body",
    "label",
    "tagline",
    "code",
  ],
  scrollbar: ["primary"],
}

const RESERVED_LOOK_SECTIONS: readonly ReservedLookSection[] = [
  "shadow",
  "gradient",
  "border",
  "font",
  "scrollbar",
] as const

function humanizeLookId(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1)
}

const EMPTY_PROPERTY_VALUE = {
  type: ValueType.EMPTY,
  value: null,
} as const

function buildEmptyParameters(
  keys: readonly string[],
): Record<string, typeof EMPTY_PROPERTY_VALUE> {
  const parameters: Record<string, typeof EMPTY_PROPERTY_VALUE> = {}
  for (const key of keys) {
    parameters[key] = EMPTY_PROPERTY_VALUE
  }
  return parameters
}

const BUILT_IN_LOOK_DEFINITIONS: Record<
  ClearedLookSection,
  { id: string; name: string; token: string }
> = {
  shadow: { id: "none", name: "None", token: SHADOW_LOOK_NONE },
  border: { id: "none", name: "None", token: BORDER_LOOK_NONE },
  font: { id: "normal", name: "Normal", token: FONT_LOOK_NORMAL },
}

function isClearedLookSection(
  section: BuiltInLookSection,
): section is ClearedLookSection {
  return section in BUILT_IN_LOOK_DEFINITIONS
}

function buildBuiltInLookCell(
  section: ClearedLookSection,
): ThemeShadow | ThemeGradient | ThemeBorder | ThemeFont {
  const definition = BUILT_IN_LOOK_DEFINITIONS[section]
  return {
    type: TokenType.LOOK,
    name: definition.name,
    intent: `Built-in ${definition.name.toLowerCase()} look for ${section}.`,
    parameters: buildEmptyParameters(PARAMETER_KEYS_BY_SECTION[section]),
  }
}

/** Reserved cleared-look id for a section, or `null` when it has none (gradient). */
export function getBuiltInLookId(section: BuiltInLookSection): string | null {
  return isClearedLookSection(section)
    ? BUILT_IN_LOOK_DEFINITIONS[section].id
    : null
}

/** Reserved cleared-look token for a section, or `null` when it has none. */
export function getBuiltInLookToken(section: BuiltInLookSection): string | null {
  return isClearedLookSection(section)
    ? BUILT_IN_LOOK_DEFINITIONS[section].token
    : null
}

export function isBuiltInLookSection(
  propertyKey: string,
): propertyKey is BuiltInLookSection {
  return (BUILT_IN_LOOK_SECTIONS as readonly string[]).includes(propertyKey)
}

export function getBuiltInLookSectionForPropertyKey(
  propertyKey: string,
): BuiltInLookSection | null {
  if (isBuiltInLookSection(propertyKey)) {
    return propertyKey
  }
  if (
    propertyKey === "borderTop" ||
    propertyKey === "borderRight" ||
    propertyKey === "borderBottom" ||
    propertyKey === "borderLeft"
  ) {
    return "border"
  }
  if (propertyKey === "background") {
    return "gradient"
  }
  return null
}

function buildReservedLookCell(
  section: ReservedLookSection,
  id: string,
):
  | ThemeShadow
  | ThemeGradient
  | ThemeBorder
  | ThemeFont
  | ThemeScrollbar {
  return {
    type: TokenType.LOOK,
    name: humanizeLookId(id),
    intent: `Reserved ${id} look for ${section}.`,
    parameters: buildEmptyParameters(PARAMETER_KEYS_BY_SECTION[section]),
  }
}

export function injectBuiltInLooks<T extends StockTheme | ComputedTheme>(
  theme: T,
): T {
  const next = { ...theme } as T & Record<string, unknown>

  // Force the cleared built-in look (`none` / `normal`) so it always reads empty.
  // The gradient section has no cleared look, so it is skipped here.
  for (const section of CLEARED_LOOK_SECTIONS) {
    const definition = BUILT_IN_LOOK_DEFINITIONS[section]
    const existing = (next[section] ?? {}) as Record<string, unknown>
    const { [definition.id]: _reserved, ...rest } = existing
    ;(next as Record<string, unknown>)[section] = {
      [definition.id]: buildBuiltInLookCell(section),
      ...rest,
    }
  }

  // Guarantee the full reserved id set per look section. Authored and custom
  // cells are preserved; only missing reserved ids get an empty fallback cell.
  for (const section of RESERVED_LOOK_SECTIONS) {
    const existing = (next[section] ?? {}) as Record<string, unknown>
    const filled: Record<string, unknown> = { ...existing }
    for (const id of RESERVED_LOOK_IDS[section]) {
      if (filled[id] === undefined || filled[id] === null) {
        filled[id] = buildReservedLookCell(section, id)
      }
    }
    ;(next as Record<string, unknown>)[section] = filled
  }

  return next
}

export function isReservedThemeLookId(
  section: BuiltInLookSection,
  id: string,
): id is ThemeShadowId | ThemeGradientId | ThemeBorderId | ThemeFontId {
  return id === getBuiltInLookId(section)
}
