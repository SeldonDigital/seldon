import { ICONIC_BUTTON_ATTR } from "@seldon/editor/lib/menus/iconic-button"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import {
  getPropertyIcon2Color,
  isMenuOrComboControl,
} from "@seldon/editor/lib/properties/inspector/property-value-display"
import type { CSSProperties } from "vue"

import {
  getDisclosureButtonStyle,
  getDisclosureIconStyle,
  getMenuButtonStyle,
  getMenuIconStyle,
  getNameLabelStyle,
  getValueIconStyle,
} from "./property-row-state-styles"

const CHEVRON_ICON = "material-chevronRight"

/** Data attribute used to detect clicks on the value-cell frame control. */
const FRAME_REF_ATTR = "data-frame-ref"
const FRAME_REF_VALUE = "true"
export const FRAME_REF_SELECTOR = `[${FRAME_REF_ATTR}="${FRAME_REF_VALUE}"]`

interface BuildPropertyRowPropsInput {
  property: FlatProperty
  isExpanded: boolean
  hasChildren: boolean
  labelColor: string | undefined
  iconId: string
  isThemeAssignment: boolean
  themeSwatchColors: string[] | undefined
  swatchChipColor: string | undefined
  supportsUpload: boolean
  showMenuIcon: boolean
  isReadOnly: boolean
  handleToggle: (event: MouseEvent) => void
  handleUploadClick: (event: MouseEvent) => void
  handleMenuClick: (event: MouseEvent) => void
}

export interface PropertyRowSlots {
  buttonIconic: Record<string, unknown>
  icon: Record<string, unknown>
  nameLabelStyle: CSSProperties
  icon2: Record<string, unknown> | null
  buttonIconic2: Record<string, unknown>
  icon3: Record<string, unknown>
}

/**
 * Builds the slot-prop objects passed to the generated `ItemProperty` for a
 * property row. Returns plain data only; slot styles come from
 * `property-row-state-styles`. Ported from the React `buildPropertyRowProps`.
 */
export function buildPropertyRowProps({
  property,
  isExpanded,
  hasChildren,
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
}: BuildPropertyRowPropsInput): PropertyRowSlots {
  const isMenuOrCombo = isMenuOrComboControl(property)
  const isCalculated = property.key.startsWith("calculated.")

  const buttonIconic: Record<string, unknown> = {
    onClick: handleToggle,
    [ICONIC_BUTTON_ATTR]: true,
    style: getDisclosureButtonStyle(),
    ...(hasChildren
      ? {
          "aria-expanded": isExpanded,
          "aria-label": isExpanded ? "Collapse" : "Expand",
        }
      : { tabindex: -1, inert: true }),
  }

  const icon: Record<string, unknown> = {
    icon: CHEVRON_ICON,
    style: getDisclosureIconStyle({ isExpanded, hasChildren, labelColor }),
  }

  const nameLabelStyle = getNameLabelStyle({
    labelColor,
    isDimmed: Boolean(property.isDimmed),
    hasChildren,
  })

  const valueIconStyle = getValueIconStyle({
    hidden: false,
    labelColor: undefined,
  })

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
    icon2 = { icon: iconId, style: valueIconStyle }
  }

  const isMenuButtonInteractive = supportsUpload || isMenuOrCombo
  const buttonIconic2: Record<string, unknown> = {
    onClick: supportsUpload
      ? handleUploadClick
      : isMenuOrCombo
        ? handleMenuClick
        : undefined,
    [ICONIC_BUTTON_ATTR]: true,
    style: getMenuButtonStyle({ supportsUpload, isCalculated, isMenuOrCombo }),
    ...(isMenuButtonInteractive
      ? { "aria-label": supportsUpload ? "Upload image" : "Open menu" }
      : { tabindex: -1, inert: true }),
  }

  const icon3: Record<string, unknown> = {
    icon: supportsUpload ? "material-upload" : "material-chevronDown",
    style: getMenuIconStyle({
      isCalculated,
      supportsUpload,
      hasControl: Boolean(property.controlType),
      showMenuIcon: isReadOnly ? true : showMenuIcon,
      labelColor: undefined,
    }),
  }

  return { buttonIconic, icon, nameLabelStyle, icon2, buttonIconic2, icon3 }
}
