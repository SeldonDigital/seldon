import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getPositionStyles } from "./get-position-styles"

describe("getPositionStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should return empty object when position is not defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should generate position styles for top value", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({
      top: "10px",
      position: "absolute",
    })
  })

  it("should generate position styles for right value", () => {
    const properties: Properties = {
      position: {
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 20 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("right", "20px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should generate position styles for bottom value", () => {
    const properties: Properties = {
      position: {
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 30 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("bottom", "30px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should generate position styles for left value", () => {
    const properties: Properties = {
      position: {
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 40 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("left", "40px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should generate position styles for all values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 20 },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 30 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 40 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "10px")
    expect(result).toHaveProperty("right", "20px")
    expect(result).toHaveProperty("bottom", "30px")
    expect(result).toHaveProperty("left", "40px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle rem values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1.5 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 2 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "1.5rem")
    expect(result).toHaveProperty("left", "2rem")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle rem values with decimals", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1.5 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 0.25 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "1.5rem")
    expect(result).toHaveProperty("left", "0.25rem")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle mixed pixel and rem values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "16px")
    expect(result).toHaveProperty("left", "1rem")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle zero values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "0px")
    expect(result).toHaveProperty("left", "0px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle negative values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: -10 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: -20 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "-10px")
    expect(result).toHaveProperty("left", "-20px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle decimal values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10.5 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1.25 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "10.5px")
    expect(result).toHaveProperty("right", "1.25rem")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle empty position values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EMPTY,
          value: null,
        },
        right: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle mixed empty and defined values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
        right: {
          type: ValueType.EMPTY,
          value: null,
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 20 },
        },
        left: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "10px")
    expect(result).toHaveProperty("bottom", "20px")
    expect(result).not.toHaveProperty("right")
    expect(result).not.toHaveProperty("left")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle large values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 9999 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10000 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "9999px")
    expect(result).toHaveProperty("left", "10000px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle very small values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0.1 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0.5 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "0.1px")
    expect(result).toHaveProperty("left", "0.5px")
    expect(result).toHaveProperty("position", "absolute")
  })

  it("should handle position with other properties", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 50 },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("top", "10px")
    expect(result).toHaveProperty("position", "absolute")
    expect(result).not.toHaveProperty("color")
    expect(result).not.toHaveProperty("opacity")
  })

  it("should handle position with only position property", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 15 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({
      top: "15px",
      position: "absolute",
    })
  })

  it("should handle empty position values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle negative position values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: -10 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({
      top: "-10px",
      position: "absolute",
    })
  })

  it("should handle zero position values", () => {
    const properties: Properties = {
      position: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0 },
        },
      },
    }

    const result = getPositionStyles({ properties, theme: testTheme })

    expect(result).toEqual({
      top: "0px",
      position: "absolute",
    })
  })
})
