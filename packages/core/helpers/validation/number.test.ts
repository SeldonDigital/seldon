import { describe, expect, it } from "bun:test"
import { isNumber } from "./number"

describe("isNumber", () => {
  it("should validate numbers correctly", () => {
    const validNumbers = ["1", "10", "100", "100.2", "-10", "0.2", "-100.2"]

    const invalidNumbers = ["abc", "1a", " "]

    validNumbers.forEach((number) => {
      expect(isNumber(number)).toBe(true)
    })

    invalidNumbers.forEach((number) => {
      expect(isNumber(number)).toBe(false)
    })
  })
})
