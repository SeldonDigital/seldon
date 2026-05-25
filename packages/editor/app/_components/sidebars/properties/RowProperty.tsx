import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Board,
  Instance,
  Theme,
  ValueType,
  Variant,
  Workspace,
} from "@seldon/core"
import { isAtomicValue } from "@seldon/core/helpers/type-guards/value/is-atomic-value"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { usePropertyControlData } from "./hooks/use-property-control-data"
import { usePropertyFrameHover } from "./hooks/use-property-frame-hover"
import { useRowProperty } from "./hooks/use-row-property"
import { ListItemTreeInput } from "../../../seldon/elements/ListItemTreeInput"
import { IconProps } from "../../../seldon/primitives/Icon"
import { LabelProps } from "../../../seldon/primitives/Label"
import { useImageUploadPanel } from "@components/floating-panels/image-upload-panel/use-upload-image-panel"
import { FramerExpandable } from "../shared/FramerExpandable"
import { PropertyControl } from "./PropertyControl"
import { getDisplayValue } from "./helpers/display-value-utils"
import { generatePropertyOptions } from "./helpers/options-utils"
import {
  FlatProperty,
} from "./helpers/properties-data"
import { getPropertyRegistryEntry } from "./helpers/properties-registry"
import {
  getPropertyLabelStyle,
  getPropertyRowStyle,
} from "./helpers/property-styling-tokens"

const TOGGLE_BUTTON_CLASS = "sdn-button-iconic sdn-button-iconic--0urv"
const CHEVRON_ICON = "material-chevronRight" as const
const RESET_ICON = "seldon-reset" as const
const EDIT_ICON = "icon-custom-edit" as const

interface ThemeEditingContext {
  isThemeEditing: true
  updateThemeProperty: (property: FlatProperty, newValue: string) => void
  themeProperties: FlatProperty[]
}

interface RowPropertyProps {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  allProperties: FlatProperty[]
  themeEditingContext?: ThemeEditingContext | null
}

export function RowProperty({
  property,
  workspace,
  node,
  theme,
  allProperties,
  themeEditingContext,
}: RowPropertyProps) {
  const { debugModeEnabled } = useDebugMode()
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

  // Get options for theme value matching (UI optimization)
  const options = useMemo(() => {
    if (
      !property.controlType ||
      (property.controlType !== "combo" && property.controlType !== "menu")
    ) {
      return undefined
    }

    const componentId = isComponentEntry(node)
      ? getComponentKey(node)
      : (getNodeCatalogComponentId(node, workspace) ?? "")
    const componentLevel = isComponentEntry(node) ? undefined : node.level

    const result = generatePropertyOptions(
      property,
      theme,
      componentId,
      componentLevel,
      workspace,
      node,
    )

    return result.options
  }, [property, theme, node, workspace])

  // Use getDisplayValue for consistent capitalization
  let value = getDisplayValue(
    propertyValue,
    property.key,
    node.id,
    workspace,
    theme,
    options,
  )

  const unit = getUnit()

  const isNumericValue = useMemo(() => {
    if (
      !property.value ||
      typeof property.value !== "object" ||
      property.value === null
    ) {
      return false
    }
    if (
      !isAtomicValue(property.value) ||
      property.value.type !== ValueType.EXACT
    ) {
      return false
    }
    if (typeof property.value.value === "number") {
      return true
    }
    if (
      typeof property.value.value === "object" &&
      property.value.value !== null &&
      "unit" in property.value.value &&
      typeof property.value.value.value === "number"
    ) {
      return true
    }
    return false
  }, [property.value])

  // Strip unit suffix from display value when unit label is shown
  // This prevents redundant display like "10px PX" when the label already shows the unit
  if (unit && isNumericValue && value) {
    const unitsToStrip = ["px", "rem", "%", "deg"]
    for (const unitSuffix of unitsToStrip) {
      if (value.toLowerCase().endsWith(unitSuffix)) {
        value = value.slice(0, -unitSuffix.length).trim()
        break
      }
    }
  }

  const rowStyle = useMemo(
    () => (theme ? getPropertyRowStyle(theme, property, debugModeEnabled) : {}),
    [theme, property, debugModeEnabled],
  )
  const labelStyle = useMemo(
    () =>
      theme ? getPropertyLabelStyle(theme, property, debugModeEnabled) : {},
    [theme, property, debugModeEnabled],
  )

  const labelColor = labelStyle.color

  // Check if this is a custom theme property
  const isCustomTheme = useMemo(() => {
    return (
      property.key === "theme" &&
      property.value &&
      typeof property.value === "object" &&
      property.value !== null &&
      "type" in property.value &&
      "value" in property.value &&
      property.value.type === ValueType.EXACT &&
      typeof property.value.value === "string" &&
      property.value.value === "custom"
    )
  }, [property.controlType, property.value])

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
    if (target.closest('[data-frame-ref="true"]')) {
      return
    }

    handleToggle()
  }

  const handleResetClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      handleReset()
    },
    [handleReset],
  )

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

  // Build ListItemTreeInput props
  const listItemProps = useMemo(() => {
    const iconStyle = (opacity?: number) => ({
      ...(labelColor ? { color: labelColor } : {}),
      ...(opacity !== undefined ? { opacity } : {}),
    })

    return {
      buttonIconic: {
        onClick: handleToggle,
        "aria-expanded": isExpanded,
        "aria-label": isExpanded ? "Collapse" : "Expand",
        className: TOGGLE_BUTTON_CLASS,
        style: {
          position: "relative" as const,
          zIndex: 10,
        },
      },
      icon: {
        icon: CHEVRON_ICON,
        style: {
          transition: "transform 0.2s ease",
          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
          ...iconStyle(hasChildren ? 1 : 0),
        },
      },

      label: {
        children: labelText,
        htmlElement: "label" as const,
        style: {
          ...labelStyle,
          cursor: hasChildren ? "pointer" : "default",
          userSelect: "none" as const,
          WebkitUserSelect: "none" as const,
        },
      },

      buttonIconic2: {
        style: { pointerEvents: "none" as const },
      },
      icon2: {
        icon: iconId as IconProps["icon"],
              // For swatch properties and color point properties, use the HSL color string
              // For swatches: use actualValue (HSL string)
              // For baseColor and color points: use iconColorValue stored in property (these already incorporate bleed)
              // For other properties: use labelColor for icon tinting
              color: (() => {
                if (property.key.startsWith("swatch.") && property.actualValue) {
                  return property.actualValue as string
                }
                // Check for baseColor and color point properties (whitePoint, grayPoint, blackPoint)
                // These use computed swatch colors which already incorporate bleed
                if ((property.key === "color.baseColor" ||
                     property.key === "color.whitePoint" || 
                     property.key === "color.grayPoint" || 
                     property.key === "color.blackPoint") &&
                    (property as any).iconColorValue) {
                  return (property as any).iconColorValue as string
                }
                return labelColor || undefined
              })(),
              style: iconStyle(),
            },

      label2: {
        children: (() => {
          const shouldShowControl = Boolean(property.controlType)

          return isEditingProperty && shouldShowControl ? (
            <PropertyControl
              property={property}
              propertySubject={node}
              theme={theme}
              frameRef={frameRef}
              isEditing={isEditingProperty}
              onEditChange={setIsEditingProperty}
              onBlur={() => setIsEditingProperty(false)}
              color={labelColor}
              themeEditingContext={themeEditingContext}
            />
          ) : (
            (value ?? "")
          )
        })(),
        htmlElement: "label" as const,
        onClick: handleLabel2Click,
        style: {
          flex: 1,
          flexShrink: 1,
          width: 0,
          ...(labelColor && !isEditingProperty ? { color: labelColor } : {}),
          cursor: hasChildren
            ? "pointer"
            : property.controlType
              ? "pointer"
              : "default",
          pointerEvents: "auto",
          display: "block",
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          userSelect: "none",
          WebkitUserSelect: "none",
        },
      } as LabelProps,

      label3:
        // Don't show units for combo/menu controls (they have their own dropdowns)
        unit && isNumericValue && property.controlType !== "combo" && property.controlType !== "menu"
          ? {
              children: unit,
              htmlElement: "label" as const,
              style: {
                alignSelf: "center" as const,
                ...(labelColor ? { color: labelColor } : {}),
              },
            }
          : {
              children: "",
              htmlElement: "label" as const,
              style: {
                alignSelf: "center" as const,
              },
            },

      buttonIconic3: {
        onClick: supportsUpload ? handleUploadClick : undefined,
        style: supportsUpload
          ? { pointerEvents: "auto" as const }
          : property.key.startsWith("calculated.")
            ? { display: "none" as const }
            : { pointerEvents: "none" as const },
        "aria-label": supportsUpload ? "Upload image" : undefined,
        className: supportsUpload ? TOGGLE_BUTTON_CLASS : undefined,
      },
      icon3: {
        icon: supportsUpload
          ? ("material-upload" as IconProps["icon"])
          : ("material-chevronDown" as IconProps["icon"]),
        color: labelColor || undefined,
        style: iconStyle(
          property.key.startsWith("calculated.")
            ? 0 // Hide chevron for calculated properties
            : supportsUpload
              ? 1 // Always show upload icon for image properties
              : shouldShowMenuIcon()
                ? 0
                : 1,
        ),
      },

      buttonIconic4: {
        onClick: handleResetClick,
        "aria-label": isCustomTheme ? "Edit theme" : "Reset property",
        className: TOGGLE_BUTTON_CLASS,
      },
      icon4: {
        icon: isCustomTheme ? EDIT_ICON : RESET_ICON,
        style: iconStyle(isCustomTheme || canReset ? 1 : 0),
      },
    }
  }, [
    handleToggle,
    isExpanded,
    hasChildren,
    labelText,
    labelStyle,
    labelColor,
    iconId,
    value,
    unit,
    isNumericValue,
    handleResetClick,
    canReset,
    isCustomTheme,
    isEditingProperty,
    property,
    theme,
    frameRef,
    shouldShowMenuIcon,
    handleLabel2Click,
    handleUploadClick,
    supportsUpload,
    themeEditingContext,
  ])

  return (
    <>
      <ListItemTreeInput
        {...listItemProps}
        onClick={handleRowClick}
        frame={
          {
            "data-frame-ref": "true",
            ref: (el: HTMLDivElement | null) => {
              if (el) {
                frameRef.current = el
              }
            },
            onClick: (e) => {
              const frameElement = e.currentTarget as HTMLDivElement
              if (frameElement && frameElement !== frameRef.current) {
                frameRef.current = frameElement
              }
              handleFrameClick(e)
            },
            onMouseEnter: handleFrameMouseEnter,
            onMouseLeave: handleFrameMouseLeave,
            style: {
              width: "100%",
              position: "relative",
              cursor: hasChildren
                ? "pointer"
                : property.controlType
                  ? "pointer"
                  : "default",
              userSelect: "none",
              WebkitUserSelect: "none",
              ...hoverStyle,
            },
          } as React.HTMLAttributes<HTMLDivElement> & {
            ref?: (el: HTMLDivElement | null) => void
          }
        }
        style={{
          ...rowStyle,
          width: "100%",
          justifyContent: "flex-start",
          cursor: hasChildren ? "pointer" : "default",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      />
      {hasChildren && (
        <FramerExpandable isExpanded={isExpanded}>
          {children.map((subProperty) => (
            <RowProperty
              key={subProperty.key}
              property={subProperty}
              workspace={workspace}
              node={node}
              theme={theme}
              allProperties={allProperties}
              themeEditingContext={themeEditingContext}
            />
          ))}
        </FramerExpandable>
      )}
    </>
  )
}
