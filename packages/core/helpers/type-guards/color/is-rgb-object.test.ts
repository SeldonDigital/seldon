import { describe, expect, it } from "bun:test"
import { isRGBObject } from "./is-rgb-object"

describe("isRGBObject", () => {
  it("should return true for valid RGB objects", () => {
    const validRGBObjects = [
      { red: 255, green: 128, blue: 64 },
      { red: 0, green: 0, blue: 0 },
      { red: 255.5, green: 128.7, blue: 64.3 },
    ]

    validRGBObjects.forEach((rgb) => {
      expect(isRGBObject(rgb)).toBe(true)
    })
  })

  it("should return false for invalid values", () => {
    const invalidValues = [
      null,
      undefined,
      "rgb(255, 128, 64)",
      123,
      { green: 128, blue: 64 },
      { red: 255, blue: 64 },
      { red: 255, green: 128 },
      { red: "255", green: 128, blue: 64 },
      { red: 255, green: "128", blue: 64 },
      { red: 255, green: 128, blue: "64" },
    ]

    invalidValues.forEach((value) => {
      expect(isRGBObject(value)).toBe(false)
    })
  })
})
