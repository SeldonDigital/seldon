import { describe, expect, it } from "vitest"

import { ValueType } from "../../properties/constants"
import { STOCK_THEMES_BY_ID } from "../../themes/catalog"
import { computeTheme } from "../../themes/helpers/compute-theme"
import type { Theme } from "../../themes/types"
import { resolveBorderWidth } from "./resolve-border-width"
import { resolveFontFamily } from "./resolve-font-family"
import { resolveShadowBlur } from "./resolve-shadow-blur"
import { resolveSize } from "./resolve-size"

const theme = computeTheme(STOCK_THEMES_BY_ID.seldon) as unknown as Theme
const cast = <T>(value: unknown) => value as T

describe("resolveBorderWidth", () => {
  it("passes EMPTY, EXACT, and OPTION through unchanged", () => {
    const empty = { type: ValueType.EMPTY, value: null }
    const exact = { type: ValueType.EXACT, value: { unit: "px", value: 2 } }
    expect(resolveBorderWidth({ borderWidth: cast(empty), theme })).toBe(empty)
    expect(resolveBorderWidth({ borderWidth: cast(exact), theme })).toBe(exact)
  })

  it("resolves a THEME_ORDINAL token to a concrete length", () => {
    const result = resolveBorderWidth({
      borderWidth: cast({ type: ValueType.THEME_ORDINAL, value: "@borderWidth.small" }),
      theme,
    })
    expect(result.type).toBeDefined()
  })
})

describe("resolveShadowBlur", () => {
  it("passes EMPTY and EXACT through unchanged", () => {
    const empty = { type: ValueType.EMPTY, value: null }
    const exact = { type: ValueType.EXACT, value: { unit: "px", value: 4 } }
    expect(resolveShadowBlur({ blur: cast(empty), theme })).toBe(empty)
    expect(resolveShadowBlur({ blur: cast(exact), theme })).toBe(exact)
  })

  it("throws on an unsupported type", () => {
    expect(() =>
      resolveShadowBlur({ blur: cast({ type: ValueType.OPTION, value: "x" }), theme }),
    ).toThrow()
  })
})

describe("resolveFontFamily", () => {
  it("returns undefined for missing, empty, and inherit values", () => {
    expect(resolveFontFamily({ fontFamily: undefined, theme })).toBeUndefined()
    expect(
      resolveFontFamily({ fontFamily: { type: ValueType.EMPTY, value: null }, theme }),
    ).toBeUndefined()
    expect(
      resolveFontFamily({ fontFamily: cast({ type: ValueType.INHERIT, value: null }), theme }),
    ).toBeUndefined()
  })

  it("wraps OPTION and EXACT values as an OPTION", () => {
    expect(
      resolveFontFamily({ fontFamily: cast({ type: ValueType.OPTION, value: "Inter" }), theme }),
    ).toEqual({ type: ValueType.OPTION, value: "Inter" })
    expect(
      resolveFontFamily({ fontFamily: cast({ type: ValueType.EXACT, value: "Arial" }), theme }),
    ).toEqual({ type: ValueType.OPTION, value: "Arial" })
  })

  it("resolves a THEME_CATEGORICAL token to a font stack option", () => {
    const result = resolveFontFamily({
      fontFamily: cast({ type: ValueType.THEME_CATEGORICAL, value: "@fontFamily.primary" }),
      theme,
    })
    expect(result?.type).toBe(ValueType.OPTION)
    expect(typeof result?.value).toBe("string")
  })

  it("throws on a COMPUTED value", () => {
    expect(() =>
      resolveFontFamily({ fontFamily: { type: ValueType.COMPUTED, value: "x" }, theme }),
    ).toThrow()
  })
})

describe("resolveSize", () => {
  it("passes EMPTY and EXACT through", () => {
    const empty = { type: ValueType.EMPTY, value: null }
    expect(resolveSize({ size: cast(empty), parentContext: null, theme })).toBe(empty)
  })

  it("resolves a modulated THEME_ORDINAL token to a rem length", () => {
    const result = resolveSize({
      size: cast({ type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" }),
      parentContext: null,
      theme,
    })
    expect(result.type).toBe(ValueType.EXACT)
  })
})
