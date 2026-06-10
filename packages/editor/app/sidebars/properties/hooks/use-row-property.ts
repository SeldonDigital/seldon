import { MenuEntry } from "@lib/menus"
import {
  childPathsUnderCompoundParent,
  parsePropertyPath,
} from "@lib/properties/property-paths"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Board,
  Instance,
  PropertyKey,
  SubPropertyKey,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useImageUploadPanel } from "@app/panels/hooks/use-upload-image-panel"
import { buildPropertyOptions } from "../helpers/build-property-options"
import {
  FRAME_REF_ATTR,
  FRAME_REF_SELECTOR,
  FRAME_REF_VALUE,
  buildPropertyRowProps,
} from "../helpers/build-property-row-props"
import { getDisplayValue } from "../helpers/display-value-utils"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "../helpers/editing-contexts"
import { FlatProperty } from "../helpers/properties-data"
import { getPropertyRegistryEntry } from "../helpers/properties-registry"
import {
  getPropertyLabelStyle,
  getPropertyRowStyle,
} from "../helpers/property-styling-tokens"
import {
  isNumericPropertyValue,
  stripDisplayUnitSuffix,
} from "../helpers/property-value-display"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "../helpers/theme-token-icon-color"
import { usePropertyControlData } from "./use-property-control-data"
import { usePropertyExpansion } from "./use-property-expansion"
import { usePropertyFrameHover } from "./use-property-frame-hover"

export interface RowPropertyProps {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  allProperties: FlatProperty[]
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

/**
 * ViewModel for a property row. Owns the edit/hover state, display derivation,
 * interaction commands, and the assembled props for `ListItemTreeInput`,
 * `PropertyValueCell`, and the reset menu, so `RowProperty` stays a binding
 * shell. Child rows are returned as plain props for the shell to recurse on.
 */
export function useRowProperty({
  property,
  workspace,
  node,
  theme,
  allProperties,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: RowPropertyProps) {
  const { showPropertyTypes } = useDebugMode()
  const { resetProperty } = useObjectProperties()
  const { isPropertyExpanded, toggleProperty } = usePropertyExpansion()
  const themes = useThemes()
  const { getPropertyValueForDisplay, getUnit, shouldShowMenuIcon } =
    usePropertyControlData({ property, theme })
  const { show: showUploadPanel } = useImageUploadPanel()

  const frameRef = useRef<HTMLDivElement>(null)
  const [isEditingProperty, setIsEditingProperty] = useState(false)

  // Sub-properties for this compound/shorthand property.
  const children = useMemo(() => {
    if (!property.isCompound && !property.isShorthand) return []
    return allProperties.filter(
      (p) =>
        p.isSubProperty && childPathsUnderCompoundParent(property.key, p.key),
    )
  }, [allProperties, property.key, property.isCompound, property.isShorthand])

  const hasChildren = children.length > 0
  const isExpanded = isPropertyExpanded(property.key)
  const labelText = property.label
  const isThemeAssignment = property.pickerVariant === "themeAssignment"

  const iconName = property.icon
  // Convert property.icon string to icon ID format, e.g. "IconTextValue" ->
  // "icon-custom-text-value".
  const iconId = useMemo(() => {
    if (iconName.startsWith("Icon")) {
      const name = iconName.replace("Icon", "")
      const kebab = name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "")
      return `icon-custom-${kebab}`
    }
    return "seldon-component"
  }, [iconName])

  // Can reset only when overridden. Font collection family rows (`family.*`) and
  // icon set rows (`icon.*`) carry an override status for color only; they have
  // no node-property reset, so the affordance is hidden.
  const canReset =
    property.status === "override" &&
    !property.key.startsWith("family.") &&
    !property.key.startsWith("icon.")

  // Resolve the swatch cluster theme for the synthetic Theme-assignment row.
  const themeForSwatches = useMemo<Theme | null>(() => {
    if (!isThemeAssignment) return null
    const displayThemeId = workspaceThemeService.getObjectThemeId(
      node,
      workspace,
    )
    return themes.find((t) => t.id === displayThemeId) ?? null
  }, [isThemeAssignment, node, workspace, themes])

  const propertyValue = getPropertyValueForDisplay()

  // Options for theme value matching (UI optimization).
  const options = useMemo(
    () => buildPropertyOptions({ property, theme, workspace, subject: node }),
    [property, theme, node, workspace],
  )

  const nodeId = isBoard(node) ? getComponentKey(node) : node.id
  const unit = getUnit()
  const isNumericValue = useMemo(
    () => isNumericPropertyValue(property),
    [property],
  )

  // Strip the unit suffix from the display value when a separate unit label is
  // shown, avoiding redundant output like "10px PX".
  const value = stripDisplayUnitSuffix(
    getDisplayValue(
      propertyValue,
      property.key,
      nodeId,
      workspace,
      theme,
      options,
    ),
    unit,
    isNumericValue,
  )

  const rowStyle = useMemo(
    () => getPropertyRowStyle(property, showPropertyTypes),
    [property, showPropertyTypes],
  )
  const labelStyle = useMemo(
    () => getPropertyLabelStyle(property, showPropertyTypes),
    [property, showPropertyTypes],
  )
  const labelColor = labelStyle.color

  const swatchChipColor = useMemo(() => {
    if (!theme || !isSwatchIconPropertyKey(property.key)) {
      return undefined
    }
    return getThemeTokenIconColorFromPropertyValue(property.value, theme)
  }, [property.key, property.value, theme])

  const rowColor = rowStyle.color as string | undefined
  const { setIsHovered, style: hoverStyle } = usePropertyFrameHover(rowColor)

  // Check if property supports upload (combo control + IconImageValue icon).
  const registryEntry = getPropertyRegistryEntry(property.key)
  const supportsUpload =
    registryEntry?.control === "combo" &&
    registryEntry?.icon === "IconImageValue"

  const handleToggle = () => {
    if (hasChildren) {
      toggleProperty(property.key)
    }
  }

  const handleReset = () => {
    // Theme rows reset their entry override; node dispatches do not apply.
    if (themeEditingContext?.isThemeEditing) {
      themeEditingContext.resetThemeProperty(property)
      return
    }
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

  const handleFrameMouseEnter = () => {
    // Don't enable hover for dimmed (read-only) properties.
    if (!property.isDimmed) {
      setIsHovered(true)
    }
  }
  const handleFrameMouseLeave = () => setIsHovered(false)

  // Reset hover state when clicking outside the frame.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        frameRef.current &&
        !frameRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsHovered])

  const handleFrameClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (property.isDimmed || !property.controlType || isEditingProperty) {
      return
    }

    const target = event.target as HTMLElement
    if (target.closest("button") || target.closest(".sdn-button-iconic")) {
      return
    }

    // Only enter edit mode when clicking the actual control input area; let row
    // clicks elsewhere handle toggling.
    const inputElement = target.closest("input, textarea, select")
    if (!inputElement) {
      return
    }

    event.stopPropagation()
    setIsEditingProperty(true)
  }

  const handleLabel2Click = useCallback(
    (event: React.MouseEvent) => {
      if (!property.isDimmed && property.controlType) {
        event.stopPropagation()
        setIsEditingProperty(true)
      }
    },
    [property.isDimmed, property.controlType, setIsEditingProperty],
  )

  const handleRowClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.target as HTMLElement
    if (
      target.closest("button") ||
      target.closest(".sdn-button-iconic") ||
      isEditingProperty ||
      property.isDimmed ||
      !hasChildren
    ) {
      return
    }

    // Don't toggle when clicking the value-cell frame control.
    if (target.closest(FRAME_REF_SELECTOR)) {
      return
    }

    handleToggle()
  }

  const handleUploadClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (supportsUpload) {
        const uploadPanelProperty = property.key.includes(".")
          ? property.key.replace(/\./g, "-")
          : property.key

        showUploadPanel({
          property: uploadPanelProperty as "source" | "background-image",
        })
      }
    },
    [property.key, showUploadPanel, supportsUpload],
  )

  const handleMenuClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (
        !property.isDimmed &&
        !isEditingProperty &&
        (property.controlType === "menu" || property.controlType === "combo")
      ) {
        setIsEditingProperty(true)
      }
    },
    [property.isDimmed, property.controlType, isEditingProperty],
  )

  const setFrameRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      frameRef.current = el
    }
  }, [])

  const handleFrameRefClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const frameElement = event.currentTarget as HTMLDivElement
      if (frameElement && frameElement !== frameRef.current) {
        frameRef.current = frameElement
      }
      handleFrameClick(event)
    },
    [handleFrameClick],
  )

  const resetActions: MenuEntry[] = canReset
    ? [
        {
          id: "reset",
          label: `Reset ${labelText}`,
          onSelect: handleReset,
          testId: `property-row-${property.key}-reset`,
        },
      ]
    : []

  const listItemProps = buildPropertyRowProps({
    property,
    isExpanded,
    hasChildren,
    labelText,
    labelStyle,
    labelColor,
    iconId,
    isThemeAssignment,
    swatchChipColor,
    unit,
    isNumericValue,
    isEditingProperty,
    supportsUpload,
    showMenuIcon: shouldShowMenuIcon(),
    handleToggle,
    handleLabel2Click,
    handleUploadClick,
    handleMenuClick,
  })

  const rowCursor = hasChildren || property.controlType ? "pointer" : "default"

  const frameProps = {
    [FRAME_REF_ATTR]: FRAME_REF_VALUE,
    ref: setFrameRef,
    onClick: handleFrameRefClick,
    onMouseEnter: handleFrameMouseEnter,
    onMouseLeave: handleFrameMouseLeave,
    style: {
      width: "100%",
      position: "relative",
      cursor: rowCursor,
      userSelect: "none",
      WebkitUserSelect: "none",
      ...hoverStyle,
    },
  } as React.HTMLAttributes<HTMLDivElement> & {
    ref?: (el: HTMLDivElement | null) => void
  }

  const rowStyleProp: React.CSSProperties = {
    ...rowStyle,
    width: "100%",
    justifyContent: "flex-start",
    cursor: hasChildren ? "pointer" : "default",
    userSelect: "none",
    WebkitUserSelect: "none",
  }

  const valueCellProps = {
    property,
    value,
    node,
    theme,
    labelColor,
    isEditingProperty,
    isThemeAssignment,
    themeForSwatches,
    frameRef,
    onEditChange: setIsEditingProperty,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
  }

  const childItems: RowPropertyProps[] = children.map((subProperty) => ({
    property: subProperty,
    workspace,
    node,
    theme,
    allProperties,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
  }))

  return {
    listItemProps,
    onRowClick: handleRowClick,
    frameProps,
    rowStyleProp,
    valueCellProps,
    resetActions,
    labelColor,
    isExpanded,
    hasChildren,
    childItems,
  }
}
