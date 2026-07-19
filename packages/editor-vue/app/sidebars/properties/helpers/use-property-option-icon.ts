import type { Theme, Workspace } from "@seldon/core"
import { defaultIconId } from "@seldon/core/icon-sets"
import { getOptionIcon } from "@seldon/editor/lib/icons/resolve-option-icon"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { getRepeatSymbolDescendant } from "@seldon/editor/lib/properties/inspector/repeat-display"

interface ResolverDeps {
  property: FlatProperty
  theme?: Theme
  workspace: Workspace
}

/**
 * Builds a per-option icon resolver for a property combobox. Returns an icon id
 * string for the `ComboboxListbox` option chrome. Symbol rows render the value
 * itself as a glyph; theme tokens and swatch colors fall back to the theme token
 * icon and the property icon respectively, since the shared option list renders
 * icon ids only. Mirrors the intent of the React `createPropertyOptionIconResolver`.
 */
export function createPropertyOptionIconResolver({
  property,
  theme,
  workspace,
}: ResolverDeps): (value: string) => string {
  const isSymbolRow =
    property.key === "symbol" ||
    !!getRepeatSymbolDescendant(property.key, workspace)

  return function resolvePropertyOptionIcon(value: string): string {
    if (property.key === "theme") {
      return "seldon-theme"
    }

    if (isSymbolRow && value && value !== "inherit") {
      if (value === defaultIconId) return property.icon
      return value
    }

    const descriptor = getOptionIcon(property.key, value, theme, property.icon)
    switch (descriptor.kind) {
      case "static":
        return descriptor.icon
      case "glyph":
        return descriptor.value || property.icon
      case "themeToken":
        return "seldon-theme"
      case "swatchColor":
        return property.icon
    }
  }
}
