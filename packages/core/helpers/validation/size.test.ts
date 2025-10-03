import { describe, expect, it } from "bun:test"
import { isPx, isRem, isValidSize } from "./size"

describe("Size functions", () => {
  it("should validate sizes correctly", () => {
    const validSizes = ["16px", "1rem", "@size.large"]

    const invalidSizes = ["invalid"]

    validSizes.forEach((size) => {
      expect(isValidSize(size)).toBe(true)
    })

    invalidSizes.forEach((size) => {
      expect(isValidSize(size)).toBe(false)
    })
  })

  it("should validate pixel values correctly", () => {
    const validPx = [
      "16px",
      "16PX",
      "16 PX",
      "16 px",
      "-16px",
      "-0.0025px",
      "-0.0025 px",
    ]

    const invalidPx = ["16", "16rem"]

    validPx.forEach((px) => {
      expect(isPx(px)).toBe(true)
    })

    invalidPx.forEach((px) => {
      expect(isPx(px)).toBe(false)
    })
  })

  it("should validate rem values correctly", () => {
    const validRem = [
      "1rem",
      "1REM",
      "1 rem",
      "1 REM",
      "-1rem",
      "-0.0025rem",
      "-0.0025 rem",
    ]

    const invalidRem = ["1", "16px"]

    validRem.forEach((rem) => {
      expect(isRem(rem)).toBe(true)
    })

    invalidRem.forEach((rem) => {
      expect(isRem(rem)).toBe(false)
    })
  })
})
