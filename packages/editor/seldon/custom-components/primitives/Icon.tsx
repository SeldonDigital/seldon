import type { ComponentIcon } from "@seldon/core/components/constants"
import {
  IconCustomBooleanValue,
  IconCustomColorValue,
  IconCustomDeviceDesktop,
  IconCustomDeviceLaptop,
  IconCustomDeviceMobile,
  IconCustomDeviceTablet,
  IconCustomDeviceTv,
  IconCustomDeviceWatch,
  IconCustomThemeColorValue,
} from "../../custom-icons"
import {
  Icon as GeneratedIcon,
  IconProps as GeneratedIconProps,
} from "../../primitives/Icon"

/**
 * Editor-only ids for prop-driven icons. These render dynamic React
 * components, not static catalog SVGs, so the factory can never export them.
 *
 * The `icon-custom-device-*` ids back the board device-preset picker. Their
 * glyphs live in `custom-icons/` so they stay editor-local and survive icon
 * catalog changes in `@seldon/core`.
 */
export type DynamicIconId =
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
      return <IconCustomDeviceMobile {...props} />
    case "icon-custom-device-tablet":
      return <IconCustomDeviceTablet {...props} />
    case "icon-custom-device-laptop":
      return <IconCustomDeviceLaptop {...props} />
    case "icon-custom-device-desktop":
      return <IconCustomDeviceDesktop {...props} />
    case "icon-custom-device-tv":
      return <IconCustomDeviceTv {...props} />
    case "icon-custom-device-watch":
      return <IconCustomDeviceWatch {...props} />
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
