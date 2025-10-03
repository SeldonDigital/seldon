import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeGapValue } from "./handle-set-custom-theme-gap-value"

describe("handleSetCustomThemeGapValue", () => {
  it("should set value in the gap section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeGapValue(
      { key: "tight", value: { step: -6.21 } },
      workspace,
    )
    expect(result.customTheme.gap.tight.parameters).toMatchObject({
      step: -6.21,
    })
  })
})
