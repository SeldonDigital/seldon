import type { ComponentType } from "react"
import {
  IconCustomBooleanValue,
  IconCustomColorValue,
  IconCustomThemeColorValue,
  ThemeSwatches,
} from "@seldon/components/custom-components"
import {
  IconMaterialComputer,
  IconMaterialLaptop,
  IconMaterialSmartphone,
  IconMaterialTablet,
  IconMaterialTv,
  IconMaterialWatch,
} from "@seldon/components/icons"
import {
  RegisteredIconProps,
  registerIcon,
} from "@seldon/components/utils/icon-registry"

/**
 * The generated `Icon` types its own props, while the registry stores props-open
 * components. This localizes the one cast at the registration boundary.
 */
function toRegistered<P>(
  component: ComponentType<P>,
): ComponentType<RegisteredIconProps> {
  return component as unknown as ComponentType<RegisteredIconProps>
}

/**
 * Registers the editor-only, prop-driven icons with the generated `Icon`'s
 * runtime registry. These `icon-custom-*` ids render dynamic React components,
 * not static catalog SVGs, so the factory cannot emit them. The generated
 * `Icon` consults the registry for any id missing from its static map, which
 * lets generated slots (such as the property value chip inside `ComboboxField`)
 * paint these dynamic icons.
 *
 * This mapping lives here, not in generated code, so re-exporting the component
 * layer never drops it. Call once at startup.
 */
export function registerDynamicIcons(): void {
  registerIcon("icon-custom-color-value", toRegistered(IconCustomColorValue))
  registerIcon(
    "icon-custom-boolean-value",
    toRegistered(IconCustomBooleanValue),
  )
  registerIcon(
    "icon-custom-theme-color-value",
    toRegistered(IconCustomThemeColorValue),
  )
  registerIcon("icon-custom-theme-swatches", toRegistered(ThemeSwatches))
  registerIcon("icon-custom-device-mobile", toRegistered(IconMaterialSmartphone))
  registerIcon("icon-custom-device-tablet", toRegistered(IconMaterialTablet))
  registerIcon("icon-custom-device-laptop", toRegistered(IconMaterialLaptop))
  registerIcon("icon-custom-device-desktop", toRegistered(IconMaterialComputer))
  registerIcon("icon-custom-device-tv", toRegistered(IconMaterialTv))
  registerIcon("icon-custom-device-watch", toRegistered(IconMaterialWatch))
}

// Register at module load, not only from an app entry call, so a hot reload of
// this file (which adds or changes ids) re-populates the persistent registry
// singleton instead of leaving it on a stale id set.
registerDynamicIcons()
