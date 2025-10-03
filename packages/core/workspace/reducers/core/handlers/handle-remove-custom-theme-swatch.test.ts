import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { Workspace } from "../../../types"
import { handleRemoveCustomThemeSwatch } from "./handle-remove-custom-theme-swatch"

describe("handleRemoveCustomThemeSwatch", () => {
  it("should remove a custom swatch from the custom theme", () => {
    const workspace: Workspace = {
      ...WORKSPACE_FIXTURE,
      customTheme: {
        ...WORKSPACE_FIXTURE.customTheme,
        swatch: {
          ...WORKSPACE_FIXTURE.customTheme.swatch,
          custom6: {
            name: "Test Custom Color",
            intent: "A test color to remove",
            type: "hsl",
            value: { hue: 180, saturation: 50, lightness: 60 },
          },
        },
      },
    }

    const result = handleRemoveCustomThemeSwatch({ key: "custom6" }, workspace)

    expect(result.customTheme.swatch.custom6).toBeUndefined()
  })
})
