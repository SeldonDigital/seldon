import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeCornersValue } from "./handle-set-custom-theme-corners-value"

describe("handleSetCustomThemeCornersValue", () => {
  it("should set value in the corners section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeCornersValue(
      { key: "tight", value: { step: -6.21 } },
      workspace,
    )
    expect(result.customTheme.corners.tight.parameters).toMatchObject({
      step: -6.21,
    })
  })
})
