import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeDefaultIconColor } from "./handle-set-custom-theme-default-icon-color"

describe("handleSetCustomThemeDefaultIconColor", () => {
  it("should set default icon color in the icon section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeDefaultIconColor(
      { value: { type: ValueType.EXACT, value: "#333333" } },
      workspace,
    )
    expect(result.customTheme.icon.defaultColor).toEqual({
      type: ValueType.EXACT,
      value: "#333333",
    })
  })
})
