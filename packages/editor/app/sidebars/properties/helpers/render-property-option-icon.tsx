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
  Icon,
  IconCustomColorValue,
  IconProps,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import { IconMaterialToken } from "@seldon/components/icons"
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
 * Builds the per-option icon renderer for a property combobox. The theme
 * assignment row and symbol glyphs stay here because they depend on workspace
 * state; every other icon decision comes from `getOptionIcon`, which reads the
 * shared icons registry.
 */
export function createPropertyOptionIconRenderer({
  property,
  theme,
  workspace,
  themes,
}: RenderPropertyOptionIconDeps): (option?: {
  value: string
  name: string
}) => React.ReactNode {
  return function renderPropertyOptionIcon(
    option: OptionIcon,
  ): React.ReactNode {
    // Theme-assignment row renders the theme's swatch strip.
    if (property.key === "theme" && option) {
      if (option.value === "none") {
        return null
      }
      const optionTheme = themes.find((t) => t.id === option.value)
      if (optionTheme) {
        return <ThemeSwatches colors={resolveThemeSwatchColors(optionTheme)} />
      }
      return null
    }

    // Symbol rows (including repeat echo symbol rows) render the option value as
    // its icon glyph, with unavailable and unused handling that needs workspace.
    const isSymbolRow =
      property.key === "symbol" ||
      !!getRepeatSymbolDescendant(property.key, workspace)
    if (isSymbolRow && option && option.value && option.value !== "inherit") {
      // The default symbol is not a real glyph; show the property icon instead.
      if (option.value === defaultIconId) {
        return (
          <Icon
            icon={property.icon as IconProps["icon"]}
            style={{ color: "inherit" }}
          />
        )
      }
      // Icon turned off in its workspace set renders as a red Missing icon.
      if (isWorkspaceIconUnavailable(option.value as IconId, workspace)) {
        return (
          <LoadEditorIcons iconId={asSymbolIconId(option.value)} unavailable />
        )
      }
      // Check if this is an unused icon (missing from iconLabels)
      if (option.name === "[Unused Icon]") {
        return <IconSeldonMissing />
      }
      return <LoadEditorIcons iconId={asSymbolIconId(option.value)} />
    }

    // The "Default" ("") and "Inherit" rows are not icon ids; let them fall
    // through to the property's default icon.
    if (!option) {
      return (
        <Icon
          icon={property.icon as IconProps["icon"]}
          style={{ color: "inherit" }}
        />
      )
    }

    return renderOptionIconDescriptor(
      getOptionIcon(property.key, option.value, theme, property.icon),
      property,
    )
  }
}

/**
 * Renders one resolved option icon. The generated icon class pins a dark color,
 * so static icons inherit the menu text color instead.
 */
function renderOptionIconDescriptor(
  descriptor: OptionIconDescriptor,
  property: FlatProperty,
): React.ReactNode {
  switch (descriptor.kind) {
    case "swatchColor":
      return <IconCustomColorValue color={descriptor.color} />
    case "themeToken":
      return <IconMaterialToken />
    case "glyph":
      // Symbol glyphs are handled before this point; fall back to the property
      // icon for any other value-as-icon row.
      return (
        <Icon
          icon={property.icon as IconProps["icon"]}
          style={{ color: "inherit" }}
        />
      )
    case "static":
      return (
        <Icon
          icon={descriptor.icon as IconProps["icon"]}
          style={{ color: "inherit" }}
        />
      )
  }
}
