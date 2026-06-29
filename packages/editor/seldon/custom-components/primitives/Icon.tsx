import type { ComponentIcon } from "@seldon/core/components/constants"
import {
  IconMaterialComputer,
  IconMaterialLaptop,
  IconMaterialSmartphone,
  IconMaterialTablet,
  IconMaterialTv,
  IconMaterialWatch,
} from "../../icons"
import {
  Icon as GeneratedIcon,
  IconProps as GeneratedIconProps,
} from "../../primitives/Icon"
import { IconCustomBooleanValue } from "../icons/Boolean"
import { IconCustomColorValue } from "../icons/Color"
import { IconCustomThemeColorValue } from "../icons/ThemeColor"

/**
 * Editor-only ids for prop-driven icons. The value icons render dynamic React
 * components from `custom-components/icons/`, not static catalog SVGs, so the
 * factory can never export them.
 *
 * The `icon-custom-device-*` ids back the board device-preset picker and render
 * exported material glyphs from `icons/`.
 */
type DynamicIconId =
  | "icon-custom-boolean-value"
  | "icon-custom-color-value"
  | "icon-custom-theme-color-value"
  | "icon-custom-device-mobile"
  | "icon-custom-device-tablet"
  | "icon-custom-device-laptop"
  | "icon-custom-device-desktop"
  | "icon-custom-device-tv"
  | "icon-custom-device-watch"

export type IconProps = Omit<GeneratedIconProps, "icon" | "color"> & {
  icon?: GeneratedIconProps["icon"] | ComponentIcon | DynamicIconId
  /** Fill color for the dynamic value-chip icons. */
  color?: string | null
  /** Checked state for the boolean value icon. */
  enabled?: boolean
}

/**
 * Thin wrapper over the generated `primitives/Icon`. Special-cases the
 * dynamic `icon-custom-*` ids and delegates every other id, including the
 * `ComponentIcon` ids used by the catalog panel, to the generated component.
 */
export function Icon({ icon, color, enabled, ...props }: IconProps) {
  switch (icon) {
    case "icon-custom-boolean-value":
      return <IconCustomBooleanValue enabled={enabled} {...props} />
    case "icon-custom-color-value":
      return <IconCustomColorValue color={color} {...props} />
    case "icon-custom-theme-color-value":
      return <IconCustomThemeColorValue color={color} {...props} />
    case "icon-custom-device-mobile":
      return <IconMaterialSmartphone {...props} />
    case "icon-custom-device-tablet":
      return <IconMaterialTablet {...props} />
    case "icon-custom-device-laptop":
      return <IconMaterialLaptop {...props} />
    case "icon-custom-device-desktop":
      return <IconMaterialComputer {...props} />
    case "icon-custom-device-tv":
      return <IconMaterialTv {...props} />
    case "icon-custom-device-watch":
      return <IconMaterialWatch {...props} />
    default:
      return (
        <GeneratedIcon
          icon={icon as GeneratedIconProps["icon"]}
          color={color ?? undefined}
          {...props}
        />
      )
  }
}
