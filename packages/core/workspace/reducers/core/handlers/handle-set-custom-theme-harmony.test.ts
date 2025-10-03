import { describe, expect, it } from "bun:test"
import customTheme from "../../../../themes/custom"
import { Harmony } from "../../../../themes/types"
import { handleSetCustomThemeHarmony } from "./handle-set-custom-theme-harmony"

describe("handleSetCustomThemeHarmony", () => {
  it("should set harmony in the color section", () => {
    const workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetCustomThemeHarmony(
      { value: Harmony.Complementary },
      workspace,
    )
    expect(result.customTheme.color.harmony).toBe(Harmony.Complementary)
  })
})
