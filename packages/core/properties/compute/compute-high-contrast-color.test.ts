import { describe, expect, it } from "bun:test"
import { ComputedFunction, ValueType } from "@seldon/core"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { themeSwatchToColorValue } from "../../helpers/color/theme-swatch-to-color-value"
import testTheme from "@seldon/core/themes/test/test-theme"
import { computeHighContrastColor } from "./compute-high-contrast-color"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import type { ComputeContext } from "./types"

describe("computeHighContrastColor", () => {
  it("returns white text on a dark swatch parent background", () => {
    const computed: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: { basedOn: "#parent.background.color" },
      },
    }

    const context: ComputeContext = {
      properties: {},
      parentContext: {
        properties: {
          background: [
            {
              color: {
                type: ValueType.THEME_CATEGORICAL,
                value: "@swatch.black",
              },
            },
          ],
        },
        parentContext: null,
      },
      theme: testTheme,
    }

    const result = computeHighContrastColor(computed, context)
    const whiteSwatch = getThemeOption("@swatch.white", testTheme)

    expect(result).toEqual(themeSwatchToColorValue(whiteSwatch))
  })

  it("returns black text on a light swatch parent background", () => {
    const computed: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: { basedOn: "#parent.background.color" },
      },
    }

    const context: ComputeContext = {
      properties: {},
      parentContext: {
        properties: {
          background: [
            {
              color: {
                type: ValueType.THEME_CATEGORICAL,
                value: "@swatch.white",
              },
            },
          ],
        },
        parentContext: null,
      },
      theme: testTheme,
    }

    const result = computeHighContrastColor(computed, context)
    const blackSwatch = getThemeOption("@swatch.black", testTheme)

    expect(result).toEqual(themeSwatchToColorValue(blackSwatch))
  })
})
