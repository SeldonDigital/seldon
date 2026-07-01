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
  /** Swatch cluster colors for the theme-assignment row's value strip. */
  themeSwatchColors: string[] | undefined
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
  themeSwatchColors,
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

  // The name slot is an `Input` (driven by the rename-in-place hook), so the row
  // contributes only its resting style; the value and edit state come from the
  // hook. Mirrors how object-name rows feed `useRenameInput`.
  const nameLabelStyle = getNameLabelStyle({ labelStyle, hasChildren })

  const valueIconStyle = getValueIconStyle({
    hidden: false,
    labelColor: undefined,
  })

  // Look-parent grouping rows (theme look groups, computed groups) own no value,
  // so they show no value icon.
  //
  // The theme-assignment row paints the assigned theme's swatch cluster, the
  // same strip its menu options show. A row that resolves to an actual color (a
  // swatch token chip, a swatch definition, or a color-harmony point) paints a
  // color circle. Both are dynamic ids the factory cannot emit as static SVGs;
  // the generated `Icon` renders them from the runtime icon registry (see
  // `lib/icons`). Every other row keeps its static property icon and leaves the
  // tint to the generated `.sdn-item-property` CSS so hover and state apply.
  const chipColor = getPropertyIcon2Color(property, swatchChipColor, undefined)

  let icon2: Record<string, unknown> | null
  if (property.isLookParent) {
    icon2 = null
  } else if (isThemeAssignment) {
    icon2 = themeSwatchColors?.length
      ? {
          icon: "icon-custom-theme-swatches",
          colors: themeSwatchColors,
          style: valueIconStyle,
        }
      : null
  } else if (chipColor) {
    icon2 = {
      icon: "icon-custom-color-value",
      color: chipColor,
      style: valueIconStyle,
    }
  } else {
    icon2 = {
      icon: iconId,
      style: valueIconStyle,
    }
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
    nameLabelStyle,
    icon2,
    buttonIconic2,
    icon3,
  }
}
