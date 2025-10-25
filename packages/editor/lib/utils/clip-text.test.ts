import { describe, expect, test } from "bun:test"
import { clipText } from "./clip-text"

describe("clipText", () => {
  test("should return the original text if length is 20 or less", () => {
    const shortText = "Hello World"
    expect(clipText(shortText)).toBe(shortText)

    const exactText = "12345678901234567890"
    expect(clipText(exactText)).toBe(exactText)
  })

  test("should clip text and add ellipsis if length exceeds 20", () => {
    const longText = "This is a very long text that should be clipped"
    expect(clipText(longText)).toBe("This is a very long…")

    const slightlyLongText = "123456789012345678901"
    expect(clipText(slightlyLongText)).toBe("12345678901234567890…")
  })

  test("should handle empty string", () => {
    expect(clipText("")).toBe("")
  })
})
