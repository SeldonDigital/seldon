import { describe, expect, it } from "vitest"

import { isHSLObject } from "./is-hsl-object"
import { isLCHObject } from "./is-lch-object"
import { isRGBObject } from "./is-rgb-object"

describe("isRGBObject", () => {
  it("accepts numeric red, green, blue", () => {
    expect(isRGBObject({ red: 255, green: 0, blue: 0 })).toBe(true)
  })

  it("rejects missing or non-numeric channels", () => {
    expect(isRGBObject({ red: 255, green: 0 })).toBe(false)
    expect(isRGBObject({ red: "255", green: 0, blue: 0 })).toBe(false)
    expect(isRGBObject(null)).toBe(false)
  })
})

describe("isHSLObject", () => {
  it("accepts numeric hue, saturation, lightness", () => {
    expect(isHSLObject({ hue: 120, saturation: 50, lightness: 50 })).toBe(true)
  })

  it("rejects other color shapes", () => {
    expect(isHSLObject({ red: 255, green: 0, blue: 0 })).toBe(false)
  })
})

describe("isLCHObject", () => {
  it("accepts numeric lightness, chroma, hue", () => {
    expect(isLCHObject({ lightness: 50, chroma: 100, hue: 120 })).toBe(true)
  })

  it("rejects other color shapes", () => {
    expect(isLCHObject({ hue: 120, saturation: 50, lightness: 50 })).toBe(false)
  })
})
