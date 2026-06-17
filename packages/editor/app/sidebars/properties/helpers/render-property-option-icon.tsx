import { isWorkspaceIconUnavailable } from "@lib/icon-sets/icon-availability"
import React from "react"
import { Theme, Workspace } from "@seldon/core"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { IconId } from "@seldon/core/icon-sets"
import { IconSeldonMissing } from "@seldon/core/icon-sets/catalog/seldon/user-interface/actions/IconSeldonMissing"
import { useThemes } from "@lib/themes/hooks/use-themes"
import {
  Icon,
  IconProps,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import { IconCustomColorValue } from "@seldon/components/custom-icons"
import { IconSeldonToken } from "@seldon/components/icons"
import { LoadEditorIcons } from "@app/LoadEditorIcons"
import { getBoardPresetIconId } from "./board-preset-icon"
import { FlatProperty } from "./properties-data"
import { resolveThemeSwatchColors } from "./resolve-theme-swatch-colors"
import { getThemeTokenIconColor } from "./theme-token-icon-color"

type OptionIcon = { value: string; name: string } | undefined

interface RenderPropertyOptionIconDeps {
  property: FlatProperty
  theme?: Theme
  workspace: Workspace
  themes: ReturnType<typeof useThemes>
}

/**
 * Builds the per-option icon renderer for a property combobox. Resolves theme
 * swatches, theme-token color chips, symbol icons, and the property's default
 * icon, keeping that branching out of the control's JSX.
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

    if (option) {
      const swatchColor = getThemeTokenIconColor(option.value, theme)
      if (swatchColor) {
        return <IconCustomColorValue color={swatchColor} />
      }
      if (isThemeValueKey(option.value)) {
        return <IconSeldonToken />
      }
    }

    // The "Default" ("") and "Inherit" rows are not icon ids; let them fall
    // through to the property's default icon.
    if (
      property.key === "symbol" &&
      option &&
      option.value &&
      option.value !== "inherit"
    ) {
      // Icon turned off in its workspace set renders as a red Missing icon.
      if (isWorkspaceIconUnavailable(option.value as IconId, workspace)) {
        return <LoadEditorIcons iconId={option.value as IconId} unavailable />
      }
      // Check if this is an unused icon (missing from iconLabels)
      if (option.name === "[Unused Icon]") {
        return <IconSeldonMissing />
      }
      return <LoadEditorIcons iconId={option.value as IconId} />
    }

    if (
      (property.key === "board" || property.key === "board.preset") &&
      option
    ) {
      return (
        <LoadEditorIcons
          iconId={getBoardPresetIconId(option.value)}
          style={{ color: "inherit" }}
        />
      )
    }

    // The generated icon class pins a dark color, so the icon inherits the
    // menu text color instead.
    return (
      <Icon
        icon={property.icon as IconProps["icon"]}
        style={{ color: "inherit" }}
      />
    )
  }
}
