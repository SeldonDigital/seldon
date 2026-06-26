import { describe, expect, it } from "vitest"

import { HSLObjectToString } from "./hsl-object-to-string"
import { LCHObjectToString } from "./lch-object-to-string"

describe("HSLObjectToString", () => {
  const hsl = { hue: 120, saturation: 50, lightness: 50 }

  it("omits opacity at 100 or null", () => {
    expect(HSLObjectToString(hsl)).toBe("hsl(120 50% 50%)")
    expect(HSLObjectToString(hsl, null)).toBe("hsl(120 50% 50%)")
  })

  it("appends opacity below 100", () => {
    expect(HSLObjectToString(hsl, 80)).toBe("hsl(120 50% 50% / 80%)")
  })
})

describe("LCHObjectToString", () => {
  const lch = { lightness: 50, chroma: 100, hue: 120 }

  it("omits opacity at 100 or null", () => {
    expect(LCHObjectToString(lch)).toBe("lch(50% 100 120deg)")
    expect(LCHObjectToString(lch, null)).toBe("lch(50% 100 120deg)")
  })

  it("appends opacity below 100", () => {
    expect(LCHObjectToString(lch, 80)).toBe("lch(50% 100 120deg / 80%)")
  })
})
