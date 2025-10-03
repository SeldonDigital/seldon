import { describe, expect, it } from "bun:test"
import { PropertyKey } from "../../../properties/types/properties"
import { isCompoundProperty } from "./is-compound-property"

describe("isCompoundProperty", () => {
  it("should return true for compound properties", () => {
    const compoundProperties = [
      "background",
      "border",
      "corners",
      "font",
      "gradient",
      "margin",
      "padding",
      "position",
      "shadow",
    ]

    compoundProperties.forEach((property) => {
      expect(isCompoundProperty(property as PropertyKey)).toBe(true)
    })
  })

  it("should return false for non-compound properties", () => {
    const nonCompoundProperties = [
      "color",
      "accentColor",
      "width",
      "height",
      "size",
      "textAlign",
      "textCase",
      "textDecoration",
      "checked",
      "clip",
      "ariaHidden",
      "wrapChildren",
      "wrapText",
      "content",
      "altText",
      "ariaLabel",
      "placeholder",
      "columns",
      "rows",
      "lines",
      "letterSpacing",
      "opacity",
      "brightness",
      "rotation",
      "display",
      "direction",
      "orientation",
      "scroll",
      "scrollbarStyle",
      "cursor",
      "borderCollapse",
      "align",
      "cellAlign",
      "gap",
      "htmlElement",
      "symbol",
      "imageFit",
      "source",
      "inputType",
      "screenWidth",
      "screenHeight",
      "buttonSize",
    ]

    nonCompoundProperties.forEach((property) => {
      expect(isCompoundProperty(property as PropertyKey)).toBe(false)
    })
  })

  it("should return false for invalid inputs", () => {
    const invalidInputs = [
      "",
      null,
      undefined,
      123,
      true,
      {},
      "backgrounds",
      "borders",
      "fonts",
      "shadows",
      "margins",
      "paddings",
      "Background",
      "BORDER",
      "Font",
      "SHADOW",
      "back",
      "bor",
      "fon",
      "sha",
    ]

    invalidInputs.forEach((input) => {
      expect(isCompoundProperty(input as unknown as PropertyKey)).toBe(false)
    })
  })

  it("should narrow types correctly for compound properties", () => {
    const propertyKey = "background"

    if (isCompoundProperty(propertyKey)) {
      expect(propertyKey).toBe("background")
    }
  })

  it("should narrow types correctly for non-compound properties", () => {
    const propertyKey = "color"

    if (!isCompoundProperty(propertyKey)) {
      expect(propertyKey).toBe("color")
    }
  })
})
