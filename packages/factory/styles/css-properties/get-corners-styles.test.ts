import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getCornersStyles } from "./get-corners-styles"

describe("getCornersStyles", () => {
  it("should return empty object when corners is not in properties", () => {
    const properties = {}

    expect(getCornersStyles({ properties, theme: testTheme })).toEqual({})
  })

  it("should handle pixel values", () => {
    const properties: Properties = {
      corners: {
        topLeft: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.PX },
        },
        bottomLeft: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.PX },
        },
        bottomRight: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.PX },
        },
        topRight: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.PX },
        },
      },
    }
    expect(getCornersStyles({ properties, theme: testTheme })).toEqual({
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
    })
  })

  it("should handle rem values", () => {
    const properties: Properties = {
      corners: {
        topLeft: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.REM },
        },
        bottomLeft: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.REM },
        },
        bottomRight: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.REM },
        },
        topRight: {
          type: ValueType.EXACT,
          value: { value: 4, unit: Unit.REM },
        },
      },
    }
    expect(getCornersStyles({ properties, theme: testTheme })).toEqual({
      borderTopLeftRadius: "4rem",
      borderBottomLeftRadius: "4rem",
      borderTopRightRadius: "4rem",
      borderBottomRightRadius: "4rem",
    })
  })

  it("should handle theme ordinal values", () => {
    const properties: Properties = {
      corners: {
        topLeft: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.tight",
        },
        bottomLeft: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.tight",
        },
        bottomRight: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.tight",
        },
        topRight: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.tight",
        },
      },
    }
    expect(getCornersStyles({ properties, theme: testTheme })).toEqual({
      borderBottomLeftRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
      borderTopLeftRadius: "0.25rem",
      borderTopRightRadius: "0.25rem",
    })
  })

  it("should handle single corner value", () => {
    const properties: Properties = {
      corners: {
        topLeft: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.tight",
        },
      },
    }
    expect(getCornersStyles({ properties, theme: testTheme })).toEqual({
      borderTopLeftRadius: "0.25rem",
    })
  })
})
