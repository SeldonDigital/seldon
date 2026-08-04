import {
  EDITOR_OPTION_ICON_OVERLAY,
  getPropertyRegistryEntry,
} from "@seldon/editor/lib/icons/icons-registry"
import { getComboboxStoredValue } from "@seldon/editor/lib/properties/combobox-stored-value"
import { getThemeTokenIconColor } from "@seldon/editor/lib/themes/theme-token-icon-color"
import { getCompoundSelectorFacet, isCompoundCatalogProperty } from "@seldon/core"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { getOptionIcon as coreGetOptionIcon } from "@seldon/core/icon-registry"
import { parseThemeLookRef } from "@seldon/core/themes/looks"

import type { Theme } from "@seldon/core"

/** Icon id rendered for theme token values that are not swatch colors. */
export const THEME_TOKEN_ICON = "seldon-theme"

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
  // A cleared "none" look (@border.none, @shadow.none) reads as an absence. Core
  // maps it to the shared block glyph, so delegate here rather than falling into
  // the theme-token branch below that every other look ref takes.
  if (parseThemeLookRef(value)?.id === "none") {
    return { kind: "static", icon: coreGetOptionIcon(propertyKey, value) ?? fallbackIcon }
  }

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
 * The icon id a closed property row shows for its current value, matching the
 * inspector. A per-option static icon wins, and glyph, theme token, and swatch
 * values keep the row's own icon rather than swapping to the token icon.
 */
export function resolveRowIconId(
  propertyKey: string,
  propertyValue: unknown,
  propertyIcon: string,
  theme?: Theme,
): string {
  const value = getCurrentOptionValue(propertyKey, propertyValue)
  const descriptor = getOptionIcon(propertyKey, value, theme, propertyIcon)

  return descriptor.kind === "static" ? descriptor.icon : propertyIcon
}

/**
 * Reads the currently selected option value for a property row. A compound
 * parent reflects its selector facet (`kind` for background, `preset` for board,
 * border, shadow, and font), so the row icon follows the selected shape or look
 * (a cleared @border.none look reads as the block glyph, a None background reads
 * as "none") instead of collapsing to empty when other facets are still set.
 * Every other property uses the stored combobox value.
 */
export function getCurrentOptionValue(propertyKey: string, propertyValue: unknown): string {
  if (isCompoundCatalogProperty(propertyKey)) {
    const selectorValue = getSelectorFacetValue(
      propertyValue,
      getCompoundSelectorFacet(propertyKey),
    )

    if (selectorValue) return selectorValue
  }

  return getComboboxStoredValue(propertyValue)
}

/**
 * Reads a compound's selector facet as its wire value, or "" when unset. Layered
 * compounds (background, shadow) store their layers in an array, so this reads
 * the top layer before reaching for the facet.
 */
function getSelectorFacetValue(value: unknown, facet: string): string {
  const layer = Array.isArray(value) ? value[0] : value

  if (!layer || typeof layer !== "object") {
    return ""
  }

  return getComboboxStoredValue((layer as Record<string, unknown>)[facet])
}
