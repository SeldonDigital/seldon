import { describe, expect, it } from "bun:test"
import { isPositiveInteger } from "./positive-integer"

describe("isPositiveInteger", () => {
  it("should validate positive integers correctly", () => {
    const validPositiveIntegers = ["1", "10", "100"]

    const invalidValues = ["100.2", "-10", "0.2", "-100.2", "abc", "1a", " "]

    validPositiveIntegers.forEach((value) => {
      expect(isPositiveInteger(value)).toBe(true)
    })

    invalidValues.forEach((value) => {
      expect(isPositiveInteger(value)).toBe(false)
    })
  })
})
