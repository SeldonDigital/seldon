import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { Resize } from "../resize"
import {
  BOARD_DEVICE_PRESETS,
  BoardDevicePresetId,
  isBoardDevicePresetId,
} from "./device-presets"

export type BoardPresetId = BoardDevicePresetId | typeof Resize.FIT

export const BOARD_FIT_PRESET_OPTION = {
  value: Resize.FIT,
  name: "Fit",
} as const

export function isBoardPresetId(value: unknown): value is BoardPresetId {
  return value === Resize.FIT || isBoardDevicePresetId(value)
}

/** Picks a stock device preset or fit mode for board viewport sizing. */
export interface BoardPresetOptionValue {
  type: ValueType.OPTION
  value: BoardPresetId
}

export type BoardPresetValue = EmptyValue | BoardPresetOptionValue

export const boardPresetSchema: PropertySchema = {
  name: "boardPreset",
  description:
    "Selects fit mode or a device preset for board width and height on the canvas.",
  supports: ["empty", "option"] as const,
  validation: {
    empty: () => true,
    option: (value: unknown) => isBoardPresetId(value),
  },
  presetOptions: () =>
    [
      BOARD_FIT_PRESET_OPTION,
      ...BOARD_DEVICE_PRESETS.map((preset) => ({
        value: preset.id,
        name: preset.name,
      })),
    ],
}
