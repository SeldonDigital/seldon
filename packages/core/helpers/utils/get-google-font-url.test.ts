import { describe, expect, it } from "vitest"

import { getGoogleFontURL } from "./get-google-font-url"

describe("getGoogleFontURL", () => {
  it("requests the given variants with display swap", () => {
    const url = new URL(getGoogleFontURL("Roboto", ["400", "700italic"]))
    expect(url.origin + url.pathname).toBe("https://fonts.googleapis.com/css2")
    expect(url.searchParams.get("family")).toBe("Roboto:ital,wght@0,400;1,700")
    expect(url.searchParams.get("display")).toBe("swap")
  })

  it("requests every weight when variants are omitted", () => {
    const url = new URL(getGoogleFontURL("Roboto"))
    const family = url.searchParams.get("family") ?? ""
    expect(family.startsWith("Roboto:ital,wght@0,100;")).toBe(true)
  })
})
