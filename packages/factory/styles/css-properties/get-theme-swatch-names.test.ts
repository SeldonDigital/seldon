import { describe, expect, it } from "vitest"

import { defaultTheme } from "@seldon/core/themes"

import {
  getThemeSwatchVarNames,
  getThemeSwatchVarReference,
} from "./get-theme-swatch-names"

describe("getThemeSwatchVarNames", () => {
  it("maps reserved swatch roles to their own key", () => {
    const names = getThemeSwatchVarNames(defaultTheme)
    expect(names.primary).toBe("primary")
    expect(names.white).toBe("white")
  })
})

describe("getThemeSwatchVarReference", () => {
  it("returns undefined for keys that are not swatch references", () => {
    expect(
      getThemeSwatchVarReference("@font.body", defaultTheme),
    ).toBeUndefined()
  })

  it("returns undefined for a swatch id missing from the theme", () => {
    expect(
      getThemeSwatchVarReference("@swatch.doesNotExist", defaultTheme),
    ).toBeUndefined()
  })

  it("emits a bare --sdn- variable for the default theme slug", () => {
    expect(
      getThemeSwatchVarReference("@swatch.primary", defaultTheme, "seldon"),
    ).toBe("var(--sdn-swatch-primary)")
  })

  it("prefixes the slug for non-default themes", () => {
    expect(
      getThemeSwatchVarReference("@swatch.primary", defaultTheme, "seldon-red"),
    ).toBe("var(--sdn-seldon-red-swatch-primary)")
  })
})
