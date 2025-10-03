import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeGradientValue } from "./handle-set-custom-theme-gradient-value"

describe("handleSetCustomThemeGradientValue", () => {
  it("should set value in the gradient section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeGradientValue(
      {
        key: "primary",
        value: {
          angle: {
            type: ValueType.EXACT,
            value: { unit: Unit.DEGREES, value: 180 },
          },
        },
      },
      workspace,
    )
    expect(result.customTheme.gradient.primary.parameters.angle).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.DEGREES, value: 180 },
    })
  })
})
