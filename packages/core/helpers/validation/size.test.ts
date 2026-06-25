import { describe, expect, it } from "vitest"

import { isPx, isRem, isValidPositionValue } from "./size"

describe("isPx", () => {
  it("accepts pixel values regardless of case", () => {
    expect(isPx("16px")).toBe(true)
    expect(isPx("16PX")).toBe(true)
  })

  it("rejects values without a numeric part or px suffix", () => {
    expect(isPx("16")).toBe(false)
    expect(isPx("px")).toBe(false)
  })
})

describe("isRem", () => {
  it("accepts rem values", () => {
    expect(isRem("1.5rem")).toBe(true)
  })

  it("rejects non-rem values", () => {
    expect(isRem("1.5em")).toBe(false)
    expect(isRem("rem")).toBe(false)
  })
})

describe("isValidPositionValue", () => {
  it("accepts px, rem, and percentage", () => {
    expect(isValidPositionValue("10px")).toBe(true)
    expect(isValidPositionValue("1rem")).toBe(true)
    expect(isValidPositionValue("50%")).toBe(true)
  })

  it("rejects bare numbers", () => {
    expect(isValidPositionValue("10")).toBe(false)
  })
})
