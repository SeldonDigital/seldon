import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeCoreFontSize } from "./handle-set-custom-theme-core-font-size"

describe("handleSetCustomThemeCoreFontSize", () => {
  it("should set font size in the core section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeCoreFontSize({ value: 16 }, workspace)
    expect(result.customTheme.core.fontSize).toBe(16)
  })
})
