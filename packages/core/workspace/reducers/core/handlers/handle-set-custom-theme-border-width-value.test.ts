import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeBorderWidthValue } from "./handle-set-custom-theme-border-width-value"

describe("handleSetCustomThemeBorderWidthValue", () => {
  it("should set hairline value in the borderWidth section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeBorderWidthValue(
      { key: "xsmall", value: "hairline" },
      workspace,
    )
    expect(result.customTheme.borderWidth.xsmall).toMatchObject({
      name: result.customTheme.borderWidth.xsmall.name,
      value: "hairline",
    })
  })

  it("should set parameters value in the borderWidth section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeBorderWidthValue(
      { key: "xsmall", value: { step: -15.53 } },
      workspace,
    )
    // @ts-expect-error - don't bother with the type error
    expect(result.customTheme.borderWidth.xsmall.parameters).toMatchObject({
      step: -15.53,
    })
  })
})
