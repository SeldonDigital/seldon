import { isWorkspaceIconUnavailable } from "@seldon/editor/lib/icon-sets/icon-availability"
import { getOptionIcon } from "@seldon/editor/lib/icons/resolve-option-icon"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { getRepeatSymbolDescendant } from "@seldon/editor/lib/properties/inspector/repeat-display"
import type { Theme, Workspace } from "@seldon/core"
import { type IconId, defaultIconId } from "@seldon/core/icon-sets"

/**
 * Framework-neutral decision for a property option's icon. `iconId` values flow
 * through the string icon slot; every other kind is a dynamic node that each
 * editor renders in its own components. Extracted so React and Vue make the same
 * decision and only the node rendering differs per framework.
 */
export type PropertyOptionIconBinding =
  | { kind: "iconId"; icon: string }
  /** Theme-assignment "none" option: render no icon. */
  | { kind: "none" }
  /** Theme-assignment option: render the target theme's swatch strip. */
  | { kind: "themeSwatches"; themeId: string }
  /** Symbol picker option that maps to an available icon glyph. */
  | { kind: "symbolGlyph"; iconId: string }
  /** Symbol picker option whose icon is turned off in its workspace set. */
  | { kind: "symbolUnavailable"; iconId: string }
  /** Symbol picker option missing from the set's labels. */
  | { kind: "symbolUnused" }
  /** Theme swatch token: render a live color chip. */
  | { kind: "swatchColor"; color: string }
  /** Non-swatch theme token: render the shared theme token icon. */
  | { kind: "themeToken" }

interface ResolveBindingArgs {
  property: FlatProperty
  theme?: Theme
  workspace: Workspace
  /** The option being resolved. Absent for the Default/Inherit rows. */
  option?: { value: string; name?: string }
}

/**
 * Resolves the icon binding for one property combobox option. The theme
 * assignment row and symbol glyphs depend on workspace state; every other
 * decision comes from `getOptionIcon`, which reads the shared icons registry.
 * Most options resolve to a plain icon id; only the dynamic cases return a node
 * kind for the caller to render.
 */
export function resolvePropertyOptionIconBinding({
  property,
  theme,
  workspace,
  option,
}: ResolveBindingArgs): PropertyOptionIconBinding {
  if (property.key === "theme" && option) {
    if (option.value === "none") return { kind: "none" }
    return { kind: "themeSwatches", themeId: option.value }
  }

  const isSymbolRow =
    property.key === "symbol" ||
    !!getRepeatSymbolDescendant(property.key, workspace)

  if (isSymbolRow && option && option.value && option.value !== "inherit") {
    // The default symbol is not a real glyph; show the property icon instead.
    if (option.value === defaultIconId) {
      return { kind: "iconId", icon: property.icon }
    }
    if (isWorkspaceIconUnavailable(option.value as IconId, workspace)) {
      return { kind: "symbolUnavailable", iconId: option.value }
    }
    if (option.name === "[Unused Icon]") {
      return { kind: "symbolUnused" }
    }
    return { kind: "symbolGlyph", iconId: option.value }
  }

  // The "Default" ("") and "Inherit" rows are not icon ids; fall back to the
  // property's default icon.
  if (!option) {
    return { kind: "iconId", icon: property.icon }
  }

  const descriptor = getOptionIcon(
    property.key,
    option.value,
    theme,
    property.icon,
  )
  switch (descriptor.kind) {
    case "swatchColor":
      return { kind: "swatchColor", color: descriptor.color }
    case "themeToken":
      return { kind: "themeToken" }
    case "glyph":
      // Symbol glyphs are handled above; any other value-as-icon row falls back
      // to the property icon.
      return { kind: "iconId", icon: property.icon }
    case "static":
      return { kind: "iconId", icon: descriptor.icon }
  }
}
