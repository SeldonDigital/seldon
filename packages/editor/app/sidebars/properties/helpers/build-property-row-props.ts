import { CSSProperties, MouseEvent } from "react"
import { IconProps } from "@seldon/components/primitives/Icon"
import { ICONIC_BUTTON_ATTR } from "../../helpers/iconic-button"
import { FlatProperty } from "./properties-data"
import {
  getDisclosureButtonStyle,
  getDisclosureIconStyle,
  getMenuButtonStyle,
  getMenuIconStyle,
  getNameLabelStyle,
  getValueIconStyle,
} from "./property-row-state-styles"
import {
  getPropertyIcon2Color,
  isMenuOrComboControl,
} from "./property-value-display"

const CHEVRON_ICON = "material-chevronRight" as const

/** Data attribute used to detect clicks on the value-cell frame control. */
const FRAME_REF_ATTR = "data-frame-ref"
const FRAME_REF_VALUE = "true"
export const FRAME_REF_SELECTOR = `[${FRAME_REF_ATTR}="${FRAME_REF_VALUE}"]`

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
  supportsUpload: boolean
  showMenuIcon: boolean
  /** Instance in a non-Normal state: render the value cell as read-only. */
  isReadOnly: boolean
  handleToggle: () => void
  handleUploadClick: (event: MouseEvent) => void
  handleMenuClick: (event: MouseEvent) => void
}

/**
 * Builds the prop objects passed to the generated `ItemProperty` for a
 * property row. Returns plain data only. Slot styles come from the
 * state-style functions in `property-row-state-styles.ts`.
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
  supportsUpload,
  showMenuIcon,
  isReadOnly,
  handleToggle,
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
  // Pass no label tint as the color fallback: a swatch-token or color-harmony
  // row keeps its real value color, every other row leaves the icon color to
  // the generated `.sdn-item-property` CSS so hover and state tints apply.
  const icon2 =
    valueIconHidden || isDynamicValueIcon
      ? null
      : {
          icon: valueIconId as IconProps["icon"],
          color: getPropertyIcon2Color(property, swatchChipColor, undefined),
          style: getValueIconStyle({ hidden: false, labelColor: undefined }),
        }

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

  // No inline color: the trailing menu chevron takes its color from the
  // generated `.sdn-item-property` CSS so it tints on hover and state like the
  // rest of the row, instead of a baked-in label tint that overrides them.
  const icon3 = {
    icon: (supportsUpload
      ? "material-upload"
      : "material-chevronDown") as IconProps["icon"],
    style: getMenuIconStyle({
      isCalculated,
      supportsUpload,
      hasControl: Boolean(property.controlType),
      // A read-only instance row hides the dropdown chevron.
      showMenuIcon: isReadOnly ? true : showMenuIcon,
      labelColor: undefined,
    }),
  }

  return {
    buttonIconic,
    icon,
    textLabel,
    icon2,
    buttonIconic2,
    icon3,
  }
}
