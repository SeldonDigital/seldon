import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getBackgroundStyles } from "./get-background-styles"

describe("getBackgroundStyles", () => {
  it("should combine gradient and background image when both are present", () => {
    const properties: Properties = {
      background: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@background.background1",
        },
      },
      gradient: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@gradient.primary",
        },
      },
    }

    const result = getBackgroundStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should return only background color when no gradient or image is present", () => {
    const properties: Properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const result = getBackgroundStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      backgroundColor: "hsl(0 0% 15%)",
    })
  })

  it("should return only gradient when no background image is present", () => {
    const properties: Properties = {
      gradient: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@gradient.primary",
        },
      },
    }

    const result = getBackgroundStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should return empty object when no background properties are set", () => {
    const properties: Properties = {}

    const result = getBackgroundStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })
})
