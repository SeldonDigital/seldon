/** Editor board device preset ids for the `board` compound preset facet. */
export type BoardDevicePresetId =
  | "iphone"
  | "androidPhone"
  | "ipad"
  | "androidTablet"
  | "macBook"
  | "windowsLaptop"
  | "desktop"
  | "appleWatch"
  | "wearOS"
  | "television"

export type BoardDevicePreset = {
  id: BoardDevicePresetId
  name: string
  widthPx: number
  heightPx: number
}

export const BOARD_DEVICE_PRESETS: readonly BoardDevicePreset[] = [
  { id: "iphone", name: "iPhone", widthPx: 390, heightPx: 844 },
  { id: "androidPhone", name: "Android Phone", widthPx: 412, heightPx: 915 },
  { id: "ipad", name: "iPad", widthPx: 820, heightPx: 1180 },
  { id: "androidTablet", name: "Android Tablet", widthPx: 800, heightPx: 1280 },
  { id: "macBook", name: "MacBook", widthPx: 1280, heightPx: 832 },
  { id: "windowsLaptop", name: "Windows Laptop", widthPx: 1366, heightPx: 768 },
  { id: "desktop", name: "Desktop", widthPx: 1440, heightPx: 900 },
  { id: "appleWatch", name: "Apple Watch", widthPx: 184, heightPx: 224 },
  { id: "wearOS", name: "Wear OS", widthPx: 192, heightPx: 192 },
  { id: "television", name: "Television", widthPx: 1920, heightPx: 1080 },
] as const

const PRESET_BY_ID = Object.fromEntries(
  BOARD_DEVICE_PRESETS.map((preset) => [preset.id, preset]),
) as Record<BoardDevicePresetId, BoardDevicePreset>

export function isBoardDevicePresetId(
  value: unknown,
): value is BoardDevicePresetId {
  return typeof value === "string" && value in PRESET_BY_ID
}

export function getBoardDevicePreset(
  id: BoardDevicePresetId,
): BoardDevicePreset {
  return PRESET_BY_ID[id]
}

export function getBoardDevicePresetDimensions(id: BoardDevicePresetId): {
  widthPx: number
  heightPx: number
} {
  const preset = PRESET_BY_ID[id]
  return { widthPx: preset.widthPx, heightPx: preset.heightPx }
}

export function matchBoardDevicePresetFromDimensions(
  widthPx: number | null,
  heightPx: number | null,
): BoardDevicePresetId | null {
  if (widthPx === null || heightPx === null) return null
  for (const preset of BOARD_DEVICE_PRESETS) {
    if (preset.widthPx === widthPx && preset.heightPx === heightPx) {
      return preset.id
    }
  }
  return null
}
