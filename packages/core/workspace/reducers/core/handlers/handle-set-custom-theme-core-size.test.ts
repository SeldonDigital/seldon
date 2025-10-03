import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { handleSetCustomThemeCoreSize } from "./handle-set-custom-theme-core-size"

describe("handleSetCustomThemeCoreSize", () => {
  it("should set size in the core section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeCoreSize({ value: 10 }, workspace)
    expect(result.customTheme.core.size).toBe(10)
  })
})
