import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { ThemeSwatchId } from "../../../../themes/types"
import { handleAddCustomThemeSwatch } from "./handle-add-custom-theme-swatch"

describe("handleAddCustomThemeSwatch", () => {
  it("should add a custom swatch to the custom theme", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleAddCustomThemeSwatch(
      {
        name: "Custom Color",
        intent: "A custom color for testing",
        value: { hue: 180, saturation: 50, lightness: 60 },
      },
      workspace,
    )

    const customSwatchKeys = Object.keys(result.customTheme.swatch).filter(
      (key) => key.startsWith("custom"),
    )
    expect(customSwatchKeys.length).toBeGreaterThan(0)

    const lastCustomKey = customSwatchKeys[customSwatchKeys.length - 1]
    expect(
      result.customTheme.swatch[lastCustomKey as ThemeSwatchId],
    ).toMatchObject({
      name: "Custom Color",
      intent: "A custom color for testing",
      type: "hsl",
      value: { hue: 180, saturation: 50, lightness: 60 },
    })
  })
})
