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

  it("maps dynamic palette slots to their slot id so they align across themes", () => {
    const names = getThemeSwatchVarNames(defaultTheme)
    expect(names.swatch1).toBe("swatch1")
    expect(names.swatch4).toBe("swatch4")
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

  it("emits a bare --sdn- swatch variable that aligns across themes", () => {
    expect(getThemeSwatchVarReference("@swatch.primary", defaultTheme)).toBe(
      "var(--sdn-swatch-primary)",
    )
  })
})
