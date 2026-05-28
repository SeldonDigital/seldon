import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import { validatePropertyValue } from "@seldon/core/properties/schemas/helpers"
import { serializeColor } from "./serialize-color"
import { serializeValue } from "./serialize-value"

describe("serializeColor", () => {
  it('should return null for empty, "none", or "default" values', () => {
    expect(serializeColor("")).toEqual({ type: ValueType.EMPTY, value: null })
    expect(serializeColor("none")).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
    expect(serializeColor("default")).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
  })

  // Assuming isThemeValue, isHSLString, isHex, isPx, isRem, isNumber are available in the same scope
  it("should return correct type and value for theme value", () => {
    expect(serializeColor("@swatch.background")).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.background",
    })
  })

  it("should return correct type and value for HSL string", () => {
    expect(serializeColor("hsl(0, 100%, 50%)")).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 100, lightness: 50 },
    })
  })

  it("should return correct type and value for RGB string", () => {
    expect(serializeColor("rgb(255, 0, 0)")).toEqual({
      type: ValueType.EXACT,
      value: { red: 255, green: 0, blue: 0 },
    })
  })

  it("should return correct type and value for LCH string", () => {
    expect(serializeColor("lch(50% 100 120deg)")).toEqual({
      type: ValueType.EXACT,
      value: { lightness: 50, chroma: 100, hue: 120 },
    })
  })

  it("should return correct type and value for comma-separated LCH string", () => {
    expect(serializeColor("lch(50, 100, 120)")).toEqual({
      type: ValueType.EXACT,
      value: { lightness: 50, chroma: 100, hue: 120 },
    })
  })

  it("should return correct type and value for hex value", () => {
    expect(serializeColor("#ffffff")).toEqual({
      type: ValueType.EXACT,
      value: "#FFFFFF",
    })
  })

  it("should throw error for unknown value type", () => {
    expect(() => serializeColor("unknown")).toThrow(TypeError)
  })

  it("should throw error for invalid RGB values (out of range)", () => {
    expect(() => serializeColor("rgb(0 0 256)")).toThrow()
    expect(() => serializeColor("rgb(300 0 0)")).toThrow()
    expect(() => serializeColor("rgb(0 0 0 0)")).toThrow()
  })

  it("should throw error for invalid HSL values (out of range)", () => {
    expect(() => serializeColor("hsl(400, 50%, 50%)")).toThrow()
    expect(() => serializeColor("hsl(180, 150%, 50%)")).toThrow()
    expect(() => serializeColor("hsl(180, 50%, 150%)")).toThrow()
  })

  it("should throw error for invalid LCH values (out of range)", () => {
    expect(() => serializeColor("lch(150% 200 120deg)")).toThrow()
    expect(() => serializeColor("lch(50% 200 120deg)")).toThrow()
  })
})

describe("serializeValue with color properties", () => {
  it("should store invalid colors as string values instead of throwing", () => {
    // Invalid RGB value should be stored as string, not throw
    const result = serializeValue("rgb(0 0 290)", undefined, undefined, "color")
    expect(result).toEqual({
      type: "exact",
      value: "rgb(0 0 290)",
    })

    // Invalid HSL value should be stored as string, not throw
    const result2 = serializeValue(
      "hsl(400, 50%, 50%)",
      undefined,
      undefined,
      "color",
    )
    expect(result2).toEqual({
      type: "exact",
      value: "hsl(400, 50%, 50%)",
    })
  })
})

describe("property error detection", () => {
  it("should detect invalid color values using schema validation", () => {
    // Test invalid RGB using schema validation
    expect(validatePropertyValue("color", "exact", "rgb(0 0 290)")).toBe(false)

    // Test invalid HSL using schema validation
    expect(validatePropertyValue("color", "exact", "hsl(400, 50%, 50%)")).toBe(
      false,
    )

    // Test invalid LCH using schema validation
    expect(
      validatePropertyValue("color", "exact", "lch(150% 200 120deg)"),
    ).toBe(false)

    // Test valid colors using schema validation
    expect(validatePropertyValue("color", "exact", "rgb(0 0 255)")).toBe(true)
    expect(validatePropertyValue("color", "exact", "hsl(180, 50%, 50%)")).toBe(
      true,
    )
    expect(validatePropertyValue("color", "exact", "lch(50% 100 180deg)")).toBe(
      true,
    )
    expect(validatePropertyValue("color", "exact", "#ff0000")).toBe(true)
  })
})
