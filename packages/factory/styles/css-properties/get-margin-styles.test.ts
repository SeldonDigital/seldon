import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getMarginStyles } from "./get-margin-styles"

describe("getMarginStyles", () => {
  it("should return empty object when margin is not in properties", () => {
    const properties = {}

    expect(getMarginStyles({ properties, theme: testTheme })).toEqual({})
  })

  it("should handle pixel values", () => {
    const properties: Properties = {
      margin: {
        top: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        right: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        bottom: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        left: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
      },
    }
    expect(getMarginStyles({ properties, theme: testTheme })).toEqual({
      marginTop: "4px",
      marginRight: "4px",
      marginBottom: "4px",
      marginLeft: "4px",
    })
  })

  it("should handle rem values", () => {
    const properties: Properties = {
      margin: {
        top: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
        right: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
        bottom: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
        left: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
      },
    }
    expect(getMarginStyles({ properties, theme: testTheme })).toEqual({
      marginTop: "4rem",
      marginRight: "4rem",
      marginBottom: "4rem",
      marginLeft: "4rem",
    })
  })

  it("should handle theme ordinal values", () => {
    const properties: Properties = {
      margin: {
        top: { type: ValueType.THEME_ORDINAL, value: "@margin.tight" },
        right: { type: ValueType.THEME_ORDINAL, value: "@margin.tight" },
        bottom: { type: ValueType.THEME_ORDINAL, value: "@margin.tight" },
        left: { type: ValueType.THEME_ORDINAL, value: "@margin.tight" },
      },
    }
    expect(getMarginStyles({ properties, theme: testTheme })).toEqual({
      marginTop: "0.25rem",
      marginRight: "0.25rem",
      marginBottom: "0.25rem",
      marginLeft: "0.25rem",
    })
  })

  it("should handle single margin value", () => {
    const properties: Properties = {
      margin: {
        top: { type: ValueType.THEME_ORDINAL, value: "@margin.tight" },
      },
    }
    expect(getMarginStyles({ properties, theme: testTheme })).toEqual({
      marginTop: "0.25rem",
    })
  })
})
