import { describe, expect, it } from "vitest"

import { ValueType } from "../../../properties"
import { getValueType } from "./get-value-type"

describe("getValueType", () => {
  it("returns OPTION for non-token strings", () => {
    expect(getValueType("auto")).toBe(ValueType.OPTION)
  })

  it("maps named token sections to THEME_CATEGORICAL", () => {
    expect(getValueType("@swatch.primary")).toBe(ValueType.THEME_CATEGORICAL)
    expect(getValueType("@font.body")).toBe(ValueType.THEME_CATEGORICAL)
    expect(getValueType("@background.background1")).toBe(
      ValueType.THEME_CATEGORICAL,
    )
  })

  it("maps ordered scale sections to THEME_ORDINAL", () => {
    expect(getValueType("@fontSize.medium")).toBe(ValueType.THEME_ORDINAL)
    expect(getValueType("@margin.compact")).toBe(ValueType.THEME_ORDINAL)
    expect(getValueType("@borderWidth.small")).toBe(ValueType.THEME_ORDINAL)
  })

  it("falls back to OPTION for unknown token sections", () => {
    expect(getValueType("@unknown.thing")).toBe(ValueType.OPTION)
  })
})
