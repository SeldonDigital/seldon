import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeSpreadValue } from "./handle-set-custom-theme-spread-value"

describe("handleSetCustomThemeSpreadValue", () => {
  it("should set value in the spread section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeSpreadValue(
      { key: "tiny", value: { step: -15.53 } },
      workspace,
    )
    expect(result.customTheme.spread.tiny.parameters).toMatchObject({
      step: -15.53,
    })
  })
})
