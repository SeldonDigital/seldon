import { describe, expect, it } from "bun:test"
import {
  ComputedFunction,
  Direction,
  Gap,
  Orientation,
  Unit,
  ValueType,
} from "@seldon/core"
import { Align } from "@seldon/core/properties"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getLayoutStyles } from "./get-layout-styles"

describe("getLayoutStyles", () => {
  it("should return empty object for empty properties", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should generate flexWrap style for wrapChildren", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        wrapChildren: {
          type: ValueType.EXACT,
          value: true,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("flexWrap", "wrap")
  })

  it("should generate flexWrap nowrap for wrapChildren false", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        wrapChildren: {
          type: ValueType.EXACT,
          value: false,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("flexWrap", "nowrap")
  })

  it("should generate display flex and flexDirection row for horizontal orientation", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "row")
  })

  it("should generate display flex and flexDirection column for vertical orientation", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "column")
  })

  it("should generate align styles for center alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.CENTER,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "center")
    expect(result).toHaveProperty("justifyContent", "center")
  })

  it("should generate align styles for top-left alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.TOP_LEFT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "start")
    expect(result).toHaveProperty("justifyContent", "start")
  })

  it("should generate align styles for bottom-right alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.BOTTOM_RIGHT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "end")
    expect(result).toHaveProperty("justifyContent", "end")
  })

  it("should generate align styles for left alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.CENTER_LEFT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "start")
    expect(result).toHaveProperty("justifyContent", "center")
  })

  it("should generate align styles for right alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.CENTER_RIGHT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "end")
    expect(result).toHaveProperty("justifyContent", "center")
  })

  it("should generate align styles for top-center alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.TOP_CENTER,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "center")
    expect(result).toHaveProperty("justifyContent", "start")
  })

  it("should generate align styles for bottom-center alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.BOTTOM_CENTER,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "center")
    expect(result).toHaveProperty("justifyContent", "end")
  })

  it("should generate align styles for auto alignment", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        align: {
          type: ValueType.PRESET,
          value: Align.AUTO,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "normal")
    expect(result).toHaveProperty("justifyContent", "normal")
  })

  it("should handle RTL direction with horizontal orientation", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        direction: {
          type: ValueType.PRESET,
          value: Direction.RTL,
        },
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
        align: {
          type: ValueType.PRESET,
          value: Align.CENTER_LEFT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "row")
    expect(result).toHaveProperty("alignItems", "center")
    expect(result).toHaveProperty("justifyContent", "end")
  })

  it("should handle RTL direction with vertical orientation", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        direction: {
          type: ValueType.PRESET,
          value: Direction.RTL,
        },
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
        align: {
          type: ValueType.PRESET,
          value: Align.CENTER_LEFT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "column")
    expect(result).toHaveProperty("alignItems", "end")
    expect(result).toHaveProperty("justifyContent", "center")
  })

  it("should generate gap style for exact values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "16px")
  })

  it("should generate gap style for rem values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1.5 },
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "1.5rem")
  })

  it("should generate gap style for rem values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 2 },
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "2rem")
  })

  it("should generate gap style for evenly spaced preset", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.PRESET,
          value: Gap.EVENLY_SPACED,
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "auto")
    expect(result).toHaveProperty("justifyContent", "space-between")
  })

  it("should generate gap style for theme ordinal values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.THEME_ORDINAL,
          value: "@gap.cozy",
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap")
    expect(result.gap).toContain("rem")
  })

  it("should throw error for unknown gap preset", () => {
    expect(() => {
      getLayoutStyles({
        computedProperties: {
          gap: {
            type: ValueType.PRESET,
            // @ts-expect-error - Testing invalid preset value
            value: "unknown",
          },
        },
        nodeProperties: {},
        theme: testTheme,
      })
    }).toThrow("Unknown gap preset: unknown")
  })

  it("should handle complex layout with all properties", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 20 },
        },
      },
      nodeProperties: {
        direction: {
          type: ValueType.PRESET,
          value: Direction.LTR,
        },
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
        align: {
          type: ValueType.PRESET,
          value: Align.CENTER,
        },
        wrapChildren: {
          type: ValueType.EXACT,
          value: true,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "row")
    expect(result).toHaveProperty("alignItems", "center")
    expect(result).toHaveProperty("justifyContent", "center")
    expect(result).toHaveProperty("flexWrap", "wrap")
    expect(result).toHaveProperty("gap", "20px")
  })

  it("should handle vertical orientation with RTL", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        direction: {
          type: ValueType.PRESET,
          value: Direction.RTL,
        },
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.VERTICAL,
        },
        align: {
          type: ValueType.PRESET,
          value: Align.TOP_RIGHT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "column")
    expect(result).toHaveProperty("alignItems", "start")
    expect(result).toHaveProperty("justifyContent", "start")
  })

  it("should handle horizontal orientation with RTL", () => {
    const result = getLayoutStyles({
      computedProperties: {},
      nodeProperties: {
        direction: {
          type: ValueType.PRESET,
          value: Direction.RTL,
        },
        orientation: {
          type: ValueType.PRESET,
          value: Orientation.HORIZONTAL,
        },
        align: {
          type: ValueType.PRESET,
          value: Align.TOP_RIGHT,
        },
      },
      theme: testTheme,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("flexDirection", "row")
    expect(result).toHaveProperty("alignItems", "start")
    expect(result).toHaveProperty("justifyContent", "start")
  })

  it("should handle empty values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
      nodeProperties: {
        direction: {
          type: ValueType.EMPTY,
          value: null,
        },
        orientation: {
          type: ValueType.EMPTY,
          value: null,
        },
        align: {
          type: ValueType.EMPTY,
          value: null,
        },
        wrapChildren: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should handle zero gap values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0 },
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "0px")
  })

  it("should handle negative gap values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: -10 },
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "-10px")
  })

  it("should handle decimal gap values", () => {
    const result = getLayoutStyles({
      computedProperties: {
        gap: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12.5 },
        },
      },
      nodeProperties: {},
      theme: testTheme,
    })

    expect(result).toHaveProperty("gap", "12.5px")
  })
})
