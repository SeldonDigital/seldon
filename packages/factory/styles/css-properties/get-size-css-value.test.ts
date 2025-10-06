import { describe, expect, it } from "bun:test"
import { SizeValue, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getSizeCSSValue } from "./get-size-css-value"

describe("getSizeCSSValue", () => {
  it("should return CSS value for exact size with pixels", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 16 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("16px")
  })

  it("should return CSS value for exact size with rem", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.5 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("1.5rem")
  })

  it("should return CSS value for exact size with viewport units", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 50 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("50px")
  })

  it("should return CSS value for theme ordinal size", () => {
    const size: SizeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@size.medium",
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle zero values", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 0 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("0px")
  })

  it("should handle negative values", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: -10 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("-10px")
  })

  it("should handle decimal values", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 12.5 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("12.5px")
  })

  it("should handle different theme size values", () => {
    const size: SizeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@size.large",
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle parent context", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 20 },
    }

    const parentContext = {
      properties: {},
      parentContext: null,
      theme: testTheme,
    }

    const result = getSizeCSSValue({
      size,
      parentContext,
      theme: testTheme,
    })

    expect(result).toBe("20px")
  })

  it("should handle empty size value", () => {
    const size = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = getSizeCSSValue({
      size: size as SizeValue,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("")
  })

  it("should handle large size values", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 1000 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("1000px")
  })

  it("should handle very small size values", () => {
    const size: SizeValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 0.1 },
    }

    const result = getSizeCSSValue({
      size,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toBe("0.1px")
  })
})
