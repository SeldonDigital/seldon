import { describe, expect, it } from "vitest"

import { ValueType } from "../../properties/constants"
import type { Theme } from "../types"
import {
  convertLookParameterValue,
  expandLookPresetFacets,
  hasExpandableLookPreset,
} from "./expand-preset-facets"

const theme = {
  border: {
    hairline: {
      type: "look",
      name: "Hairline",
      parameters: {
        color: "@swatch.gray",
        width: { type: ValueType.EXACT, value: 1 },
      },
    },
  },
} as unknown as Theme

const borderPreset = {
  border: {
    preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
  },
} as never

describe("convertLookParameterValue", () => {
  it("wraps @ refs, passes tagged values, and tags raw scalars", () => {
    expect(convertLookParameterValue("@swatch.primary")).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })

    const tagged = { type: ValueType.EXACT, value: 2 }
    expect(convertLookParameterValue(tagged)).toBe(tagged)

    expect(convertLookParameterValue(5)).toEqual({
      type: ValueType.EXACT,
      value: 5,
    })
  })
})

describe("hasExpandableLookPreset", () => {
  it("is true when a bridged compound carries a preset ref", () => {
    expect(hasExpandableLookPreset(borderPreset)).toBe(true)
  })

  it("is false without any look-bridged preset", () => {
    expect(
      hasExpandableLookPreset({
        opacity: { type: ValueType.EXACT, value: 1 },
      } as never),
    ).toBe(false)
  })
})

describe("expandLookPresetFacets", () => {
  it("expands a border preset into the look's facets", () => {
    const result = expandLookPresetFacets(borderPreset, theme) as any

    expect(result).not.toBe(borderPreset)
    expect(result.border.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.gray",
    })
    expect(result.border.preset).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@border.hairline",
    })
  })

  it("returns the same object when no key bridges to a look section", () => {
    const properties = { opacity: { type: ValueType.EXACT, value: 1 } } as never
    expect(expandLookPresetFacets(properties, theme)).toBe(properties)
  })
})
