import { IconId } from "@seldon/core/icon-sets"

/**
 * Device icon per board device preset id. Preset ids come from
 * `BOARD_DEVICE_PRESETS`. OS variants share a device icon.
 */
const BOARD_DEVICE_PRESET_ICONS: Record<string, IconId> = {
  iphone: "seldon-deviceMobile",
  androidPhone: "seldon-deviceMobile",
  ipad: "seldon-deviceTablet",
  androidTablet: "seldon-deviceTablet",
  macBook: "seldon-deviceLaptop",
  windowsLaptop: "seldon-deviceLaptop",
  desktop: "seldon-deviceDesktop",
  appleWatch: "seldon-deviceWatch",
  wearOS: "seldon-deviceWatch",
  television: "seldon-deviceTv",
}

/**
 * Resolves the icon for a board preset picker value. The "Default" value (empty
 * string) uses the desktop icon, "fit" uses the four-arrow align icon, and each
 * device preset uses its device icon.
 */
export function getBoardPresetIconId(presetValue: string): IconId {
  if (presetValue === "fit") return "seldon-align"
  return BOARD_DEVICE_PRESET_ICONS[presetValue] ?? "seldon-deviceDesktop"
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
