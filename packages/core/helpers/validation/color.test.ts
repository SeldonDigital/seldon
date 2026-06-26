import { describe, expect, it } from "vitest"

import {
  isHSLString,
  isHex,
  isHexWithoutHash,
  isLCHString,
  isRGBString,
  isValidColor,
} from "./color"

describe("isHex / isHexWithoutHash", () => {
  it("accepts 3 and 6 digit hex with a hash", () => {
    expect(isHex("#ff0000")).toBe(true)
    expect(isHex("#f00")).toBe(true)
  })

  it("requires a hash for isHex but not for isHexWithoutHash", () => {
    expect(isHex("ff0000")).toBe(false)
    expect(isHexWithoutHash("ff0000")).toBe(true)
  })

  it("rejects malformed hex", () => {
    expect(isHex("#xyz")).toBe(false)
    expect(isHex("#ff00")).toBe(false)
  })
})

describe("isHSLString", () => {
  it("accepts in-range hsl", () => {
    expect(isHSLString("hsl(120, 50%, 50%)")).toBe(true)
  })

  it("rejects out-of-range hue", () => {
    expect(isHSLString("hsl(400, 50%, 50%)")).toBe(false)
  })
})

describe("isRGBString", () => {
  it("accepts in-range rgb", () => {
    expect(isRGBString("rgb(255, 0, 0)")).toBe(true)
  })

  it("rejects out-of-range channels", () => {
    expect(isRGBString("rgb(256, 0, 0)")).toBe(false)
  })
})

describe("isLCHString", () => {
  it("accepts in-range lch", () => {
    expect(isLCHString("lch(50% 100 120deg)")).toBe(true)
  })

  it("rejects out-of-range chroma", () => {
    expect(isLCHString("lch(50% 200 120deg)")).toBe(false)
  })
})

describe("isValidColor", () => {
  it("accepts color strings and swatch tokens", () => {
    expect(isValidColor("#ff0000")).toBe(true)
    expect(isValidColor("rgb(255, 0, 0)")).toBe(true)
    expect(isValidColor("@swatch.primary")).toBe(true)
  })

  it("rejects non-swatch theme tokens and junk", () => {
    expect(isValidColor("@fontSize.medium")).toBe(false)
    expect(isValidColor("not-a-color")).toBe(false)
  })
})
