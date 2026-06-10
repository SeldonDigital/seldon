import { CSSProperties, MouseEvent } from "react"
import { IconProps } from "@seldon/components/primitives/Icon"
import { LabelProps } from "@seldon/components/primitives/Label"
import { FlatProperty } from "./properties-data"
import {
  getPropertyIcon2Color,
  isMenuOrComboControl,
} from "./property-value-display"

const TOGGLE_BUTTON_CLASS = "sdn-button-iconic sdn-button-iconic--0urv"
const CHEVRON_ICON = "material-chevronRight" as const

/** Data attribute used to detect clicks on the value-cell frame control. */
export const FRAME_REF_ATTR = "data-frame-ref"
export const FRAME_REF_VALUE = "true"
export const FRAME_REF_SELECTOR = `[${FRAME_REF_ATTR}="${FRAME_REF_VALUE}"]`

function buildIconStyle(
  labelColor: string | undefined,
  opacity?: number,
): CSSProperties {
  return {
    ...(labelColor ? { color: labelColor } : {}),
    ...(opacity !== undefined ? { opacity } : {}),
  }
}

interface BuildPropertyRowPropsInput {
  property: FlatProperty
  isExpanded: boolean
  hasChildren: boolean
  labelText: string
  labelStyle: CSSProperties
  labelColor: string | undefined
  iconId: string
  isThemeAssignment: boolean
  swatchChipColor: string | undefined
  unit: string | undefined
  isNumericValue: boolean
  isEditingProperty: boolean
  supportsUpload: boolean
  showMenuIcon: boolean
  handleToggle: () => void
  handleLabel2Click: (event: MouseEvent) => void
  handleUploadClick: (event: MouseEvent) => void
  handleMenuClick: (event: MouseEvent) => void
}

/**
 * Builds the prop objects passed to `ListItemTreeInput` for a property row.
 * Returns plain data only. The shell injects the value-cell node into
 * `label2.children`, so this stays free of JSX.
 */
export function buildPropertyRowProps({
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
  showMenuIcon,
  handleToggle,
  handleLabel2Click,
  handleUploadClick,
  handleMenuClick,
}: BuildPropertyRowPropsInput) {
  const isMenuOrCombo = isMenuOrComboControl(property)
  const isCalculated = property.key.startsWith("calculated.")
  const showUploadOrMenu = supportsUpload || isMenuOrCombo

  const buttonIconic = {
    onClick: handleToggle,
    "aria-expanded": isExpanded,
    "aria-label": isExpanded ? "Collapse" : "Expand",
    className: TOGGLE_BUTTON_CLASS,
    style: {
      position: "relative" as const,
      zIndex: 10,
    },
  }

  const icon = {
    icon: CHEVRON_ICON,
    style: {
      transition: "transform 0.2s ease",
      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
      ...buildIconStyle(labelColor, hasChildren ? 1 : 0),
    },
  }

  const label = {
    children: labelText,
    htmlElement: "label" as const,
    style: {
      ...labelStyle,
      cursor: hasChildren ? "pointer" : "default",
      userSelect: "none" as const,
      WebkitUserSelect: "none" as const,
    },
  }

  const buttonIconic2 = isThemeAssignment
    ? { style: { display: "none" as const, pointerEvents: "none" as const } }
    : { style: { pointerEvents: "none" as const } }

  const icon2 =
    isThemeAssignment || property.isLookParent
      ? {
          icon: iconId as IconProps["icon"],
          style: { display: "none" as const },
        }
      : {
          icon: (swatchChipColor
            ? "icon-custom-color-value"
            : iconId) as IconProps["icon"],
          color: getPropertyIcon2Color(property, swatchChipColor, labelColor),
          style: buildIconStyle(labelColor),
        }

  const label2 = {
    htmlElement: "label" as const,
    onClick: handleLabel2Click,
    style: {
      flex: 1,
      flexShrink: 1,
      width: 0,
      ...(labelColor && !isEditingProperty ? { color: labelColor } : {}),
      cursor: hasChildren || property.controlType ? "pointer" : "default",
      pointerEvents: "auto",
      display: "block",
      minWidth: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      userSelect: "none",
      WebkitUserSelect: "none",
    },
  } as LabelProps

  // Show the unit whenever the active value is an exact numeric value, including
  // picker controls that hold a literal dimension (a margin set to 24px renders
  // as "24" with a "PX" label).
  const showUnit = Boolean(unit && isNumericValue)
  const label3 = {
    children: showUnit ? unit : "",
    htmlElement: "label" as const,
    style: {
      alignSelf: "center" as const,
      ...(showUnit && labelColor ? { color: labelColor } : {}),
    },
  }

  const buttonIconic3 = {
    onClick: supportsUpload
      ? handleUploadClick
      : isMenuOrCombo
        ? handleMenuClick
        : undefined,
    style: supportsUpload
      ? { pointerEvents: "auto" as const }
      : isCalculated
        ? { display: "none" as const }
        : isMenuOrCombo
          ? { pointerEvents: "auto" as const }
          : { pointerEvents: "none" as const },
    "aria-label": supportsUpload
      ? "Upload image"
      : isMenuOrCombo
        ? "Open menu"
        : undefined,
    className: showUploadOrMenu ? TOGGLE_BUTTON_CLASS : undefined,
  }

  const icon3 = {
    icon: (supportsUpload
      ? "material-upload"
      : "material-chevronDown") as IconProps["icon"],
    color: labelColor || undefined,
    style: buildIconStyle(labelColor, resolveIcon3Opacity()),
  }

  function resolveIcon3Opacity(): number {
    if (isCalculated) return 0 // Hide chevron for calculated properties
    if (supportsUpload) return 1 // Always show upload icon for image properties
    if (!property.controlType) return 0 // Read-only rows with no control
    return showMenuIcon ? 0 : 1
  }

  return {
    buttonIconic,
    icon,
    label,
    buttonIconic2,
    icon2,
    label2,
    label3,
    buttonIconic3,
    icon3,
  }
}
