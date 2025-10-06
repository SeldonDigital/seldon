import { describe, expect, it } from "bun:test"
import { Orientation, Properties, Resize, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { StyleGenerationContext } from "../types"
import { getSizeStyles } from "./get-size-styles"

// Helper function to create properly typed context
function createContext(
  properties: Record<string, unknown>,
): StyleGenerationContext {
  return {
    properties: properties as Properties,
    parentContext: null,
    theme: testTheme,
  }
}

// Helper function to create context with parent
function createContextWithParent(
  properties: Record<string, unknown>,
  parentProperties: Record<string, unknown>,
): StyleGenerationContext {
  return {
    properties: properties as Properties,
    parentContext: {
      properties: parentProperties as Properties,
      parentContext: null,
      theme: testTheme,
    },
    theme: testTheme,
  }
}

describe("getSizeStyles", () => {
  it("should return empty object for empty properties", () => {
    const context = createContext({})

    const result = getSizeStyles(context)

    expect(result).toEqual({})
  })

  it("should generate width style for exact screenWidth values", () => {
    const context = createContext({
      screenWidth: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 200 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toEqual({
      width: "200px",
    })
  })

  it("should generate height style for exact screenHeight values", () => {
    const context = createContext({
      screenHeight: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 100 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toEqual({
      height: "100px",
    })
  })

  it("should generate width 100% for FILL screenWidth preset", () => {
    const context = createContext({
      screenWidth: {
        type: ValueType.PRESET,
        value: Resize.FILL,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "100%")
  })

  it("should generate width fit-content for non-FILL screenWidth preset", () => {
    const context = createContext({
      screenWidth: {
        type: ValueType.PRESET,
        value: Resize.FIT,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "fit-content")
  })

  it("should generate height 100% for FILL screenHeight preset", () => {
    const context = createContext({
      screenHeight: {
        type: ValueType.PRESET,
        value: Resize.FILL,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "100%")
  })

  it("should generate height fit-content for non-FILL screenHeight preset", () => {
    const context = createContext({
      screenHeight: {
        type: ValueType.PRESET,
        value: Resize.FIT,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "fit-content")
  })

  it("should generate width style for exact width values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 150 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "150px")
  })

  it("should generate height style for exact height values", () => {
    const context = createContext({
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 75 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "75px")
  })

  it("should generate width style for rem values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 10 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "10rem")
  })

  it("should generate height style for rem values", () => {
    const context = createContext({
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 5 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "5rem")
  })

  it("should generate width style for percentage values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 50 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "50%")
  })

  it("should generate height style for percentage values", () => {
    const context = createContext({
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 75 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "75%")
  })

  it("should generate width style for theme ordinal values", () => {
    const context = createContext({
      width: {
        type: ValueType.THEME_ORDINAL,
        value: "@size.medium",
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width")
    expect(result.width).toContain("rem")
  })

  it("should generate height style for theme ordinal values", () => {
    const context = createContext({
      height: {
        type: ValueType.THEME_ORDINAL,
        value: "@size.large",
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height")
    expect(result.height).toContain("rem")
  })

  it("should generate alignSelf stretch for FILL width in vertical parent", () => {
    const context = createContextWithParent(
      {
        width: {
          type: ValueType.PRESET,
          value: Resize.FILL,
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("alignSelf", "stretch")
  })

  it("should generate flex 1 0 0 for FILL width in horizontal parent", () => {
    const context = createContextWithParent(
      {
        width: {
          type: ValueType.PRESET,
          value: Resize.FILL,
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("flex", "1 0 0")
  })

  it("should generate alignSelf stretch for FILL height in horizontal parent", () => {
    const context = createContextWithParent(
      {
        height: {
          type: ValueType.PRESET,
          value: Resize.FILL,
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("alignSelf", "stretch")
  })

  it("should generate flex 1 0 0 for FILL height in vertical parent", () => {
    const context = createContextWithParent(
      {
        height: {
          type: ValueType.PRESET,
          value: Resize.FILL,
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("flex", "1 0 0")
  })

  it("should generate width fit-content for FIT width preset", () => {
    const context = createContext({
      width: {
        type: ValueType.PRESET,
        value: Resize.FIT,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "fit-content")
  })

  it("should generate height fit-content for FIT height preset", () => {
    const context = createContext({
      height: {
        type: ValueType.PRESET,
        value: Resize.FIT,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "fit-content")
  })

  it("should generate alignSelf stretch for empty width in vertical parent", () => {
    const context = createContextWithParent(
      {
        width: undefined,
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("alignSelf", "stretch")
  })

  it("should generate flex 1 0 0 for empty width in horizontal parent", () => {
    const context = createContextWithParent(
      {
        width: undefined,
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("flex", "1 0 0")
  })

  it("should generate height fit-content for empty height", () => {
    const context = createContext({
      height: undefined,
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "fit-content")
  })

  it("should generate flexShrink 0 for exact width in horizontal parent", () => {
    const context = createContextWithParent(
      {
        width: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 100 },
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "100px")
    expect(result).toHaveProperty("flexShrink", 0)
  })

  it("should generate flexShrink 0 for exact height in vertical parent", () => {
    const context = createContextWithParent(
      {
        height: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 100 },
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("height", "100px")
    expect(result).toHaveProperty("flexShrink", 0)
  })

  it("should ignore width when position left and right are set", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 100 },
      },
      position: {
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
      },
    })

    const result = getSizeStyles(context)

    expect(result).not.toHaveProperty("width")
  })

  it("should ignore height when position top and bottom are set", () => {
    const context = createContext({
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 100 },
      },
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
      },
    })

    const result = getSizeStyles(context)

    expect(result).not.toHaveProperty("height")
  })

  it("should handle zero values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0 },
      },
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "0px")
    expect(result).toHaveProperty("height", "0px")
  })

  it("should handle negative values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: -10 },
      },
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: -20 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "-10px")
    expect(result).toHaveProperty("height", "-20px")
  })

  it("should handle decimal values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 100.5 },
      },
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 200.25 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "100.5px")
    expect(result).toHaveProperty("height", "200.25px")
  })

  it("should handle large values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 9999 },
      },
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 10000 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "9999px")
    expect(result).toHaveProperty("height", "10000px")
  })

  it("should handle complex size with all properties", () => {
    const context = createContextWithParent(
      {
        screenWidth: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 800 },
        },
        screenHeight: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 600 },
        },
        width: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 200 },
        },
        height: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 100 },
        },
      },
      {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
      },
    )

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "200px")
    expect(result).toHaveProperty("height", "100px")
    expect(result).toHaveProperty("flexShrink", 0)
  })

  it("should handle empty size values", () => {
    const context = createContext({
      width: {
        type: ValueType.EMPTY,
        value: null,
      },
      height: {
        type: ValueType.EMPTY,
        value: null,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toEqual({})
  })

  it("should handle undefined size properties", () => {
    const context = createContext({
      width: undefined,
      height: undefined,
      screenWidth: undefined,
      screenHeight: undefined,
    })

    const result = getSizeStyles(context)

    expect(result).toEqual({
      alignSelf: "stretch",
      height: "fit-content",
    })
  })

  it("should handle very small size values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0.1 },
      },
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0.5 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "0.1px")
    expect(result).toHaveProperty("height", "0.5px")
  })

  it("should handle zero size values", () => {
    const context = createContext({
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0 },
      },
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0 },
      },
    })

    const result = getSizeStyles(context)

    expect(result).toHaveProperty("width", "0px")
    expect(result).toHaveProperty("height", "0px")
  })

  it("should handle invalid size values gracefully", () => {
    const context = createContext({
      width: {
        type: ValueType.EMPTY,
        value: null,
      },
      height: {
        type: ValueType.EMPTY,
        value: null,
      },
    })

    const result = getSizeStyles(context)

    expect(result).toEqual({})
  })
})
