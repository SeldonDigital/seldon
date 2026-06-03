import { describe, expect, it } from "bun:test"
import { getRemoteFontUrl, isRemoteFontFamily } from "./remote-font-url"

describe("remote font urls", () => {
  it("returns a Google Fonts URL for packaged remote families", () => {
    const url = getRemoteFontUrl("Inter")

    expect(isRemoteFontFamily("Inter")).toBe(true)
    expect(url).toContain("https://fonts.googleapis.com/css2?")
    expect(url).toContain("family=Inter")
  })

  it("does not build URLs for local/system families, tokens, or invalid values", () => {
    expect(isRemoteFontFamily("System")).toBe(false)
    expect(getRemoteFontUrl("System")).toBeNull()
    expect(getRemoteFontUrl("Apple System")).toBeNull()
    expect(getRemoteFontUrl("@fontFamily.primary")).toBeNull()
    expect(getRemoteFontUrl("IBM Plex Sans, sans-serif")).toBeNull()
    expect(getRemoteFontUrl("")).toBeNull()
  })
})
