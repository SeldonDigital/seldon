import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleUpdateCustomThemeSwatch } from "./handle-update-custom-theme-swatch"

describe("handleUpdateCustomThemeSwatch", () => {
  it("should update a custom swatch in the custom theme", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme: {
        ...customTheme,
        swatch: {
          ...customTheme.swatch,
          custom6: {
            name: "Original Name",
            intent: "Original intent",
            type: "hsl",
            value: { hue: 180, saturation: 50, lightness: 60 },
          },
        },
      },
    }

    const result = handleUpdateCustomThemeSwatch(
      {
        key: "custom6",
        name: "Updated Name",
        intent: "Updated intent",
        value: { hue: 200, saturation: 60, lightness: 70 },
      },
      workspace,
    )

    expect(result.customTheme.swatch.custom6).toMatchObject({
      name: "Updated Name",
      intent: "Updated intent",
      type: "hsl",
      value: { hue: 200, saturation: 60, lightness: 70 },
    })
  })
})
