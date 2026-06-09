import { useMemo } from "react"
import {
  Board,
  Instance,
  PropertyKey,
  SubPropertyKey,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import { getUnitsForProperty } from "@seldon/core/properties"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import {
  childPathsUnderCompoundParent,
  parsePropertyPath,
} from "@lib/properties/property-paths"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { FlatProperty } from "../helpers/properties-data"
import { ICON_MAP } from "../helpers/properties-registry"
import { getPropertyPlaceholder } from "../helpers/shared-utils"
import { usePropertyExpansion } from "./use-property-expansion"

interface UseRowPropertyOptions {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  allProperties: FlatProperty[]
}

/**
 * Hook that provides simple data for rendering a property row.
 * Returns raw data that RowProperty uses to build props for ListItemTreeInput.
 */
export function useRowProperty({
  property,
  workspace,
  node,
  theme: _theme,
  allProperties,
}: UseRowPropertyOptions) {
  const { resetProperty } = useObjectProperties()
  const { isPropertyExpanded, toggleProperty } = usePropertyExpansion()
  const themes = useThemes()

  // Resolve the swatch cluster theme for the synthetic Theme-assignment row.
  const isThemeAssignment = property.pickerVariant === "themeAssignment"
  const themeForSwatches = useMemo<Theme | null>(() => {
    if (!isThemeAssignment) return null
    const displayThemeId = workspaceThemeService.getObjectThemeId(
      node,
      workspace,
    )
    return themes.find((t) => t.id === displayThemeId) ?? null
  }, [isThemeAssignment, node, workspace, themes])

  // a. Get sub-properties for this property
  const children = useMemo(() => {
    if (!property.isCompound && !property.isShorthand) return []
    return allProperties.filter(
      (p) =>
        p.isSubProperty && childPathsUnderCompoundParent(property.key, p.key),
    )
  }, [allProperties, property.key, property.isCompound, property.isShorthand])

  const hasChildren = children.length > 0
  const isExpanded = isPropertyExpanded(property.key)

  // Toggle expansion handler
  const handleToggle = () => {
    if (hasChildren) {
      toggleProperty(property.key)
    }
  }

  // Reset handler
  const handleReset = () => {
    if (property.isSubProperty) {
      const parsed = parsePropertyPath(property.key)
      if (parsed.kind === "layered-facet") {
        resetProperty(
          parsed.root as PropertyKey,
          parsed.facet as SubPropertyKey,
        )
      } else if (parsed.kind === "facet") {
        resetProperty(
          parsed.root as PropertyKey,
          parsed.facet as SubPropertyKey,
        )
      } else {
        resetProperty(property.key as PropertyKey)
      }
    } else {
      resetProperty(property.key as PropertyKey)
    }
  }

  // b. Property label
  const label = property.label

  // c. Property icon component
  const iconName = property.icon
  const IconComponent = useMemo(() => {
    const Component = ICON_MAP[iconName]
    if (!Component) {
      console.warn(
        `[use-row-property] Icon component not found for icon name: "${iconName}". ` +
          `Available keys in ICON_MAP: ${Object.keys(ICON_MAP).slice(0, 10).join(", ")}... (${Object.keys(ICON_MAP).length} total)`,
      )
    }
    return Component || ICON_MAP.IconTokenValue
  }, [iconName])

  // Convert property.icon string to icon ID format for Icon component
  // e.g., "IconTextValue" -> "icon-custom-text-value"
  const iconId = useMemo(() => {
    if (iconName.startsWith("Icon")) {
      const name = iconName.replace("Icon", "")
      // Convert camelCase to kebab-case: "TextValue" -> "text-value"
      const kebab = name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "")
      return `icon-custom-${kebab}`
    }
    return "seldon-component" // fallback
  }, [iconName])

  // Get placeholder
  const getPlaceholder = (defaultPlaceholder: string): string => {
    return getPropertyPlaceholder(property, defaultPlaceholder)
  }

  const getDefaultPlaceholder = (): string => {
    if (!property.controlType) return "No control"
    switch (property.controlType) {
      case "combo":
        return "Select or enter value"
      case "menu":
        return "Select value"
      case "number":
        return "Enter number"
      case "text":
        return "Enter text"
      default:
        return "Enter value"
    }
  }

  const placeholder = getPlaceholder(getDefaultPlaceholder())

  // e. Unit (PX/REM)
  const units = useMemo(() => getUnitsForProperty(property.key), [property.key])
  const unit = units.length > 0 ? units[0].toUpperCase() : undefined

  // f. Override status (for coloring)
  const isOverridden =
    property.status === "override" || property.status === "set"

  // g. Can reset: property can be reset if it has been overridden (status === "override")
  // This works for all property types: atomic, compound, and shorthand
  // Status "set" means it matches schema default, so resetting wouldn't change anything visible
  // Font collection family rows (`family.*`) and icon set rows (`icon.*`) carry
  // an override status only to render blue; they have no node-property reset, so
  // the affordance is hidden.
  const canReset =
    property.status === "override" &&
    !property.key.startsWith("family.") &&
    !property.key.startsWith("icon.")

  return {
    // a. Open/closed state
    isExpanded,
    hasChildren,

    // b. Property label
    label,

    // c. Property icon
    iconName,
    IconComponent,
    iconId,

    placeholder,
    isDimmed: property.isDimmed,
    controlType: property.controlType,

    // e. Unit (PX/REM)
    unit,

    // f. Override status
    isOverridden,
    canReset,

    // Handlers
    handleToggle,
    handleReset,

    // Children for expansion
    children,

    // Theme-assignment swatch cluster
    themeForSwatches,
  }
}
