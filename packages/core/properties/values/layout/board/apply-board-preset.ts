import { Unit, ValueType } from "../../../constants"
import type { Properties } from "../../../types/properties"
import type { BoardCompound } from "./index"
import {
  BOARD_DEVICE_PRESETS,
  type BoardDevicePresetId,
  getBoardDevicePreset,
  isBoardDevicePresetId,
  matchBoardDevicePresetFromDimensions,
} from "./device-presets"
import { Resize } from "../resize"

/** Applies a device preset id to a board compound facet map. */
export function applyBoardDevicePreset(
  presetId: BoardDevicePresetId,
): BoardCompound {
  const preset = getBoardDevicePreset(presetId)
  return {
    preset: { type: ValueType.OPTION, value: presetId },
    width: {
      type: ValueType.EXACT,
      value: { value: preset.widthPx, unit: Unit.PX },
    },
    height: {
      type: ValueType.EXACT,
      value: { value: preset.heightPx, unit: Unit.PX },
    },
  }
}

/** Resolves the display name for a board compound preset facet. */
export function getBoardPresetDisplayName(
  board: BoardCompound | undefined,
): string | null {
  const preset = board?.preset
  if (
    preset &&
    typeof preset === "object" &&
    "type" in preset &&
    preset.type === ValueType.OPTION &&
    isBoardDevicePresetId(preset.value)
  ) {
    return getBoardDevicePreset(preset.value).name
  }
  return null
}

/** Matches effective board width and height to a device preset name. */
export function matchBoardCompoundPreset(
  board: BoardCompound | undefined,
): string | null {
  const display = getBoardPresetDisplayName(board)
  if (display) return display

  const width = board?.width
  const height = board?.height

  const widthPx =
    width &&
    typeof width === "object" &&
    "type" in width &&
    width.type === ValueType.EXACT &&
    typeof width.value === "object" &&
    width.value !== null &&
    "unit" in width.value &&
    width.value.unit === Unit.PX
      ? width.value.value
      : null

  const heightPx =
    height &&
    typeof height === "object" &&
    "type" in height &&
    height.type === ValueType.EXACT &&
    typeof height.value === "object" &&
    height.value !== null &&
    "unit" in height.value &&
    height.value.unit === Unit.PX
      ? height.value.value
      : null

  const matched = matchBoardDevicePresetFromDimensions(widthPx, heightPx)
  if (!matched) return null
  return getBoardDevicePreset(matched).name
}

export function isBoardCompoundPresetReset(preset: string): boolean {
  return (
    preset === "Default" ||
    preset === "None" ||
    preset === "unset" ||
    preset === ""
  )
}

export function buildBoardCompoundReset(schemaBoard?: BoardCompound): Properties {
  const EMPTY = { type: ValueType.EMPTY, value: null } as const
  const schema = schemaBoard ?? {}
  return {
    board: {
      preset: schema.preset ?? EMPTY,
      width: schema.width ?? EMPTY,
      height:
        schema.height ??
        ({ type: ValueType.OPTION, value: Resize.FIT } as const),
    },
  }
}

export function resolveBoardPresetIdFromPickerValue(
  preset: string,
): BoardDevicePresetId | null {
  if (isBoardDevicePresetId(preset)) return preset
  const byName = BOARD_DEVICE_PRESETS.find((entry) => entry.name === preset)
  return byName?.id ?? null
}
