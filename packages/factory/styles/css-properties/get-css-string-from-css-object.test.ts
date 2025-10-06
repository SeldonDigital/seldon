import { describe, expect, it } from "bun:test"
import { getCssStringFromCssObject } from "./get-css-string-from-css-object"

describe("getCssStringFromCssObject", () => {
  it("should convert basic CSS object to CSS string", () => {
    const cssObject = {
      color: "#ff0000",
      backgroundColor: "#ffffff",
      fontSize: "16px",
    }

    const result = getCssStringFromCssObject(cssObject, "button")

    expect(result).toBe(
      ".button {color: #ff0000;\nbackground-color: #ffffff;\nfont-size: 16px;}",
    )
  })

  it("should handle empty CSS object", () => {
    const cssObject = {}

    const result = getCssStringFromCssObject(cssObject, "empty")

    expect(result).toBe("")
  })

  it("should convert camelCase properties to kebab-case", () => {
    const cssObject = {
      backgroundColor: "#ffffff",
      fontSize: "16px",
      marginTop: "10px",
      borderLeftWidth: "2px",
    }

    const result = getCssStringFromCssObject(cssObject, "element")

    expect(result).toBe(
      ".element {background-color: #ffffff;\nfont-size: 16px;\nmargin-top: 10px;\nborder-left-width: 2px;}",
    )
  })

  it("should handle single property", () => {
    const cssObject = {
      color: "red",
    }

    const result = getCssStringFromCssObject(cssObject, "text")

    expect(result).toBe(".text {color: red;}")
  })

  it("should filter out undefined values", () => {
    const cssObject = {
      color: "red",
      backgroundColor: undefined,
      fontSize: "16px",
    }

    const result = getCssStringFromCssObject(cssObject, "mixed")

    expect(result).toBe(".mixed {color: red;\nfont-size: 16px;}")
  })

  it("should filter out null values", () => {
    const cssObject = {
      color: "red",
      backgroundColor: null,
      fontSize: "16px",
    }

    const result = getCssStringFromCssObject(cssObject, "mixed")

    expect(result).toBe(".mixed {color: red;\nfont-size: 16px;}")
  })

  it("should handle all undefined values", () => {
    const cssObject = {
      color: undefined,
      backgroundColor: null,
      fontSize: undefined,
    }

    const result = getCssStringFromCssObject(cssObject, "empty")

    expect(result).toBe(".empty {}")
  })

  it("should handle numeric values", () => {
    const cssObject = {
      opacity: 0.5,
      zIndex: 999,
      fontWeight: 600,
    }

    const result = getCssStringFromCssObject(cssObject, "overlay")

    expect(result).toBe(
      ".overlay {opacity: 0.5;\nz-index: 999;\nfont-weight: 600;}",
    )
  })

  it("should handle zero values", () => {
    const cssObject = {
      margin: "0",
      padding: "0px",
      opacity: 0,
    }

    const result = getCssStringFromCssObject(cssObject, "zero")

    expect(result).toBe(".zero {margin: 0;\npadding: 0px;\nopacity: 0;}")
  })

  it("should handle negative values", () => {
    const cssObject = {
      marginLeft: "-10px",
      zIndex: -1,
    }

    const result = getCssStringFromCssObject(cssObject, "negative")

    expect(result).toBe(".negative {margin-left: -10px;\nz-index: -1;}")
  })

  it("should handle CSS custom properties", () => {
    const cssObject = {
      color: "var(--primary-color)",
      backgroundColor: "var(--background-color)",
    }

    const result = getCssStringFromCssObject(cssObject, "themed")

    expect(result).toBe(
      ".themed {color: var(--primary-color);\nbackground-color: var(--background-color);}",
    )
  })

  it("should handle complex CSS values", () => {
    const cssObject = {
      background: "linear-gradient(45deg, #ff0000, #00ff00)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transform: "translateX(10px) rotate(45deg)",
    }

    const result = getCssStringFromCssObject(cssObject, "complex")

    expect(result).toBe(
      ".complex {background: linear-gradient(45deg, #ff0000, #00ff00);\nbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\ntransform: translateX(10px) rotate(45deg);}",
    )
  })

  it("should handle vendor-prefixed properties", () => {
    const cssObject = {
      transform: "rotate(45deg)",
      WebkitTransform: "rotate(45deg)",
    }

    const result = getCssStringFromCssObject(cssObject, "vendor")

    expect(result).toBe(
      ".vendor {transform: rotate(45deg);\nwebkit-transform: rotate(45deg);}",
    )
  })

  it("should handle class name with special characters", () => {
    const cssObject = {
      color: "blue",
    }

    const result = getCssStringFromCssObject(cssObject, "my-component-123")

    expect(result).toBe(".my-component-123 {color: blue;}")
  })

  it("should handle empty string class name", () => {
    const cssObject = {
      color: "red",
    }

    const result = getCssStringFromCssObject(cssObject, "")

    expect(result).toBe(". {color: red;}")
  })

  it("should handle class name with spaces", () => {
    const cssObject = {
      color: "blue",
    }

    const result = getCssStringFromCssObject(cssObject, "my class")

    expect(result).toBe(".my class {color: blue;}")
  })

  it("should handle class name with CSS selectors", () => {
    const cssObject = {
      color: "green",
    }

    const result = getCssStringFromCssObject(cssObject, "my:class[1]")

    expect(result).toBe(".my:class[1] {color: green;}")
  })

  it("should handle properties with quotes in values", () => {
    const cssObject = {
      content: '"Hello World"',
      fontFamily: "'Times New Roman', serif",
    }

    const result = getCssStringFromCssObject(cssObject, "quotes")

    expect(result).toBe(
      ".quotes {content: \"Hello World\";\nfont-family: 'Times New Roman', serif;}",
    )
  })

  it("should handle properties with calc() functions", () => {
    const cssObject = {
      width: "calc(100% - 20px)",
      height: "calc(100vh - 2rem)",
    }

    const result = getCssStringFromCssObject(cssObject, "calc")

    expect(result).toBe(
      ".calc {width: calc(100% - 20px);\nheight: calc(100vh - 2rem);}",
    )
  })

  it("should handle properties with scientific notation", () => {
    const cssObject = {
      opacity: 1e-2,
      zIndex: 1e3,
    }

    const result = getCssStringFromCssObject(cssObject, "scientific")

    expect(result).toBe(".scientific {opacity: 0.01;\nz-index: 1000;}")
  })

  it("should handle properties with fractional numbers", () => {
    const cssObject = {
      lineHeight: 1.5,
      letterSpacing: "0.1",
    }

    const result = getCssStringFromCssObject(cssObject, "fractional")

    expect(result).toBe(".fractional {line-height: 1.5;\nletter-spacing: 0.1;}")
  })

  it("should handle properties with negative fractional numbers", () => {
    const cssObject = {
      marginLeft: "-0.5",
    }

    const result = getCssStringFromCssObject(cssObject, "negative-fractional")

    expect(result).toBe(".negative-fractional {margin-left: -0.5;}")
  })

  it("should handle class name with unicode characters", () => {
    const cssObject = {
      color: "teal",
    }

    const result = getCssStringFromCssObject(cssObject, "café")

    expect(result).toBe(".café {color: teal;}")
  })

  it("should handle class name with numbers at the beginning", () => {
    const cssObject = {
      color: "orange",
    }

    const result = getCssStringFromCssObject(cssObject, "123class")

    expect(result).toBe(".123class {color: orange;}")
  })
})
