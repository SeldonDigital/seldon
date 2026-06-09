import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { usePropertyControlData } from "./hooks/use-property-control-data"
import { usePropertyFrameHover } from "./hooks/use-property-frame-hover"
import { useRowProperty } from "./hooks/use-row-property"
import { ListItemTreeInput } from "@seldon/components/elements/ListItemTreeInput"
import { useImageUploadPanel } from "../../panels/hooks/use-upload-image-panel"
import { MenuEntry } from "@lib/menus"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowActionsMenu } from "../shared/RowActionsMenu"
import { PropertyValueCell } from "./PropertyValueCell"
import { getDisplayValue } from "./helpers/display-value-utils"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "./helpers/theme-token-icon-color"
import { FlatProperty } from "./helpers/properties-data"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { buildPropertyOptions } from "./helpers/build-property-options"
import {
  buildPropertyRowProps,
  FRAME_REF_ATTR,
  FRAME_REF_SELECTOR,
  FRAME_REF_VALUE,
} from "./helpers/build-property-row-props"
import {
  isNumericPropertyValue,
  stripDisplayUnitSuffix,
} from "./helpers/property-value-display"
import { getPropertyRegistryEntry } from "./helpers/properties-registry"
import {
  getPropertyLabelStyle,
  getPropertyRowStyle,
} from "./helpers/property-styling-tokens"

interface RowPropertyProps {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  allProperties: FlatProperty[]
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

export function RowProperty({
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
  const frameRef = useRef<HTMLDivElement>(null)
  const [isEditingProperty, setIsEditingProperty] = useState(false)

  const {
    isExpanded,
    hasChildren,
    label: labelText,
    iconId,
    canReset,
    handleToggle,
    handleReset,
    children,
  } = useRowProperty({
    property,
    workspace,
    node,
    theme,
    allProperties,
  })

  const { getPropertyValueForDisplay, getUnit, shouldShowMenuIcon } =
    usePropertyControlData({ property, theme })

  const propertyValue = getPropertyValueForDisplay()
  const isThemeAssignment = property.pickerVariant === "themeAssignment"
  const themes = useThemes()

  const themeForSwatches = useMemo(() => {
    if (!isThemeAssignment) return null
    const displayThemeId = workspaceThemeService.getObjectThemeId(node, workspace)
    return themes.find((t) => t.id === displayThemeId) ?? null
  }, [isThemeAssignment, node, workspace, themes])

  // Get options for theme value matching (UI optimization)
  const options = useMemo(
    () => buildPropertyOptions({ property, theme, workspace, subject: node }),
    [property, theme, node, workspace],
  )

  const nodeId = isBoard(node) ? getComponentKey(node) : node.id

  // Use getDisplayValue for consistent capitalization
  let value = getDisplayValue(
    propertyValue,
    property.key,
    nodeId,
    workspace,
    theme,
    options,
  )

  const unit = getUnit()
  const isNumericValue = useMemo(
    () => isNumericPropertyValue(property),
    [property],
  )

  // Strip the unit suffix from the display value when a separate unit label is
  // shown, avoiding redundant output like "10px PX".
  value = stripDisplayUnitSuffix(value, unit, isNumericValue)

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

  // Hover effect for Frame component
  const rowColor = rowStyle.color as string | undefined
  const { setIsHovered, style: hoverStyle } = usePropertyFrameHover(rowColor)

  const handleFrameMouseEnter = () => {
    // Don't enable hover for dimmed (read-only) properties
    if (!property.isDimmed) {
      setIsHovered(true)
    }
  }
  const handleFrameMouseLeave = () => setIsHovered(false)

  // Reset hover state when clicking outside the frame
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

    // Don't stop propagation - allow row click to handle toggling
    // Only enter edit mode when clicking on the actual PropertyControl input area
    const inputElement = target.closest("input, textarea, select")
    if (!inputElement) {
      // If not clicking on an input, let the row click handle it
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
    // Don't toggle if clicking on buttons or when editing
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

    // Don't toggle if clicking on the frame control (PropertyControl)
    if (target.closest(FRAME_REF_SELECTOR)) {
      return
    }

    handleToggle()
  }

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

  const { show: showUploadPanel } = useImageUploadPanel()

  // Check if property supports upload (combo control + IconImageValue icon)
  const registryEntry = getPropertyRegistryEntry(property.key)
  const supportsUpload =
    registryEntry?.control === "combo" &&
    registryEntry?.icon === "IconImageValue"

  const handleUploadClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (supportsUpload) {
        // Convert property key to upload panel format:
        // - Sub-properties (with dots): replace dots with hyphens (e.g., "background.image" -> "background-image")
        // - Top-level properties: use as-is (e.g., "source" -> "source")
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

  const valueCell = (
    <PropertyValueCell
      property={property}
      value={value}
      node={node}
      theme={theme}
      labelColor={labelColor}
      isEditingProperty={isEditingProperty}
      isThemeAssignment={isThemeAssignment}
      themeForSwatches={themeForSwatches}
      frameRef={frameRef}
      onEditChange={setIsEditingProperty}
      themeEditingContext={themeEditingContext}
      fontCollectionEditingContext={fontCollectionEditingContext}
      iconSetEditingContext={iconSetEditingContext}
    />
  )

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
    label2Children: valueCell,
    handleToggle,
    handleLabel2Click,
    handleUploadClick,
    handleMenuClick,
  })

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

  const actionsSlot = (
    <RowActionsMenu
      items={resetActions}
      color={labelColor as string | undefined}
    />
  )

  const childRows = children.map((subProperty) => (
    <RowProperty
      key={subProperty.key}
      property={subProperty}
      workspace={workspace}
      node={node}
      theme={theme}
      allProperties={allProperties}
      themeEditingContext={themeEditingContext}
      fontCollectionEditingContext={fontCollectionEditingContext}
      iconSetEditingContext={iconSetEditingContext}
    />
  ))

  const childrenSection = hasChildren ? (
    <FramerExpandable isExpanded={isExpanded}>{childRows}</FramerExpandable>
  ) : null

  return (
    <>
      <ListItemTreeInput
        {...listItemProps}
        onClick={handleRowClick}
        actionsSlot={actionsSlot}
        frame={frameProps}
        style={rowStyleProp}
      />
      {childrenSection}
    </>
  )
}
