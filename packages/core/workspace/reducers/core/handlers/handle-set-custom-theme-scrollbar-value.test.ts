import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeScrollbarValue } from "./handle-set-custom-theme-scrollbar-value"

describe("handleSetCustomThemeScrollbarValue", () => {
  it("should set value in the scrollbar section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeScrollbarValue(
      {
        key: "primary",
        value: {
          trackSize: {
            type: ValueType.EXACT,
            value: { unit: Unit.PX, value: 8 },
          },
        },
      },
      workspace,
    )
    expect(result.customTheme.scrollbar.primary.parameters.trackSize).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 8 },
    })
  })
})
