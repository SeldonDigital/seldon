import type { BoardHeightValue } from "./board-height"
import type { BoardPresetValue } from "./board-preset"
import type { BoardWidthValue } from "./board-width"

/** Board compound with device preset and viewport width and height facets. */
export type BoardCompound = {
  preset?: BoardPresetValue
  width?: BoardWidthValue
  height?: BoardHeightValue
}

export * from "./board-preset"
export * from "./board-width"
export * from "./board-height"
export * from "./device-presets"
export * from "./apply-board-preset"
