import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { Ratio } from "../../../../themes/types"
import { handleSetCustomThemeCoreRatio } from "./handle-set-custom-theme-core-ratio"

describe("handleSetCustomThemeCoreRatio", () => {
  it("should set ratio in the core section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeCoreRatio(
      { value: Ratio.GoldenRatio },
      workspace,
    )
    expect(result.customTheme.core.ratio).toBe(Ratio.GoldenRatio)
  })
})
