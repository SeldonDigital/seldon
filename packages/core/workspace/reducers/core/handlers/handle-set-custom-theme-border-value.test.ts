import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeBorderValue } from "./handle-set-custom-theme-border-value"

describe("handleSetCustomThemeBorderValue", () => {
  it("should set value in the border section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeBorderValue(
      {
        key: "hairline",
        value: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
      },
      workspace,
    )
    expect(result.customTheme.border.hairline.parameters).toMatchObject({
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    })
  })
})
