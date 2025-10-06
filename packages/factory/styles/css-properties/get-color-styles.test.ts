import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getColorStyles } from "./get-color-styles"

describe("getColorStyles", () => {
  it("should return empty object when no color properties are set", () => {
    const properties: Properties = {}

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should set color when color property is present", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
    })
  })

  it("should set accent color when accentColor property is present", () => {
    const properties: Properties = {
      accentColor: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      accentColor: "hsl(0 0% 15%)",
    })
  })

  it("should set both color and accent color", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      accentColor: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.swatch1",
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
      accentColor: "hsl(0 0% 30%)",
    })
  })

  it("should apply brightness to color", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      brightness: {
        type: ValueType.EXACT,
        value: { value: 20, unit: Unit.PERCENT },
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      color: "hsl(0 0% 32%)",
    })
  })

  it("should not set color when symbol property is present", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      symbol: {
        type: ValueType.PRESET,
        value: "material-add",
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should not set color when gradient property is present", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      gradient: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@gradient.primary",
        },
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should set accent color even when symbol is present", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      accentColor: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      symbol: {
        type: ValueType.PRESET,
        value: "material-add",
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      accentColor: "hsl(0 0% 15%)",
    })
  })

  it("should set accent color even when gradient is present", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      accentColor: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      gradient: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@gradient.primary",
        },
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      accentColor: "hsl(0 0% 15%)",
    })
  })

  it("should handle different theme swatch values", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.white",
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      color: "hsl(0 12% 98%)",
    })
  })

  it("should handle empty color values", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      color: "",
    })
  })

  it("should handle empty accent color values", () => {
    const properties: Properties = {
      accentColor: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getColorStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      accentColor: "",
    })
  })
})
