import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import testTheme from "@seldon/core/themes/test/test-theme"
import { themeSwatchToColorValue } from "../color/theme-swatch-to-color-value"
import { resolveColor } from "./resolve-color"

describe("resolveColor", () => {
  it("resolves THEME_CATEGORICAL swatch to EXACT color", () => {
    const result = resolveColor({
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      theme: testTheme,
    })

    const swatch = getThemeOption("@swatch.primary", testTheme)
    expect(result).toEqual(themeSwatchToColorValue(swatch))
  })

  it("resolves black swatch for background high-contrast inputs", () => {
    const result = resolveColor({
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.black",
      },
      theme: testTheme,
    })

    const swatch = getThemeOption("@swatch.black", testTheme)
    expect(result).toEqual(themeSwatchToColorValue(swatch))
  })

  it("throws when theme swatch key is invalid", () => {
    expect(() =>
      resolveColor({
        color: {
          type: ValueType.THEME_CATEGORICAL,
          // @ts-expect-error invalid swatch key
          value: "@swatch.invalid",
        },
        theme: testTheme,
      }),
    ).toThrow("Theme value @swatch.invalid not found")
  })
})
