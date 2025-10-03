import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeBaseColor } from "./handle-set-custom-theme-base-color"

describe("handleSetCustomThemeBaseColor", () => {
  it("should set base color in the color section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeBaseColor(
      { value: { hue: 200, saturation: 50, lightness: 60 } },
      workspace,
    )
    expect(result.customTheme.color.baseColor).toMatchObject({
      hue: 200,
      saturation: 50,
      lightness: 60,
    })
  })
})
