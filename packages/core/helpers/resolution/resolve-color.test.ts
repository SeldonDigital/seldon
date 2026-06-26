import { describe, expect, it } from "vitest"

import { ValueType } from "../../properties/constants"
import { STOCK_THEMES_BY_ID } from "../../themes/catalog"
import { computeTheme } from "../../themes/helpers/compute-theme"
import type { Theme } from "../../themes/types"
import { resolveColor } from "./resolve-color"

const theme = computeTheme(STOCK_THEMES_BY_ID.seldon) as unknown as Theme

const color = (value: unknown) => value as never

describe("resolveColor", () => {
  it("passes EXACT, OPTION, and EMPTY values through", () => {
    const exact = {
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 0, lightness: 0 },
    }
    const option = { type: ValueType.OPTION, value: "transparent" }
    const empty = { type: ValueType.EMPTY, value: null }

    expect(resolveColor({ color: color(exact), theme })).toBe(exact)
    expect(resolveColor({ color: color(option), theme })).toBe(option)
    expect(resolveColor({ color: color(empty), theme })).toBe(empty)
  })

  it("falls back to EMPTY for an invalid color object", () => {
    expect(resolveColor({ color: color({}), theme })).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
  })

  it("throws on a COMPUTED value", () => {
    expect(() =>
      resolveColor({
        color: color({ type: ValueType.COMPUTED, value: "x" }),
        theme,
      }),
    ).toThrow()
  })

  it("resolves a swatch token to an EXACT color", () => {
    const result = resolveColor({
      color: color({
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      }),
      theme,
    })
    expect(result.type).toBe(ValueType.EXACT)
  })

  it("falls back to EMPTY for unknown or non-swatch tokens", () => {
    expect(
      resolveColor({
        color: color({
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.doesNotExist",
        }),
        theme,
      }),
    ).toEqual({ type: ValueType.EMPTY, value: null })

    expect(
      resolveColor({
        color: color({
          type: ValueType.THEME_CATEGORICAL,
          value: "@font.body",
        }),
        theme,
      }),
    ).toEqual({ type: ValueType.EMPTY, value: null })
  })
})
