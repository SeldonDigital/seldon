import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace-with-properties"
import { handleSetCustomThemeColorValue } from "./handle-set-custom-theme-color-value"

describe("handleSetCustomThemeColorValue", () => {
  it("should set value in the color section", () => {
    const result = handleSetCustomThemeColorValue(
      {
        key: "angle",
        value: 180,
      },
      WORKSPACE_FIXTURE,
    )
    expect(result.customTheme.color.angle).toBe(180)
  })
})
