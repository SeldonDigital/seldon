import { describe, expect, it } from "vitest"

import {
  BOARD_DEVICE_PRESETS,
  getBoardDevicePreset,
  isBoardDevicePresetId,
} from "./device-presets"

describe("isBoardDevicePresetId", () => {
  it("accepts known ids and rejects others", () => {
    expect(isBoardDevicePresetId("iphone")).toBe(true)
    expect(isBoardDevicePresetId("desktop")).toBe(true)
    expect(isBoardDevicePresetId("nope")).toBe(false)
    expect(isBoardDevicePresetId(123)).toBe(false)
  })
})

describe("getBoardDevicePreset", () => {
  it("returns the preset record for an id", () => {
    expect(getBoardDevicePreset("ipad")).toMatchObject({
      id: "ipad",
      name: "iPad",
      widthPx: 820,
      heightPx: 1180,
    })
  })

  it("exposes every catalog preset with positive dimensions", () => {
    expect(BOARD_DEVICE_PRESETS.length).toBe(10)
    for (const preset of BOARD_DEVICE_PRESETS) {
      expect(preset.widthPx).toBeGreaterThan(0)
      expect(preset.heightPx).toBeGreaterThan(0)
    }
  })
})
