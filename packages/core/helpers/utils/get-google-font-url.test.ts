import { describe, expect, it } from "bun:test"
import { getGoogleFontURL } from "./get-google-font-url"

describe("getGoogleFontURL", () => {
  it("should generate correct Google Fonts URLs for different font names", () => {
    const testCases = [
      {
        input: "Inter",
        expected:
          "https://fonts.googleapis.com/css2?family=Inter%3Aital%2Cwght%400%2C100%3B0%2C200%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B0%2C800%3B0%2C900%3B1%2C100%3B1%2C200%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700%3B1%2C800%3B1%2C900&display=swap",
      },
      {
        input: "Roboto",
        expected:
          "https://fonts.googleapis.com/css2?family=Roboto%3Aital%2Cwght%400%2C100%3B0%2C200%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B0%2C800%3B0%2C900%3B1%2C100%3B1%2C200%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700%3B1%2C800%3B1%2C900&display=swap",
      },
      {
        input: "Open Sans",
        expected:
          "https://fonts.googleapis.com/css2?family=Open+Sans%3Aital%2Cwght%400%2C100%3B0%2C200%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B0%2C800%3B0%2C900%3B1%2C100%3B1%2C200%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700%3B1%2C800%3B1%2C900&display=swap",
      },
      {
        input: "",
        expected:
          "https://fonts.googleapis.com/css2?family=%3Aital%2Cwght%400%2C100%3B0%2C200%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B0%2C800%3B0%2C900%3B1%2C100%3B1%2C200%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700%3B1%2C800%3B1%2C900&display=swap",
      },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(getGoogleFontURL(input)).toBe(expected)
    })
  })

  it("should include all required URL components", () => {
    const result = getGoogleFontURL("Inter")

    // Check that all weights are included (URL-encoded)
    expect(result).toContain(
      "wght%400%2C100%3B0%2C200%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B0%2C800%3B0%2C900",
    )
    expect(result).toContain(
      "1%2C100%3B1%2C200%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700%3B1%2C800%3B1%2C900",
    )
    // Check that italic variants are included (URL-encoded)
    expect(result).toContain("ital%2C")
    expect(result).toContain("1%2C100") // italic variants start with 1
    // Check display parameter
    expect(result).toContain("display=swap")
  })

  it("should handle special characters in font names", () => {
    const result = getGoogleFontURL("Font+Name")
    expect(result).toContain("Font%2BName")
  })
})
