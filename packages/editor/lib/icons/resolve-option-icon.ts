import { Theme } from "@seldon/core"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { getOptionIcon as coreGetOptionIcon } from "@seldon/core/icon-registry"
import { getComboboxStoredValue } from "@app/sidebars/properties/helpers/combobox-stored-value"
import { getThemeTokenIconColor } from "@app/sidebars/properties/helpers/theme-token-icon-color"
import {
  EDITOR_OPTION_ICON_OVERLAY,
  getPropertyRegistryEntry,
} from "./icons-registry"

/** Icon id rendered for theme token values that are not swatch colors. */
export const THEME_TOKEN_ICON = "seldon-token"

/**
 * How a property value's icon should render. `static` is a plain icon id,
 * `glyph` renders the value itself as an icon (symbol pickers), `themeToken`
 * is the shared theme token icon, and `swatchColor` is a live color chip.
 */
export type OptionIconDescriptor =
  | { kind: "static"; icon: string }
  | { kind: "glyph"; value: string }
  | { kind: "themeToken" }
  | { kind: "swatchColor"; color: string }

/**
 * Resolves the icon for one property option value. Theme categorical and
 * ordinal values are always theme-driven: swatch tokens render a live color
 * chip, every other theme token renders the token icon. Otherwise the registry
 * decides: a per-option override if defined, else the property-set default.
 */
export function getOptionIcon(
  propertyKey: string,
  value: string,
  theme?: Theme,
  fallbackIcon: string = THEME_TOKEN_ICON,
): OptionIconDescriptor {
  if (isThemeValueKey(value)) {
    const swatchColor = getThemeTokenIconColor(value, theme)
    if (swatchColor) {
      return { kind: "swatchColor", color: swatchColor }
    }
    return { kind: "themeToken" }
  }

  const entry = getPropertyRegistryEntry(propertyKey)

  // Symbol/icon pickers store an icon id as their value, so render it directly.
  if (entry?.renderValueAsIcon && value && value !== "inherit") {
    return { kind: "glyph", value }
  }

  // Editor overlay (board preset device ids) wins, then the core registry
  // (per-option, global, and property defaults). Keys absent from the registry
  // (e.g. theme-sidebar token rows) fall back to the row's own icon rather than
  // the generic token icon.
  const icon =
    EDITOR_OPTION_ICON_OVERLAY[propertyKey]?.[value] ??
    coreGetOptionIcon(propertyKey, value) ??
    fallbackIcon
  return { kind: "static", icon }
}

/**
 * Reads the currently selected option value for a property row. The board
 * compound reflects its `preset` facet; every other property uses the stored
 * combobox value.
 */
export function getCurrentOptionValue(
  propertyKey: string,
  propertyValue: unknown,
): string {
  if (propertyKey === "board") {
    return getBoardPresetValue(propertyValue)
  }
  return getComboboxStoredValue(propertyValue)
}

/** Reads the board compound's preset facet value, or "" when unset (Default). */
function getBoardPresetValue(value: unknown): string {
  if (value && typeof value === "object" && "preset" in value) {
    const preset = (value as { preset?: unknown }).preset
    if (preset && typeof preset === "object" && "value" in preset) {
      const presetValue = (preset as { value?: unknown }).value
      return typeof presetValue === "string" ? presetValue : ""
    }
  }
  return ""
}
