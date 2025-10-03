import { describe, expect, it } from "bun:test"
import { isValidListOf } from "./is-valid-list-of"

describe("isValidListOf", () => {
  it("should return false for invalid list conditions", () => {
    const invalidCases = [
      {
        params: {
          value: "a b",
          validateEach: () => true,
          minItems: 3,
          maxItems: 5,
        },
        description: "too few items",
      },
      {
        params: {
          value: "a b c d e f",
          validateEach: () => true,
          minItems: 3,
          maxItems: 5,
        },
        description: "too many items",
      },
      {
        params: {
          value: "a b c",
          validateEach: (val: string) => val === "b",
          minItems: 3,
          maxItems: 5,
        },
        description: "validation fails for some items",
      },
    ]

    invalidCases.forEach(({ params, description }) => {
      expect(isValidListOf(params)).toBe(false)
    })
  })

  it("should return true for valid list conditions", () => {
    const validCases = [
      {
        params: {
          value: "a b c",
          validateEach: () => true,
          minItems: 3,
          maxItems: 5,
        },
        description: "valid count and all items pass validation",
      },
      {
        params: {
          value: "x y z w",
          validateEach: (val: string) => val.length === 1,
          minItems: 2,
          maxItems: 6,
        },
        description: "valid count with custom validation",
      },
    ]

    validCases.forEach(({ params, description }) => {
      expect(isValidListOf(params)).toBe(true)
    })
  })
})
