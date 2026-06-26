import { describe, expect, it } from "vitest"

import { defaultTheme } from "../../themes"
import { getThemeOption } from "./get-theme-option"

describe("getThemeOption", () => {
  it("resolves an ordinal scale token", () => {
    const option = getThemeOption("@fontSize.medium", defaultTheme)
    expect(option).toBeDefined()
    expect(typeof option).toBe("object")
  })

  it("resolves a categorical swatch token", () => {
    expect(getThemeOption("@swatch.primary", defaultTheme)).toBeDefined()
  })

  it("throws for a string that is not a theme value key", () => {
    expect(() => getThemeOption("fontSize.medium", defaultTheme)).toThrow()
  })

  it("throws for a key with an unknown namespace", () => {
    expect(() => getThemeOption("@bogus.medium", defaultTheme)).toThrow()
  })
})
