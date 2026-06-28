import { isWorkspaceIconUnavailable } from "@lib/icon-sets/icon-availability"
import {
  type OptionIconDescriptor,
  getOptionIcon,
} from "@lib/icons/resolve-option-icon"
import React from "react"
import { Theme, Workspace } from "@seldon/core"
import { IconId, defaultIconId } from "@seldon/core/icon-sets"
import { IconSeldonMissing } from "@seldon/core/icon-sets/catalog/seldon/user-interface/actions/IconSeldonMissing"
import { useThemes } from "@lib/themes/hooks/use-themes"
import {
  IconCustomColorValue,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import { IconSeldonToken } from "@seldon/components/icons/seldon/user-interface/actions/IconSeldonToken"
import { LoadEditorIcons, asSymbolIconId } from "@app/LoadEditorIcons"
import { FlatProperty } from "./properties-data"
import { getRepeatSymbolDescendant } from "./repeat-display"
import { resolveThemeSwatchColors } from "./resolve-theme-swatch-colors"

type OptionIcon = { value: string; name: string } | undefined

interface RenderPropertyOptionIconDeps {
  property: FlatProperty
  theme?: Theme
  workspace: Workspace
  themes: ReturnType<typeof useThemes>
}

/**
 * How a property option's icon binds to the generated `ListboxOption`. An
 * `iconId` flows through the `optionIcon` slot (and its ref); a `node` is a
 * dynamic element (swatch chip, theme token, symbol glyph) the string-based
 * `Icon` slot cannot host, so it renders through the option's children instead.
 */
export type OptionIconRender =
  | { kind: "iconId"; icon: string }
  | { kind: "node"; node: React.ReactNode }

/**
 * Builds the per-option icon resolver for a property combobox. The theme
 * assignment row and symbol glyphs stay here because they depend on workspace
 * state; every other icon decision comes from `getOptionIcon`, which reads the
 * shared icons registry. Most options resolve to a plain icon id; only the
 * dynamic cases return a node.
 */
export function createPropertyOptionIconResolver({
  property,
  theme,
  workspace,
  themes,
}: RenderPropertyOptionIconDeps): (option?: {
  value: string
  name: string
}) => OptionIconRender {
  return function resolvePropertyOptionIcon(
    option: OptionIcon,
  ): OptionIconRender {
    // Theme-assignment row renders the theme's swatch strip.
    if (property.key === "theme" && option) {
      if (option.value === "none") {
        return { kind: "node", node: null }
      }
      const optionTheme = themes.find((t) => t.id === option.value)
      if (optionTheme) {
        return {
          kind: "node",
          node: (
            <ThemeSwatches colors={resolveThemeSwatchColors(optionTheme)} />
          ),
        }
      }
      return { kind: "node", node: null }
    }

    // Symbol rows (including repeat echo symbol rows) render the option value as
    // its icon glyph, with unavailable and unused handling that needs workspace.
    const isSymbolRow =
      property.key === "symbol" ||
      !!getRepeatSymbolDescendant(property.key, workspace)
    if (isSymbolRow && option && option.value && option.value !== "inherit") {
      // The default symbol is not a real glyph; show the property icon instead.
      if (option.value === defaultIconId) {
        return { kind: "iconId", icon: property.icon }
      }
      // Icon turned off in its workspace set renders as a red Missing icon.
      if (isWorkspaceIconUnavailable(option.value as IconId, workspace)) {
        return {
          kind: "node",
          node: (
            <LoadEditorIcons
              iconId={asSymbolIconId(option.value)}
              unavailable
            />
          ),
        }
      }
      // Check if this is an unused icon (missing from iconLabels)
      if (option.name === "[Unused Icon]") {
        return { kind: "node", node: <IconSeldonMissing /> }
      }
      return {
        kind: "node",
        node: <LoadEditorIcons iconId={asSymbolIconId(option.value)} />,
      }
    }

    // The "Default" ("") and "Inherit" rows are not icon ids; let them fall
    // through to the property's default icon.
    if (!option) {
      return { kind: "iconId", icon: property.icon }
    }

    return resolveOptionIconDescriptor(
      getOptionIcon(property.key, option.value, theme, property.icon),
      property,
    )
  }
}

/**
 * Maps one resolved icon descriptor to its binding. Static and glyph values are
 * plain icon ids that flow through the `optionIcon` slot; swatch chips and theme
 * tokens are dynamic nodes.
 */
function resolveOptionIconDescriptor(
  descriptor: OptionIconDescriptor,
  property: FlatProperty,
): OptionIconRender {
  switch (descriptor.kind) {
    case "swatchColor":
      return {
        kind: "node",
        node: <IconCustomColorValue color={descriptor.color} />,
      }
    case "themeToken":
      // `seldon-token` is an editor-registry id, not an exported slot id, so it
      // renders as a node rather than through the `optionIcon` slot.
      return { kind: "node", node: <IconSeldonToken /> }
    case "glyph":
      // Symbol glyphs are handled before this point; fall back to the property
      // icon for any other value-as-icon row.
      return { kind: "iconId", icon: property.icon }
    case "static":
      return { kind: "iconId", icon: descriptor.icon }
  }
}
