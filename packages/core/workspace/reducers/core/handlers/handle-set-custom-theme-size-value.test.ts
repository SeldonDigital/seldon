import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeSizeValue } from "./handle-set-custom-theme-size-value"

describe("handleSetCustomThemeSizeValue", () => {
  it("should set value in the size section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeSizeValue(
      { key: "tiny", value: { step: -9.32 } },
      workspace,
    )
    expect(result.customTheme.size.tiny.parameters).toMatchObject({
      step: -9.32,
    })
  })
})
