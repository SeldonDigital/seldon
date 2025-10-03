import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../../../properties"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeDefaultIconSize } from "./handle-set-custom-theme-default-icon-size"

describe("handleSetCustomThemeDefaultIconSize", () => {
  it("should set default icon size in the icon section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeDefaultIconSize(
      {
        value: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 24 },
        },
      },
      workspace,
    )
    expect(result.customTheme.icon.defaultSize).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 24 },
    })
  })
})
