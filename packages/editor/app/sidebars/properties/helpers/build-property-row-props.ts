import { CSSProperties, MouseEvent } from "react"
import { Unit } from "@seldon/core"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import {
  ICONIC_BUTTON_ATTR,
  ICONIC_BUTTON_SELECTOR,
} from "../../helpers/iconic-button"
import { FlatProperty } from "./properties-data"
import {
  getDisclosureButtonStyle,
  getDisclosureIconStyle,
  getMenuButtonStyle,
  getMenuIconStyle,
  getNameLabelStyle,
  getValueCellStyle,
  getValueIconStyle,
} from "./property-row-state-styles"
import {
  getPropertyIcon2Color,
  isMenuOrComboControl,
} from "./property-value-display"

const CHEVRON_ICON = "material-chevronRight" as const

/** Data attribute used to detect clicks on the value-cell frame control. */
export const FRAME_REF_ATTR = "data-frame-ref"
export const FRAME_REF_VALUE = "true"
export const FRAME_REF_SELECTOR = `[${FRAME_REF_ATTR}="${FRAME_REF_VALUE}"]`

export { ICONIC_BUTTON_ATTR, ICONIC_BUTTON_SELECTOR }

/**
 * Dynamic value-chip data rendered inside the value cell. Dynamic
 * `icon-custom-*` icons cannot render through the generated row's icon slot,
 * so the cell draws the chip itself.
 */
export interface ValueChip {
  color: string | undefined
  style: CSSProperties
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
  /** Instance in a non-Normal state: render the value cell as read-only. */
  isReadOnly: boolean
  handleToggle: () => void
  handleLabel2Click: (event: MouseEvent) => void
  handleUploadClick: (event: MouseEvent) => void
  handleMenuClick: (event: MouseEvent) => void
}

/**
 * Builds the prop objects passed to the generated `ItemInputRow` for a
 * property row. Returns plain data only. Slot styles come from the
 * state-style functions in `property-row-state-styles.ts`. The shell injects
 * the value-cell node into `textLabel2.children`, so this stays free of JSX.
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
  isReadOnly,
  handleToggle,
  handleLabel2Click,
  handleUploadClick,
  handleMenuClick,
}: BuildPropertyRowPropsInput) {
  const isMenuOrCombo = isMenuOrComboControl(property)
  const isCalculated = property.key.startsWith("calculated.")

  // Leaf rows keep the disclosure slot for layout but render nothing in it (the
  // chevron sits at opacity 0). Mark it inert so the browser skips it for focus
  // and tab order; parent rows stay interactive.
  const buttonIconic = {
    onClick: handleToggle,
    [ICONIC_BUTTON_ATTR]: true,
    style: getDisclosureButtonStyle(),
    ...(hasChildren
      ? {
          "aria-expanded": isExpanded,
          "aria-label": isExpanded ? "Collapse" : "Expand",
        }
      : { tabIndex: -1, inert: true }),
  }

  const icon = {
    icon: CHEVRON_ICON,
    style: getDisclosureIconStyle({ isExpanded, hasChildren, labelColor }),
  }

  const textLabel = {
    children: labelText,
    htmlElement: "label" as const,
    style: getNameLabelStyle({ labelStyle, hasChildren }),
  }

  const valueIconHidden = isThemeAssignment || Boolean(property.isLookParent)
  const valueIconId =
    valueIconHidden || !swatchChipColor ? iconId : "icon-custom-color-value"
  const isDynamicValueIcon = valueIconId.startsWith("icon-custom-")

  // Static value icons render through the generated icon slot. Dynamic chips
  // render inside the value cell, so the slot is suppressed for them.
  const icon2 =
    valueIconHidden || isDynamicValueIcon
      ? null
      : {
          icon: valueIconId as IconProps["icon"],
          color: getPropertyIcon2Color(property, swatchChipColor, labelColor),
          style: getValueIconStyle({ hidden: false, labelColor }),
        }

  const valueChip: ValueChip | null =
    !valueIconHidden && isDynamicValueIcon
      ? {
          color: getPropertyIcon2Color(property, swatchChipColor, labelColor),
          style: getValueIconStyle({ hidden: false, labelColor }),
        }
      : null

  const textLabel2 = {
    htmlElement: "label" as const,
    onClick: handleLabel2Click,
    style: getValueCellStyle({
      labelColor,
      isEditingProperty,
      isInteractive:
        !isReadOnly && (hasChildren || Boolean(property.controlType)),
    }),
  } as TextLabelProps

  // Show the unit whenever the active value is an exact numeric value, including
  // picker controls that hold a literal dimension (a margin set to 24px renders
  // as "24" with a "PX" label). Unitless counts (grid columns, spans) carry the
  // NUMBER unit internally but should render without a unit chip.
  const showUnit = Boolean(unit && isNumericValue && unit !== Unit.NUMBER)
  const unitLabel = showUnit ? unit : undefined

  // The trailing button is interactive only for uploads and menu/combo controls.
  // Otherwise it has no visible icon, so render it inert to keep it out of focus
  // and tab order.
  const isMenuButtonInteractive = supportsUpload || isMenuOrCombo
  const buttonIconic2 = {
    onClick: supportsUpload
      ? handleUploadClick
      : isMenuOrCombo
        ? handleMenuClick
        : undefined,
    [ICONIC_BUTTON_ATTR]: true,
    style: getMenuButtonStyle({ supportsUpload, isCalculated, isMenuOrCombo }),
    ...(isMenuButtonInteractive
      ? { "aria-label": supportsUpload ? "Upload image" : "Open menu" }
      : { tabIndex: -1, inert: true }),
  }

  const icon3 = {
    icon: (supportsUpload
      ? "material-upload"
      : "material-chevronDown") as IconProps["icon"],
    color: labelColor || undefined,
    style: getMenuIconStyle({
      isCalculated,
      supportsUpload,
      hasControl: Boolean(property.controlType),
      // A read-only instance row hides the dropdown chevron.
      showMenuIcon: isReadOnly ? true : showMenuIcon,
      labelColor,
    }),
  }

  return {
    buttonIconic,
    icon,
    textLabel,
    icon2,
    valueChip,
    textLabel2,
    unitLabel,
    buttonIconic2,
    icon3,
  }
}
