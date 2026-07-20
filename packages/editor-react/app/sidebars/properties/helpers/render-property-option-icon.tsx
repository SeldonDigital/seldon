import { LoadEditorIcons, asSymbolIconId } from "@app/LoadEditorIcons"
import { IconCustomColorValue, ThemeSwatches } from "@app/icons/custom"
import { type OptionIconRender } from "@app/menus"
import { useThemes } from "@app/themes/hooks/use-themes"
import { IconSeldonTheme } from "@seldon/components/icons/seldon/system/settings/IconSeldonTheme"
import {
  type PropertyOptionIconBinding,
  resolvePropertyOptionIconBinding,
} from "@seldon/editor/lib/icons/property-option-icon"
import { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { resolveThemeSwatchColors } from "@seldon/editor/lib/themes/resolve-theme-swatch-colors"
import React from "react"

import { Theme, Workspace } from "@seldon/core"
import { IconSeldonMissing } from "@seldon/core/icon-sets/catalog/seldon/user-interface/actions/IconSeldonMissing"

type OptionIcon = { value: string; name: string } | undefined

interface RenderPropertyOptionIconDeps {
  property: FlatProperty
  theme?: Theme
  workspace: Workspace
  themes: ReturnType<typeof useThemes>
}

export type { OptionIconRender } from "@app/menus"

/**
 * Builds the per-option icon resolver for a property combobox. The icon
 * decision comes from the shared `resolvePropertyOptionIconBinding`; this
 * function only maps each binding to its React node, since node rendering
 * stays per framework. Most options resolve to a plain icon id; the dynamic
 * cases render a node.
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
    return renderBinding(
      resolvePropertyOptionIconBinding({ property, theme, workspace, option }),
      property,
      themes,
    )
  }
}

/**
 * Maps one resolved icon binding to its React node. Plain icon ids flow through
 * the `optionIcon` slot; swatch chips, theme tokens, theme strips, and symbol
 * glyphs are dynamic nodes.
 */
function renderBinding(
  binding: PropertyOptionIconBinding,
  property: FlatProperty,
  themes: ReturnType<typeof useThemes>,
): OptionIconRender {
  switch (binding.kind) {
    case "iconId":
      return { kind: "iconId", icon: binding.icon }
    case "none":
      return { kind: "node", node: null }
    case "themeSwatches": {
      const optionTheme = themes.find((t) => t.id === binding.themeId)
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
    case "symbolUnavailable":
      // Icon turned off in its workspace set renders as a red Missing icon.
      return {
        kind: "node",
        node: (
          <LoadEditorIcons
            iconId={asSymbolIconId(binding.iconId)}
            unavailable
          />
        ),
      }
    case "symbolUnused":
      return { kind: "node", node: <IconSeldonMissing /> }
    case "symbolGlyph":
      return {
        kind: "node",
        node: <LoadEditorIcons iconId={asSymbolIconId(binding.iconId)} />,
      }
    case "swatchColor":
      return {
        kind: "node",
        node: <IconCustomColorValue color={binding.color} />,
      }
    case "themeToken":
      // `seldon-theme` is an editor-registry id, not an exported slot id, so it
      // renders as a node rather than through the `optionIcon` slot.
      return { kind: "node", node: <IconSeldonTheme /> }
  }
}
