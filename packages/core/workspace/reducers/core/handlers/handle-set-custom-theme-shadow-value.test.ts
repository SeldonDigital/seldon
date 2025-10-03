import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeShadowValue } from "./handle-set-custom-theme-shadow-value"

describe("handleSetCustomThemeShadowValue", () => {
  it("should set value in the shadow section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeShadowValue(
      {
        key: "xlight",
        value: {
          blur: { type: ValueType.THEME_ORDINAL, value: "@blur.xxsmall" },
        },
      },
      workspace,
    )
    expect(result.customTheme.shadow.xlight.parameters.blur).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@blur.xxsmall",
    })
  })
})
