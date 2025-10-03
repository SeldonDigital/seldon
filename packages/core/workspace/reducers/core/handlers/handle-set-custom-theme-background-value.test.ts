import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeBackgroundValue } from "./handle-set-custom-theme-background-value"

describe("handleSetCustomThemeBackgroundValue", () => {
  it("should set value in the background section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeBackgroundValue(
      {
        key: "primary",
        value: { color: { type: ValueType.EXACT, value: "#ffffff" } },
      },
      workspace,
    )
    expect(result.customTheme.background.primary.parameters.color).toEqual({
      type: ValueType.EXACT,
      value: "#ffffff",
    })
  })
})
