import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeDimensionValue } from "./handle-set-custom-theme-dimension-value"

describe("handleSetCustomThemeDimensionValue", () => {
  it("should set value in the dimension section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeDimensionValue(
      { key: "tiny", value: { step: -6.21 } },
      workspace,
    )
    expect(result.customTheme.dimension.tiny.parameters).toMatchObject({
      step: -6.21,
    })
  })
})
