import { resolvePropertyOptionIconBinding } from "@seldon/editor/lib/icons/property-option-icon"

import type { Theme, Workspace } from "@seldon/core"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

interface ResolverDeps {
  property: FlatProperty
  workspace: Workspace
  theme?: Theme
}

/**
 * Builds a per-option icon resolver for a property combobox. Returns an icon id
 * string for the `ComboboxOptions` option chrome. The icon decision comes from
 * the shared `resolvePropertyOptionIconBinding`; the string-based Vue option list
 * maps the dynamic node kinds to their nearest icon id, since it renders icon
 * ids only.
 */
export function createPropertyOptionIconResolver({
  property,
  theme,
  workspace,
}: ResolverDeps): (value: string) => string {
  return function resolvePropertyOptionIcon(value: string): string {
    const binding = resolvePropertyOptionIconBinding({
      property,
      theme,
      workspace,
      option: value ? { value } : undefined,
    })

    switch (binding.kind) {
      case "iconId":
        return binding.icon
      case "symbolGlyph":
      case "symbolUnavailable":
        return binding.iconId
      case "symbolUnused":
        return property.icon
      case "swatchColor":
        return property.icon
      case "themeSwatches":
      case "themeToken":
      case "none":
        return "seldon-theme"
    }
  }
}
