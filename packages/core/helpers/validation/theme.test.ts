import { describe, expect, it } from "vitest"

import { isThemeValueKey } from "./theme"

describe("isThemeValueKey", () => {
  it("accepts a single section and option separated by a dot", () => {
    expect(isThemeValueKey("@swatch.primary")).toBe(true)
    expect(isThemeValueKey("@fontSize.medium")).toBe(true)
    expect(isThemeValueKey("@border.hairline")).toBe(true)
  })

  it("rejects keys without an @, without a dot, or with extra segments", () => {
    expect(isThemeValueKey("swatch.primary")).toBe(false)
    expect(isThemeValueKey("@swatch")).toBe(false)
    expect(isThemeValueKey("@swatch.primary.extra")).toBe(false)
  })
})
