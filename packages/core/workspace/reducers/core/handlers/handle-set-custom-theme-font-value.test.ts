import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeFontValue } from "./handle-set-custom-theme-font-value"

describe("handleSetCustomThemeFontValue", () => {
  it("should set value in the font section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeFontValue(
      {
        key: "display",
        value: { family: { type: ValueType.PRESET, value: "Arial" } },
      },
      workspace,
    )
    expect(result.customTheme.font.display.value.family).toEqual({
      type: ValueType.PRESET,
      value: "Arial",
    })
  })
})
