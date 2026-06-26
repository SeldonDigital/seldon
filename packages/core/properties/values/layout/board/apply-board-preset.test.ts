import { describe, expect, it } from "vitest"

import type { BoardCompound } from "."
import { Unit, ValueType } from "../../../constants"
import { Resize } from "../resize"
import {
  applyBoardDevicePreset,
  applyBoardFitPreset,
  applyBoardPreset,
  buildBoardCompoundReset,
  matchBoardCompoundPreset,
  resolveBoardPresetIdFromPickerValue,
} from "./apply-board-preset"

describe("applyBoardPreset", () => {
  it("builds the fit preset facets", () => {
    expect(applyBoardPreset(Resize.FIT)).toEqual(applyBoardFitPreset())
    expect(applyBoardFitPreset()).toEqual({
      preset: { type: ValueType.OPTION, value: Resize.FIT },
      width: { type: ValueType.OPTION, value: Resize.FIT },
      height: { type: ValueType.OPTION, value: Resize.FIT },
    })
  })

  it("builds device preset facets in pixels", () => {
    const iphone = applyBoardDevicePreset("iphone")
    expect(iphone.preset).toEqual({ type: ValueType.OPTION, value: "iphone" })
    expect(iphone.width).toEqual({
      type: ValueType.EXACT,
      value: { value: 390, unit: Unit.PX },
    })
  })
})

describe("matchBoardCompoundPreset", () => {
  it("names a board that matches its preset's canonical state", () => {
    expect(matchBoardCompoundPreset(applyBoardPreset(Resize.FIT))).toBe("Fit")
    expect(matchBoardCompoundPreset(applyBoardDevicePreset("iphone"))).toBe(
      "iPhone",
    )
  })

  it("returns null for a mismatch or a missing preset", () => {
    const tampered = {
      ...applyBoardDevicePreset("iphone"),
      width: { type: ValueType.EXACT, value: { value: 1, unit: Unit.PX } },
    }
    expect(matchBoardCompoundPreset(tampered)).toBeNull()
    expect(matchBoardCompoundPreset(undefined)).toBeNull()
    expect(matchBoardCompoundPreset({})).toBeNull()
  })
})

describe("buildBoardCompoundReset", () => {
  it("defaults height to fit when no schema board is given", () => {
    const reset = buildBoardCompoundReset()
    expect(reset.board).toMatchObject({
      preset: { type: ValueType.EMPTY, value: null },
      width: { type: ValueType.EMPTY, value: null },
      height: { type: ValueType.OPTION, value: Resize.FIT },
    })
  })

  it("uses schema-provided facets when present", () => {
    const schemaBoard = {
      preset: { type: ValueType.OPTION, value: "ipad" },
    } as BoardCompound
    expect(
      (buildBoardCompoundReset(schemaBoard).board as BoardCompound).preset,
    ).toEqual({
      type: ValueType.OPTION,
      value: "ipad",
    })
  })
})

describe("resolveBoardPresetIdFromPickerValue", () => {
  it("resolves ids, the Fit label, and device names", () => {
    expect(resolveBoardPresetIdFromPickerValue("iphone")).toBe("iphone")
    expect(resolveBoardPresetIdFromPickerValue("Fit")).toBe(Resize.FIT)
    expect(resolveBoardPresetIdFromPickerValue("iPhone")).toBe("iphone")
    expect(resolveBoardPresetIdFromPickerValue("nope")).toBeNull()
  })
})
