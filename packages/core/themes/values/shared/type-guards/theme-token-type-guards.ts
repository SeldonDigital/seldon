import { Unit } from "../../../../properties/constants/shared/units"
import { TokenType } from "../../../constants/token-type"
import type { ThemeBorder } from "../../appearance/border"
import type { ThemeGradient } from "../../effects/gradient"
import type { ThemeScrollbar } from "../../effects/scrollbar"
import type { ThemeShadow } from "../../effects/shadow"
import type { ThemeFont } from "../../typography/font"
import type { ThemeExact } from "../exact/theme-exact"
import type { ThemeFontFamilyToken } from "../font-stack/theme-font-family-token"
import type { ThemeModulation } from "../modulated/theme-modulation"
import type { ThemeBorderWidthOption } from "../option/theme-border-width-option"
import type { ThemeBorderWidth } from "../ordinal/theme-border-width"
import type { StockSwatchDynamic, ThemeSwatch } from "../palette/theme-swatch"
import type { ThemeComputedGroup } from "../../computed/theme-computed-group"

export function isModulatedToken(
  v: ThemeBorderWidth | ThemeModulation | unknown,
): v is ThemeModulation {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as ThemeModulation).type === TokenType.MODULATED
  )
}

/** `TokenType.EXACT` with `unit: number` — `fontWeight` / `lineHeight` cells. */
export function isThemeExactNumberToken(v: unknown): v is ThemeExact {
  if (!isThemeExactToken(v)) {
    return false
  }
  return (v as ThemeExact).parameters.unit === Unit.NUMBER
}

/**
 * `TokenType.EXACT` — fixed length (`px`/`rem`), unitless number (`number`), percentage (`%`),
 * or angle (`deg`). Per-section schemas restrict which units a given section accepts.
 */
export function isThemeExactToken(v: unknown): v is ThemeExact {
  if (
    typeof v !== "object" ||
    v === null ||
    !("type" in v) ||
    !("parameters" in v)
  ) {
    return false
  }
  if ((v as ThemeExact).type !== TokenType.EXACT) {
    return false
  }
  const inner = (v as ThemeExact).parameters
  if (!inner || typeof inner !== "object" || !("unit" in inner)) {
    return false
  }
  const u = (inner as { unit: unknown }).unit
  const n = (inner as { value: unknown }).value
  if (typeof n !== "number" || !Number.isFinite(n)) {
    return false
  }
  return (
    u === Unit.PX ||
    u === Unit.REM ||
    u === Unit.PERCENT ||
    u === Unit.DEGREES ||
    u === Unit.NUMBER
  )
}

export function isSwatchToken(v: unknown): v is ThemeSwatch {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as ThemeSwatch).type === TokenType.SWATCH
  )
}

export function isFontFamilyToken(v: unknown): v is ThemeFontFamilyToken {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as ThemeFontFamilyToken).type === TokenType.FONT_FAMILY
  )
}

/** Theme token with {@link TokenType.OPTION} (e.g. hairline border width). */
export function isOptionToken(
  v: ThemeBorderWidth | unknown,
): v is ThemeBorderWidthOption {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as ThemeBorderWidthOption).type === TokenType.OPTION
  )
}

export function isDynamicSwatchToken(v: unknown): v is StockSwatchDynamic {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as StockSwatchDynamic).type === TokenType.DYNAMIC_SWATCH
  )
}

export function isLookToken(
  v: unknown,
): v is ThemeFont | ThemeShadow | ThemeBorder | ThemeGradient | ThemeScrollbar {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as { type: TokenType }).type === TokenType.LOOK
  )
}

/** Grouped configuration cell in the Computed section ({@link TokenType.COMPUTED}). */
export function isComputedGroupToken(
  v: unknown,
): v is ThemeComputedGroup<unknown> {
  return (
    typeof v === "object" &&
    v !== null &&
    "type" in v &&
    (v as { type: TokenType }).type === TokenType.COMPUTED
  )
}
