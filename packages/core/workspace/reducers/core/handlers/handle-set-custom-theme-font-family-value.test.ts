import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeFontFamilyValue } from "./handle-set-custom-theme-font-family-value"

describe("handleSetCustomThemeFontFamilyValue", () => {
  it("should set value in the fontFamily section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeFontFamilyValue(
      { key: "primary", value: "Arial, sans-serif" },
      workspace,
    )
    expect(result.customTheme.fontFamily.primary).toBe("Arial, sans-serif")
  })
})
