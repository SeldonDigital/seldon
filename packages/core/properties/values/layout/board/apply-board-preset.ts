import { Unit, ValueType } from "../../../constants"
import type { Properties } from "../../../types/properties"
import { Resize } from "../resize"
import { isBoardPresetId, type BoardPresetId } from "./board-preset"
import type { BoardCompound } from "./index"
import {
  BOARD_DEVICE_PRESETS,
  type BoardDevicePresetId,
  getBoardDevicePreset,
  isBoardDevicePresetId,
} from "./device-presets"

/** Applies the board fit preset to a board compound facet map. */
export function applyBoardFitPreset(): BoardCompound {
  return {
    preset: { type: ValueType.OPTION, value: Resize.FIT },
    width: { type: ValueType.OPTION, value: Resize.FIT },
    height: { type: ValueType.OPTION, value: Resize.FIT },
  }
}

/** Applies a board preset id to a board compound facet map. */
export function applyBoardPreset(presetId: BoardPresetId): BoardCompound {
  if (presetId === Resize.FIT) {
    return applyBoardFitPreset()
  }

  return applyBoardDevicePreset(presetId)
}

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
    isBoardPresetId(preset.value)
  ) {
    return preset.value === Resize.FIT ? "Fit" : getBoardDevicePreset(preset.value).name
  }
  return null
}

function isSameBoardFacetValue(
  left: BoardCompound["width"] | BoardCompound["height"],
  right: BoardCompound["width"] | BoardCompound["height"],
): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null)
}

/** Matches a board compound against the current preset's canonical state. */
export function matchBoardCompoundPreset(
  board: BoardCompound | undefined,
): string | null {
  const preset = board?.preset
  const presetId =
    preset &&
    typeof preset === "object" &&
    "type" in preset &&
    preset.type === ValueType.OPTION &&
    isBoardPresetId(preset.value)
      ? preset.value
      : null

  if (!presetId) {
    return null
  }

  const expected = applyBoardPreset(presetId)
  const sameWidth = isSameBoardFacetValue(board?.width, expected.width)
  const sameHeight = isSameBoardFacetValue(board?.height, expected.height)

  if (sameWidth && sameHeight) {
    return presetId === Resize.FIT ? "Fit" : getBoardDevicePreset(presetId).name
  }

  return null
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
): BoardPresetId | null {
  if (isBoardPresetId(preset)) return preset
  if (preset === "Fit") return Resize.FIT
  const byName = BOARD_DEVICE_PRESETS.find((entry) => entry.name === preset)
  return byName?.id ?? null
}
