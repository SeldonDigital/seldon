import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import testTheme from "@seldon/core/themes/test/test-theme"
import { themeSwatchToColorValue } from "./theme-swatch-to-color-value"

describe("themeSwatchToColorValue", () => {
  it("maps HSL swatch parameters to EXACT HSL object", () => {
    const swatch = getThemeOption("@swatch.primary", testTheme)

    expect(themeSwatchToColorValue(swatch)).toEqual({
      type: ValueType.EXACT,
      value: swatch.parameters.value,
    })
  })

  it("maps black swatch to EXACT for contrast resolution", () => {
    const swatch = getThemeOption("@swatch.black", testTheme)
    const result = themeSwatchToColorValue(swatch)

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toEqual(swatch.parameters.value)
  })
})
