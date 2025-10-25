import { describe, expect, it } from "bun:test"
import { BorderWidth, Unit, ValueType } from "../../index"
import { BorderWidthValue } from "../../properties/values/appearance/border/border-width"
import testTheme from "../../themes/test/test-theme"
import { resolveBorderWidth } from "./resolve-border-width"

describe("resolveBorderWidth", () => {
  it("should return exact pixel border width values unchanged", () => {
    const exactBorderWidth: BorderWidthValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 2 },
    }

    const result = resolveBorderWidth({
      borderWidth: exactBorderWidth,
      theme: testTheme,
    })

    expect(result).toEqual(exactBorderWidth)
  })

  it("should return exact rem border width values unchanged", () => {
    const exactBorderWidth: BorderWidthValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.125 },
    }

    const result = resolveBorderWidth({
      borderWidth: exactBorderWidth,
      theme: testTheme,
    })

    expect(result).toEqual(exactBorderWidth)
  })

  it("should return empty values unchanged", () => {
    const emptyBorderWidth: BorderWidthValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveBorderWidth({
      borderWidth: emptyBorderWidth,
      theme: testTheme,
    })

    expect(result).toEqual(emptyBorderWidth)
  })

  it("should return preset hairline values unchanged", () => {
    const presetBorderWidth: BorderWidthValue = {
      type: ValueType.PRESET,
      value: BorderWidth.HAIRLINE,
    }

    const result = resolveBorderWidth({
      borderWidth: presetBorderWidth,
      theme: testTheme,
    })

    expect(result).toEqual(presetBorderWidth)
  })

  it("should resolve theme ordinal medium border width to exact value", () => {
    const themeBorderWidth: BorderWidthValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@borderWidth.medium",
    }

    const result = resolveBorderWidth({
      borderWidth: themeBorderWidth,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve theme ordinal small border width to exact value", () => {
    const themeBorderWidth: BorderWidthValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@borderWidth.small",
    }

    const result = resolveBorderWidth({
      borderWidth: themeBorderWidth,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve theme ordinal xlarge border width to exact value", () => {
    const themeBorderWidth: BorderWidthValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@borderWidth.xlarge",
    }

    const result = resolveBorderWidth({
      borderWidth: themeBorderWidth,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should throw error for computed values", () => {
    const computedBorderWidth = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.borderWidth", factor: 1.5 },
      },
    }

    expect(() => {
      resolveBorderWidth({
        borderWidth: computedBorderWidth as BorderWidthValue,
        theme: testTheme,
      })
    }).toThrow("Invalid border width type computed")
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeBorderWidth = {
      type: ValueType.THEME_ORDINAL,
      value: "@borderWidth.nonexistent",
    }

    expect(() => {
      resolveBorderWidth({
        borderWidth: invalidThemeBorderWidth as BorderWidthValue,
        theme: testTheme,
      })
    }).toThrow("Theme value @borderWidth.nonexistent not found")
  })

  it("should throw error for invalid border width types", () => {
    const invalidBorderWidth = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveBorderWidth({
        borderWidth: invalidBorderWidth as BorderWidthValue,
        theme: testTheme,
      })
    }).toThrow("Invalid border width type INVALID")
  })
})
