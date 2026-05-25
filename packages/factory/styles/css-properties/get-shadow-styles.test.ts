import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import theme from "@seldon/core/themes/test/test-theme"
import { getShadowStyles } from "./get-shadow-styles"

describe("getShadowStyles", () => {
  it("should return empty object when shadow is not in properties", () => {
    const properties = {}

    expect(getShadowStyles({ properties, parentContext: null, theme })).toEqual(
      {},
    )
  })

  it("should handle theme categorical presets", () => {
    const properties: Properties = {
      shadow: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@shadow.strong" },
        color: { type: ValueType.EMPTY, value: null },
        offsetX: { type: ValueType.EMPTY, value: null },
        offsetY: { type: ValueType.EMPTY, value: null },
        blur: { type: ValueType.EMPTY, value: null },
        spread: { type: ValueType.EMPTY, value: null },
        opacity: { type: ValueType.EMPTY, value: null },
      },
    }
    expect(getShadowStyles({ properties, parentContext: null, theme })).toEqual(
      {
        boxShadow: "0px 6px 0.75rem 0.25rem hsl(0 12% 8% / 33%)",
      },
    )
  })

  it("should handle shadow property overrides", () => {
    const properties: Properties = {
      shadow: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@shadow.light",
        },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
        offsetX: { type: ValueType.EXACT, value: { value: 1, unit: Unit.PX } },
        offsetY: { type: ValueType.EXACT, value: { value: 2, unit: Unit.PX } },
        blur: { type: ValueType.EXACT, value: { value: 3, unit: Unit.PX } },
        spread: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 50, unit: Unit.PERCENT },
        },
      },
    }
    expect(
      getShadowStyles({
        properties,
        parentContext: null,
        theme,
      }),
    ).toEqual({
      boxShadow: "1px 2px 3px 4px hsl(0 12% 98% / 50%)",
    })
  })

  it("should handle non-preset shadow values", () => {
    const properties: Properties = {
      shadow: {
        preset: { type: ValueType.EMPTY, value: null },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
        offsetX: {
          type: ValueType.EXACT,
          value: { value: 1.5, unit: Unit.REM },
        },
        offsetY: {
          type: ValueType.EXACT,
          value: { value: 2.5, unit: Unit.REM },
        },
        blur: { type: ValueType.EXACT, value: { value: 3.5, unit: Unit.PX } },
        spread: { type: ValueType.EXACT, value: { value: 4.5, unit: Unit.PX } },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 90, unit: Unit.PERCENT },
        },
      },
    }
    expect(
      getShadowStyles({
        properties,
        parentContext: null,
        theme,
      }),
    ).toEqual({
      boxShadow: "1.5rem 2.5rem 3.5px 4.5px hsl(0 12% 98% / 90%)",
    })
  })

  it("should handle box shadows without spread", () => {
    const properties: Properties = {
      shadow: {
        preset: { type: ValueType.EMPTY, value: null },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
        offsetX: {
          type: ValueType.EXACT,
          value: { value: 1.5, unit: Unit.REM },
        },
        offsetY: {
          type: ValueType.EXACT,
          value: { value: 2.5, unit: Unit.REM },
        },
        blur: { type: ValueType.EXACT, value: { value: 3.5, unit: Unit.PX } },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 90, unit: Unit.PERCENT },
        },
      },
    }
    expect(
      getShadowStyles({
        properties,
        parentContext: null,
        theme,
      }),
    ).toEqual({
      boxShadow: "1.5rem 2.5rem 3.5px hsl(0 12% 98% / 90%)",
    })
  })

  it("should handle text shadows", () => {
    const properties: Properties = {
      shadow: {
        preset: { type: ValueType.EMPTY, value: null },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
        offsetX: {
          type: ValueType.EXACT,
          value: { value: 1.5, unit: Unit.REM },
        },
        offsetY: {
          type: ValueType.EXACT,
          value: { value: 2.5, unit: Unit.REM },
        },
        blur: { type: ValueType.EXACT, value: { value: 3.5, unit: Unit.PX } },
        spread: { type: ValueType.EXACT, value: { value: 4.5, unit: Unit.PX } },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 90, unit: Unit.PERCENT },
        },
      },
    }
    expect(
      getShadowStyles({
        properties: {
          ...properties,
          content: {
            type: ValueType.EXACT,
            value: "test",
          },
        },
        parentContext: null,
        theme,
      }),
    ).toEqual({
      textShadow: "1.5rem 2.5rem 3.5px hsl(0 12% 98% / 90%)",
    })
  })
})
