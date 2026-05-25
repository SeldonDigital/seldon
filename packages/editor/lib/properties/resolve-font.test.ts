import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "@seldon/core"
import theme from "@seldon/core/themes/test/test-theme"
import { resolveFont } from "./resolve-font"

describe("resolveFont", () => {
  it("should return null if font property is not set", () => {
    expect(resolveFont({}, theme)).toBeNull()
  })

  it("should return font properties if font property is set", () => {
    const font = resolveFont(
      {
        font: {
          preset: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@font.display",
          },
        },
      },
      theme,
    )

    expect(font!.fontFamily?.value).toEqual("Inter")
    expect(font!.fontSize?.value).toEqual({
      value: 2.998,
      unit: Unit.REM,
    })
    expect(font!.lineHeight?.value.value).toEqual(1.15)
    expect(font!.fontWeight?.value.value).toEqual(700)
  })
})
