import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeBlurValue } from "./handle-set-custom-theme-blur-value"

describe("handleSetCustomThemeBlurValue", () => {
  it("should set value in the blur section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeBlurValue(
      { key: "tiny", value: { step: -12.43 } },
      workspace,
    )
    expect(result.customTheme.blur.tiny.parameters).toMatchObject({
      step: -12.43,
    })
  })
})
