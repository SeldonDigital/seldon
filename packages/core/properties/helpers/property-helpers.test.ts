import { describe, expect, it } from "vitest"

import { Unit } from "../constants"
import { getBorderSideOptions } from "./border-side-options"
import { getLayerAddOptions } from "./layer-add-options"
import { mergeTaggedValues } from "./merge-tagged-value"
import { getDefaultUnitForProperty, getUnitsForProperty } from "./unit-utils"

describe("mergeTaggedValues", () => {
  it("shallow-merges two records, patch wins on shared keys", () => {
    expect(
      mergeTaggedValues({ type: "EXACT", value: 1 }, { value: 2 }),
    ).toEqual({ type: "EXACT", value: 2 })
  })

  it("replaces when the next value is not a record", () => {
    expect(mergeTaggedValues({ a: 1 }, 5)).toBe(5)
    expect(mergeTaggedValues(3, { a: 1 })).toEqual({ a: 1 })
    expect(mergeTaggedValues(undefined, null)).toBeNull()
  })
})

describe("unit utils", () => {
  it("falls back to px/rem/percent for an unknown property", () => {
    expect(getUnitsForProperty("totallyUnknownProperty")).toEqual([
      Unit.PX,
      Unit.REM,
      Unit.PERCENT,
    ])
    expect(getDefaultUnitForProperty("totallyUnknownProperty")).toBe(Unit.PX)
  })

  it("returns a non-empty unit list for a compound facet path", () => {
    const units = getUnitsForProperty("border.width")
    expect(Array.isArray(units)).toBe(true)
    expect(units.length).toBeGreaterThan(0)
  })
})

describe("getLayerAddOptions", () => {
  it("offers typed color/image/gradient seeds for background", () => {
    const options = getLayerAddOptions("background")
    expect(options).toHaveLength(3)
    expect(options.map((o) => o.id)).toEqual([
      "add-layer-background-color",
      "add-layer-background-image",
      "add-layer-background-gradient",
    ])
    expect(options.every((o) => o.seed)).toBe(true)
  })

  it("offers a single empty layer for shadow", () => {
    const options = getLayerAddOptions("shadow")
    expect(options).toHaveLength(1)
    expect(options[0]!.id).toBe("add-layer-shadow")
    expect(options[0]!.seed).toBeUndefined()
  })
})

describe("getBorderSideOptions", () => {
  it("returns the four border sides in order", () => {
    const options = getBorderSideOptions()
    expect(options.map((o) => o.side)).toEqual([
      "borderTop",
      "borderRight",
      "borderBottom",
      "borderLeft",
    ])
    expect(options[0]!.id).toBe("border-side-borderTop")
    expect(options[0]!.label).toBe("Top Border")
  })
})
