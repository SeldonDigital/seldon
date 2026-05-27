import { ValueType } from "../../properties"
import type {
  ThemeBackgroundKey,
  ThemeBorderKey,
  ThemeFontKey,
  ThemeGradientKey,
  ThemeShadowKey,
} from "../types/theme-reference-keys"
import type {
  ThemeBackgroundId,
  ThemeBorderId,
  ThemeFontId,
  ThemeGradientId,
  ThemeShadowId,
} from "../types/theme-token-ids"
import type { ComputedTheme, StockTheme } from "../types/theme"
import { TokenType } from "../values"
import type { ThemeBackground } from "../values/appearance/background"
import type { ThemeBorder } from "../values/appearance/border"
import type { ThemeGradient } from "../values/effects/gradient"
import type { ThemeShadow } from "../values/effects/shadow"
import type { ThemeFont } from "../values/typography/font"

export const SHADOW_LOOK_NONE = "@shadow.none" as const satisfies ThemeShadowKey
export const GRADIENT_LOOK_NONE = "@gradient.none" as const satisfies ThemeGradientKey
export const BACKGROUND_LOOK_NONE =
  "@background.none" as const satisfies ThemeBackgroundKey
export const BORDER_LOOK_NONE = "@border.none" as const satisfies ThemeBorderKey
export const FONT_LOOK_NORMAL = "@font.normal" as const satisfies ThemeFontKey

export type BuiltInLookSection =
  | "shadow"
  | "gradient"
  | "background"
  | "border"
  | "font"

export const BUILT_IN_LOOK_SECTIONS: readonly BuiltInLookSection[] = [
  "shadow",
  "gradient",
  "background",
  "border",
  "font",
] as const

const SHADOW_PARAMETER_KEYS = [
  "offsetX",
  "offsetY",
  "blur",
  "color",
  "brightness",
  "opacity",
  "spread",
] as const

const GRADIENT_PARAMETER_KEYS = [
  "gradientType",
  "angle",
  "startColor",
  "startOpacity",
  "startBrightness",
  "startPosition",
  "endColor",
  "endOpacity",
  "endBrightness",
  "endPosition",
] as const

const BACKGROUND_PARAMETER_KEYS = [
  "image",
  "position",
  "size",
  "repeat",
  "color",
  "blendMode",
  "filter",
  "brightness",
  "opacity",
] as const

const BORDER_PARAMETER_KEYS = [
  "style",
  "color",
  "width",
  "brightness",
  "opacity",
] as const

const FONT_PARAMETER_KEYS = [
  "family",
  "style",
  "weight",
  "size",
  "lineHeight",
  "textCase",
  "letterSpacing",
] as const

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
  BuiltInLookSection,
  { id: string; name: string; token: string; parameterKeys: readonly string[] }
> = {
  shadow: {
    id: "none",
    name: "None",
    token: SHADOW_LOOK_NONE,
    parameterKeys: SHADOW_PARAMETER_KEYS,
  },
  gradient: {
    id: "none",
    name: "None",
    token: GRADIENT_LOOK_NONE,
    parameterKeys: GRADIENT_PARAMETER_KEYS,
  },
  background: {
    id: "none",
    name: "None",
    token: BACKGROUND_LOOK_NONE,
    parameterKeys: BACKGROUND_PARAMETER_KEYS,
  },
  border: {
    id: "none",
    name: "None",
    token: BORDER_LOOK_NONE,
    parameterKeys: BORDER_PARAMETER_KEYS,
  },
  font: {
    id: "normal",
    name: "Normal",
    token: FONT_LOOK_NORMAL,
    parameterKeys: FONT_PARAMETER_KEYS,
  },
}

function buildBuiltInLookCell(
  section: BuiltInLookSection,
): ThemeShadow | ThemeGradient | ThemeBackground | ThemeBorder | ThemeFont {
  const definition = BUILT_IN_LOOK_DEFINITIONS[section]
  return {
    type: TokenType.LOOK,
    name: definition.name,
    intent: `Built-in ${definition.name.toLowerCase()} look for ${section}.`,
    parameters: buildEmptyParameters(definition.parameterKeys),
  }
}

export function getBuiltInLookId(section: BuiltInLookSection): string {
  return BUILT_IN_LOOK_DEFINITIONS[section].id
}

export function getBuiltInLookToken(section: BuiltInLookSection): string {
  return BUILT_IN_LOOK_DEFINITIONS[section].token
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
  return null
}

export function injectBuiltInLooks<T extends StockTheme | ComputedTheme>(
  theme: T,
): T {
  const next = { ...theme } as T & Record<string, unknown>

  for (const section of BUILT_IN_LOOK_SECTIONS) {
    const definition = BUILT_IN_LOOK_DEFINITIONS[section]
    const existing = (next[section] ?? {}) as Record<string, unknown>
    const { [definition.id]: _reserved, ...rest } = existing
    ;(next as Record<string, unknown>)[section] = {
      [definition.id]: buildBuiltInLookCell(section),
      ...rest,
    }
  }

  return next
}

export function isReservedThemeLookId(
  section: BuiltInLookSection,
  id: string,
): id is ThemeShadowId | ThemeGradientId | ThemeBackgroundId | ThemeBorderId | ThemeFontId {
  return id === BUILT_IN_LOOK_DEFINITIONS[section].id
}
