import { describe, expect, it } from "bun:test"
import { HSL } from "../../properties/values/color/hsl"
import { RGB } from "../../properties/values/color/rgb"
import {
  hexToHSLObject,
  hexToHSLString,
  hexToRGBObject,
  hexToRGBString,
  rgbToHSL,
  toHSLString,
} from "./convert-color"

describe("toHSLString", () => {
  it("should return HSL string unchanged", () => {
    const hslString = "hsl(0, 100%, 50%)"
    const result = toHSLString(hslString)
    expect(result).toBe("hsl(0, 100%, 50%)")
  })

  it("should convert hex color to HSL string", () => {
    const hexColor = "#ff0000"
    const result = toHSLString(hexColor)
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should convert RGB string to HSL string", () => {
    const rgbString = "rgb(255, 0, 0)"
    const result = toHSLString(rgbString)
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should handle RGB string with spaces", () => {
    const rgbString = "rgb(255 0 0)"
    const result = toHSLString(rgbString)
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should handle RGB string without spaces", () => {
    const rgbString = "rgb(255,0,0)"
    const result = toHSLString(rgbString)
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should throw error for invalid color value", () => {
    const invalidColor = "invalid"

    expect(() => {
      toHSLString(invalidColor)
    }).toThrow("Invalid color value: invalid")
  })

  it("should throw error for RGBA color", () => {
    const rgbaColor = "rgba(255, 0, 0, 0.5)"

    expect(() => {
      toHSLString(rgbaColor)
    }).toThrow("Invalid color value: rgba(255, 0, 0, 0.5)")
  })

  it("should throw error for invalid hex color", () => {
    const invalidHex = "#gggggg"

    expect(() => {
      toHSLString(invalidHex)
    }).toThrow("Invalid color value: #gggggg")
  })

  it("should throw error for invalid RGB format", () => {
    const invalidRgb = "rgb(255, 0)"

    expect(() => {
      toHSLString(invalidRgb)
    }).toThrow("Invalid RGB value: rgb(255, 0)")
  })
})

describe("hexToHSLString", () => {
  it("should convert red hex to HSL string", () => {
    const hexColor = "#ff0000"
    const result = hexToHSLString(hexColor)
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should convert green hex to HSL string", () => {
    const hexColor = "#00ff00"
    const result = hexToHSLString(hexColor)
    expect(result).toBe("hsl(120 100% 50%)")
  })

  it("should convert blue hex to HSL string", () => {
    const hexColor = "#0000ff"
    const result = hexToHSLString(hexColor)
    expect(result).toBe("hsl(240 100% 50%)")
  })

  it("should convert white hex to HSL string", () => {
    const hexColor = "#ffffff"
    const result = hexToHSLString(hexColor)
    expect(result).toBe("hsl(0 0% 100%)")
  })

  it("should convert black hex to HSL string", () => {
    const hexColor = "#000000"
    const result = hexToHSLString(hexColor)
    expect(result).toBe("hsl(0 0% 0%)")
  })

  it("should convert gray hex to HSL string", () => {
    const hexColor = "#808080"
    const result = hexToHSLString(hexColor)
    expect(result).toBe("hsl(0 0% 50%)")
  })
})

describe("hexToHSLObject", () => {
  it("should convert hex to HSL object", () => {
    const hexColor = "#ff0000"
    const result = hexToHSLObject(hexColor)
    expect(result).toEqual({ hue: 0, saturation: 100, lightness: 50 })
  })

  it("should convert green hex to HSL object", () => {
    const hexColor = "#00ff00"
    const result = hexToHSLObject(hexColor)
    expect(result).toEqual({ hue: 120, saturation: 100, lightness: 50 })
  })

  it("should convert blue hex to HSL object", () => {
    const hexColor = "#0000ff"
    const result = hexToHSLObject(hexColor)
    expect(result).toEqual({ hue: 240, saturation: 100, lightness: 50 })
  })
})

describe("rgbToHSL", () => {
  it("should convert red RGB to HSL", () => {
    const rgb: RGB = { red: 255, green: 0, blue: 0 }
    const result = rgbToHSL(rgb)
    expect(result).toEqual({ hue: 0, saturation: 100, lightness: 50 })
  })

  it("should convert green RGB to HSL", () => {
    const rgb: RGB = { red: 0, green: 255, blue: 0 }
    const result = rgbToHSL(rgb)
    expect(result).toEqual({ hue: 120, saturation: 100, lightness: 50 })
  })

  it("should convert blue RGB to HSL", () => {
    const rgb: RGB = { red: 0, green: 0, blue: 255 }
    const result = rgbToHSL(rgb)
    expect(result).toEqual({ hue: 240, saturation: 100, lightness: 50 })
  })

  it("should convert white RGB to HSL", () => {
    const rgb: RGB = { red: 255, green: 255, blue: 255 }
    const result = rgbToHSL(rgb)
    expect(result).toEqual({ hue: 0, saturation: 0, lightness: 100 })
  })

  it("should convert black RGB to HSL", () => {
    const rgb: RGB = { red: 0, green: 0, blue: 0 }
    const result = rgbToHSL(rgb)
    expect(result).toEqual({ hue: 0, saturation: 0, lightness: 0 })
  })

  it("should convert gray RGB to HSL", () => {
    const rgb: RGB = { red: 128, green: 128, blue: 128 }
    const result = rgbToHSL(rgb)
    expect(result).toEqual({ hue: 0, saturation: 0, lightness: 50 })
  })
})

describe("hexToRGBString", () => {
  it("should convert red hex to RGB string", () => {
    const hexColor = "#ff0000"
    const result = hexToRGBString(hexColor)
    expect(result).toBe("rgb(255, 0, 0)")
  })

  it("should convert green hex to RGB string", () => {
    const hexColor = "#00ff00"
    const result = hexToRGBString(hexColor)
    expect(result).toBe("rgb(0, 255, 0)")
  })

  it("should convert blue hex to RGB string", () => {
    const hexColor = "#0000ff"
    const result = hexToRGBString(hexColor)
    expect(result).toBe("rgb(0, 0, 255)")
  })

  it("should convert white hex to RGB string", () => {
    const hexColor = "#ffffff"
    const result = hexToRGBString(hexColor)
    expect(result).toBe("rgb(255, 255, 255)")
  })

  it("should convert black hex to RGB string", () => {
    const hexColor = "#000000"
    const result = hexToRGBString(hexColor)
    expect(result).toBe("rgb(0, 0, 0)")
  })

  it("should convert uppercase hex to RGB string", () => {
    const hexColor = "#ABCDEF"
    const result = hexToRGBString(hexColor)
    expect(result).toBe("rgb(171, 205, 239)")
  })
})

describe("hexToRGBObject", () => {
  it("should convert hex to RGB object", () => {
    const hexColor = "#ff0000"
    const result = hexToRGBObject(hexColor)
    expect(result).toEqual({ red: 255, green: 0, blue: 0 })
  })

  it("should convert green hex to RGB object", () => {
    const hexColor = "#00ff00"
    const result = hexToRGBObject(hexColor)
    expect(result).toEqual({ red: 0, green: 255, blue: 0 })
  })

  it("should convert blue hex to RGB object", () => {
    const hexColor = "#0000ff"
    const result = hexToRGBObject(hexColor)
    expect(result).toEqual({ red: 0, green: 0, blue: 255 })
  })

  it("should convert mixed case hex to RGB object", () => {
    const hexColor = "#AbCdEf"
    const result = hexToRGBObject(hexColor)
    expect(result).toEqual({ red: 171, green: 205, blue: 239 })
  })
})
