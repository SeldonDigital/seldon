import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeFontWeightValue } from "./handle-set-custom-theme-font-weight-value"

describe("handleSetCustomThemeFontWeightValue", () => {
  it("should set value in the fontWeight section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeFontWeightValue(
      { key: "thin", value: 100 },
      workspace,
    )
    expect(result.customTheme.fontWeight.thin.value).toBe(100)
  })
})
