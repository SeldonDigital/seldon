import { describe, expect, it } from "bun:test"
import { isPercentage } from "./percentage"

describe("isPercentage", () => {
  it("should validate percentages correctly", () => {
    const validPercentages = ["1%", "10%", "100%"]

    const invalidPercentages = ["abc%", "1a", " "]

    validPercentages.forEach((percentage) => {
      expect(isPercentage(percentage)).toBe(true)
    })

    invalidPercentages.forEach((percentage) => {
      expect(isPercentage(percentage)).toBe(false)
    })
  })
})
