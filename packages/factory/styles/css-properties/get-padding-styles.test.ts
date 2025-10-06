import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getPaddingStyles } from "./get-padding-styles"

describe("getPaddingStyles", () => {
  it("should return empty object when padding is not in properties", () => {
    const properties = {}

    expect(getPaddingStyles({ properties, theme: testTheme })).toEqual({})
  })

  it("should handle pixel values", () => {
    const properties: Properties = {
      padding: {
        top: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        right: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        bottom: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
        left: { type: ValueType.EXACT, value: { value: 4, unit: Unit.PX } },
      },
    }
    expect(getPaddingStyles({ properties, theme: testTheme })).toEqual({
      paddingTop: "4px",
      paddingRight: "4px",
      paddingBottom: "4px",
      paddingLeft: "4px",
    })
  })

  it("should handle rem values", () => {
    const properties: Properties = {
      padding: {
        top: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
        right: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
        bottom: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
        left: { type: ValueType.EXACT, value: { value: 4, unit: Unit.REM } },
      },
    }
    expect(getPaddingStyles({ properties, theme: testTheme })).toEqual({
      paddingTop: "4rem",
      paddingRight: "4rem",
      paddingBottom: "4rem",
      paddingLeft: "4rem",
    })
  })

  it("should handle theme ordinal values", () => {
    const properties: Properties = {
      padding: {
        top: { type: ValueType.THEME_ORDINAL, value: "@padding.tight" },
        right: { type: ValueType.THEME_ORDINAL, value: "@padding.tight" },
        bottom: { type: ValueType.THEME_ORDINAL, value: "@padding.tight" },
        left: { type: ValueType.THEME_ORDINAL, value: "@padding.tight" },
      },
    }
    expect(getPaddingStyles({ properties, theme: testTheme })).toEqual({
      paddingTop: "0.25rem",
      paddingRight: "0.25rem",
      paddingBottom: "0.25rem",
      paddingLeft: "0.25rem",
    })
  })

  it("should handle single padding value", () => {
    const properties: Properties = {
      padding: {
        top: { type: ValueType.THEME_ORDINAL, value: "@padding.tight" },
      },
    }
    expect(getPaddingStyles({ properties, theme: testTheme })).toEqual({
      paddingTop: "0.25rem",
    })
  })
})
