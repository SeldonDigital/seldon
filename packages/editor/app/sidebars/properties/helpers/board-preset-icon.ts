import { DynamicIconId } from "@seldon/components/custom-components"

/** Icon id the board preset picker renders for a preset value. */
export type BoardPresetIconId = DynamicIconId | "seldon-align"

/**
 * Device icon per board device preset id. Preset ids come from
 * `BOARD_DEVICE_PRESETS`. OS variants share a device icon. These are
 * editor-local `icon-custom-device-*` ids, not `@seldon/core` catalog ids, so
 * the picker stays decoupled from the shipped icon set.
 */
const BOARD_DEVICE_PRESET_ICONS: Record<string, DynamicIconId> = {
  iphone: "icon-custom-device-mobile",
  androidPhone: "icon-custom-device-mobile",
  ipad: "icon-custom-device-tablet",
  androidTablet: "icon-custom-device-tablet",
  macBook: "icon-custom-device-laptop",
  windowsLaptop: "icon-custom-device-laptop",
  desktop: "icon-custom-device-desktop",
  appleWatch: "icon-custom-device-watch",
  wearOS: "icon-custom-device-watch",
  television: "icon-custom-device-tv",
}

/**
 * Resolves the icon for a board preset picker value. The "Default" value (empty
 * string) uses the desktop icon, "fit" uses the four-arrow align icon, and each
 * device preset uses its device icon.
 */
export function getBoardPresetIconId(presetValue: string): BoardPresetIconId {
  if (presetValue === "fit") return "seldon-align"
  return BOARD_DEVICE_PRESET_ICONS[presetValue] ?? "icon-custom-device-desktop"
}

/** Reads the board compound's preset facet value, or "" when unset (Default). */
export function getBoardPresetValue(value: unknown): string {
  if (value && typeof value === "object" && "preset" in value) {
    const preset = (value as { preset?: unknown }).preset
    if (preset && typeof preset === "object" && "value" in preset) {
      const presetValue = (preset as { value?: unknown }).value
      return typeof presetValue === "string" ? presetValue : ""
    }
  }
  return ""
}
