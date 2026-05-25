import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import {
  BOARD_DEVICE_PRESETS,
  BoardDevicePresetId,
  isBoardDevicePresetId,
} from "./device-presets"

/** Picks a stock device preset for board viewport sizing. */
export interface BoardPresetOptionValue {
  type: ValueType.OPTION
  value: BoardDevicePresetId
}

export type BoardPresetValue = EmptyValue | BoardPresetOptionValue

export const boardPresetSchema: PropertySchema = {
  name: "boardPreset",
  description:
    "Selects a device preset for board width and height on the canvas.",
  supports: ["empty", "option"] as const,
  validation: {
    empty: () => true,
    option: (value: unknown) => isBoardDevicePresetId(value),
  },
  presetOptions: () =>
    BOARD_DEVICE_PRESETS.map((preset) => ({
      value: preset.id,
      name: preset.name,
    })),
}
