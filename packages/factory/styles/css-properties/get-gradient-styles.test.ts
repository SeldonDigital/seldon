import { describe, expect, it } from "bun:test"
import { GradientType, Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { StyleGenerationContext } from "../types"
import { getGradientStyles } from "./get-gradient-styles"

describe("getGradientStyles", () => {
  it("should return empty object when gradient is not defined", () => {
    const context: StyleGenerationContext = {
      properties: {},
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toEqual({})
  })

  it("should return empty object when gradient has no colors", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          gradientType: { type: ValueType.PRESET, value: GradientType.LINEAR },
          angle: { type: ValueType.EMPTY, value: null },
          startColor: { type: ValueType.EMPTY, value: null },
          startOpacity: { type: ValueType.EMPTY, value: null },
          startPosition: { type: ValueType.EMPTY, value: null },
          endColor: { type: ValueType.EMPTY, value: null },
          endOpacity: { type: ValueType.EMPTY, value: null },
          endPosition: { type: ValueType.EMPTY, value: null },
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toEqual({})
  })

  it("should handle theme gradient presets", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          preset: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@gradient.gradient1",
          },
          gradientType: { type: ValueType.PRESET, value: GradientType.LINEAR },
          angle: { type: ValueType.EMPTY, value: null },
          startColor: { type: ValueType.EMPTY, value: null },
          startOpacity: { type: ValueType.EMPTY, value: null },
          startPosition: { type: ValueType.EMPTY, value: null },
          endColor: { type: ValueType.EMPTY, value: null },
          endOpacity: { type: ValueType.EMPTY, value: null },
          endPosition: { type: ValueType.EMPTY, value: null },
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toHaveProperty("backgroundImage")
    expect(result.backgroundImage).toContain("linear-gradient")
    expect(result.backgroundImage).toContain("0deg")
  })

  it("should handle gradient with custom colors and properties", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          gradientType: {
            type: ValueType.PRESET,
            value: GradientType.LINEAR,
          },
          angle: {
            type: ValueType.EXACT,
            value: { value: 90, unit: Unit.DEGREES },
          },
          startColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.white",
          },
          startOpacity: {
            type: ValueType.EXACT,
            value: { value: 50, unit: Unit.PERCENT },
          },
          startPosition: {
            type: ValueType.EXACT,
            value: { value: 0, unit: Unit.PERCENT },
          },
          endColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.black",
          },
          endOpacity: {
            type: ValueType.EXACT,
            value: { value: 50, unit: Unit.PERCENT },
          },
          endPosition: {
            type: ValueType.EXACT,
            value: { value: 100, unit: Unit.PERCENT },
          },
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toHaveProperty("backgroundImage")
    expect(result.backgroundImage).toContain("linear-gradient")
    expect(result.backgroundImage).toContain("90deg")
    expect(result.backgroundImage).toContain("0%")
    expect(result.backgroundImage).toContain("100%")
  })

  it("should handle radial gradients", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          gradientType: {
            type: ValueType.PRESET,
            value: GradientType.RADIAL,
          },
          angle: { type: ValueType.EMPTY, value: null },
          startColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          startOpacity: { type: ValueType.EMPTY, value: null },
          startPosition: {
            type: ValueType.EXACT,
            value: { value: 0, unit: Unit.PERCENT },
          },
          endColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.swatch1",
          },
          endOpacity: { type: ValueType.EMPTY, value: null },
          endPosition: {
            type: ValueType.EXACT,
            value: { value: 100, unit: Unit.PERCENT },
          },
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toHaveProperty("backgroundImage")
    expect(result.backgroundImage).toContain("radial-gradient")
    expect(result.backgroundImage).not.toContain("deg")
  })

  it("should add text gradient styles when content is present", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          gradientType: {
            type: ValueType.PRESET,
            value: GradientType.LINEAR,
          },
          angle: {
            type: ValueType.EXACT,
            value: { value: 45, unit: Unit.DEGREES },
          },
          startColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          startOpacity: { type: ValueType.EMPTY, value: null },
          startPosition: {
            type: ValueType.EXACT,
            value: { value: 0, unit: Unit.PERCENT },
          },
          endColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.swatch1",
          },
          endOpacity: { type: ValueType.EMPTY, value: null },
          endPosition: {
            type: ValueType.EXACT,
            value: { value: 100, unit: Unit.PERCENT },
          },
        },
        content: {
          type: ValueType.EXACT,
          value: "Gradient Text",
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toHaveProperty("backgroundImage")
    expect(result).toHaveProperty("color", "transparent")
    expect(result).toHaveProperty("backgroundClip", "text")
  })

  it("should handle gradient with brightness adjustments", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          gradientType: {
            type: ValueType.PRESET,
            value: GradientType.LINEAR,
          },
          angle: { type: ValueType.EMPTY, value: null },
          startColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          startBrightness: {
            type: ValueType.EXACT,
            value: { value: 20, unit: Unit.PERCENT },
          },
          startOpacity: { type: ValueType.EMPTY, value: null },
          startPosition: {
            type: ValueType.EXACT,
            value: { value: 0, unit: Unit.PERCENT },
          },
          endColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.swatch1",
          },
          endBrightness: {
            type: ValueType.EXACT,
            value: { value: -20, unit: Unit.PERCENT },
          },
          endOpacity: { type: ValueType.EMPTY, value: null },
          endPosition: {
            type: ValueType.EXACT,
            value: { value: 100, unit: Unit.PERCENT },
          },
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toHaveProperty("backgroundImage")
    expect(result.backgroundImage).toContain("linear-gradient")
  })

  it("should handle gradient with custom positions", () => {
    const context: StyleGenerationContext = {
      properties: {
        gradient: {
          gradientType: {
            type: ValueType.PRESET,
            value: GradientType.LINEAR,
          },
          angle: { type: ValueType.EMPTY, value: null },
          startColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          startOpacity: { type: ValueType.EMPTY, value: null },
          startPosition: {
            type: ValueType.EXACT,
            value: { value: 25, unit: Unit.PERCENT },
          },
          endColor: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.swatch1",
          },
          endOpacity: { type: ValueType.EMPTY, value: null },
          endPosition: {
            type: ValueType.EXACT,
            value: { value: 75, unit: Unit.PERCENT },
          },
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getGradientStyles(context)

    expect(result).toHaveProperty("backgroundImage")
    expect(result.backgroundImage).toContain("25%")
    expect(result.backgroundImage).toContain("75%")
  })
})
