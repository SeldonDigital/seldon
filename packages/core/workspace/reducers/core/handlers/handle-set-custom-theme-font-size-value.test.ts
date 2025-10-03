import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeFontSizeValue } from "./handle-set-custom-theme-font-size-value"

describe("handleSetCustomThemeFontSizeValue", () => {
  it("should set value in the fontSize section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeFontSizeValue(
      { key: "tiny", value: { step: -3.11 } },
      workspace,
    )
    expect(result.customTheme.fontSize.tiny.parameters).toMatchObject({
      step: -3.11,
    })
  })
})
