import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemePaddingValue } from "./handle-set-custom-theme-padding-value"

describe("handleSetCustomThemePaddingValue", () => {
  it("should set value in the padding section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemePaddingValue(
      { key: "tight", value: { step: -6.21 } },
      workspace,
    )
    expect(result.customTheme.padding.tight.parameters).toMatchObject({
      step: -6.21,
    })
  })
})
