import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeMarginValue } from "./handle-set-custom-theme-margin-value"

describe("handleSetCustomThemeMarginValue", () => {
  it("should set value in the margin section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeMarginValue(
      { key: "tight", value: { step: -6.21 } },
      workspace,
    )
    expect(result.customTheme.margin.tight.parameters).toMatchObject({
      step: -6.21,
    })
  })
})
