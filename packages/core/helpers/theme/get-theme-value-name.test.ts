import { describe, expect, it } from "vitest"

import { defaultTheme } from "../../themes"
import { getThemeValueName } from "./get-theme-value-name"

describe("getThemeValueName", () => {
  it("formats raw camelCase names to PascalCase", () => {
    expect(getThemeValueName("fontSize", defaultTheme)).toBe("FontSize")
    expect(getThemeValueName("lineHeight", defaultTheme)).toBe("LineHeight")
  })

  it("formats custom slot names", () => {
    expect(getThemeValueName("custom1", defaultTheme)).toBe("Custom 1")
  })

  it("preserves a malformed @-prefixed key without a dot", () => {
    expect(getThemeValueName("@fontSize", defaultTheme)).toBe("@fontSize")
  })

  it("resolves a real token to its friendly name", () => {
    const name = getThemeValueName("@fontSize.medium", defaultTheme)
    expect(typeof name).toBe("string")
    expect(name.length).toBeGreaterThan(0)
  })
})
