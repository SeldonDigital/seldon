import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeLineHeightValue } from "./handle-set-custom-theme-line-height-value"

describe("handleSetCustomThemeLineHeightValue", () => {
  it("should set value in the lineHeight section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeLineHeightValue(
      { key: "tight", value: 1.5 },
      workspace,
    )
    expect(result.customTheme.lineHeight.tight.value).toBe(1.5)
  })
})
