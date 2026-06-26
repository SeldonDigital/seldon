import { describe, expect, it } from "vitest"

import { formatPresetValue } from "./format-preset-value"

describe("formatPresetValue", () => {
  it("returns falsy input unchanged", () => {
    expect(formatPresetValue("")).toBe("")
  })

  it("formats custom values", () => {
    expect(formatPresetValue("custom1")).toBe("Custom 1")
    expect(formatPresetValue("custom12")).toBe("Custom 12")
  })

  it("converts kebab-case to Title Case", () => {
    expect(formatPresetValue("evenly-spaced")).toBe("Evenly Spaced")
  })

  it("converts camelCase to Title Case", () => {
    expect(formatPresetValue("imageFit")).toBe("Image Fit")
  })

  it("capitalizes a simple value", () => {
    expect(formatPresetValue("fit")).toBe("Fit")
  })
})
