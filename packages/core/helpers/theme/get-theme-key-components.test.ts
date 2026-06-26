import { describe, expect, it } from "vitest"

import type { ThemeValueKey } from "../../themes/types"
import { getThemeKeyComponents } from "./get-theme-key-components"

describe("getThemeKeyComponents", () => {
  it("splits a token into section and option", () => {
    expect(getThemeKeyComponents("@fontSize.medium" as ThemeValueKey)).toEqual({
      section: "fontSize",
      optionId: "medium",
    })
    expect(getThemeKeyComponents("@swatch.primary" as ThemeValueKey)).toEqual({
      section: "swatch",
      optionId: "primary",
    })
  })

  it("throws on an invalid theme value key", () => {
    expect(() =>
      getThemeKeyComponents("fontSize.medium" as ThemeValueKey),
    ).toThrow()
  })
})
