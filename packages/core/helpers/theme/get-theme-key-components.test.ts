import { describe, expect, it } from "vitest"

import { defaultTheme } from "../../themes"
import type { ThemeValueKey } from "../../themes/types"
import {
  getThemeKeyComponents,
  themeTokenRefIsValid,
} from "./get-theme-key-components"

describe("themeTokenRefIsValid", () => {
  it("accepts an @-form ref that resolves in the named section", () => {
    expect(
      themeTokenRefIsValid("@swatch.primary", defaultTheme, "swatch"),
    ).toBe(true)
  })

  it("rejects a ref whose section differs from the expected section", () => {
    expect(
      themeTokenRefIsValid("@margin.compact", defaultTheme, "swatch"),
    ).toBe(false)
  })

  it("rejects a bare id without the @section prefix", () => {
    expect(themeTokenRefIsValid("primary", defaultTheme, "swatch")).toBe(false)
  })

  it("rejects a ref to a token id that is absent from the section", () => {
    expect(
      themeTokenRefIsValid("@swatch.doesNotExist", defaultTheme, "swatch"),
    ).toBe(false)
  })

  it("rejects any ref when no theme is provided", () => {
    expect(themeTokenRefIsValid("@swatch.primary", undefined, "swatch")).toBe(
      false,
    )
  })
})

describe("getThemeKeyComponents", () => {
  it("splits a token into section and option", () => {
    expect(getThemeKeyComponents("@fontSize.medium" as ThemeValueKey)).toEqual({
      section: "fontSize",
      optionId: "medium",
    })
    expect(getThemeKeyComponents("@swatch.primary" as ThemeValueKey)).toEqual({
      section: "swatch",
      optionId: "primary",
    })
  })

  it("throws on an invalid theme value key", () => {
    expect(() =>
      getThemeKeyComponents("fontSize.medium" as ThemeValueKey),
    ).toThrow()
  })
})
