import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../index"
import { Colorspace } from "../../../themes/constants/colorspace"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addThemeCustomSwatch } from "./add/add-theme-custom-swatch"
import { duplicateTheme } from "./duplicate/duplicate-theme"
import { removeThemeCustomSwatch } from "./remove/remove-theme-custom-swatch"

const defaultThemeId = "theme-seldon-default"
const variantThemeId = "theme-seldon-copy"

const withVariantTheme = () =>
  duplicateTheme(
    {
      themeId: defaultThemeId,
      newThemeId: variantThemeId,
    } as ExtractPayload<"duplicate_theme">,
    createEmptyWorkspace(),
  )

const addSwatch = (themeId: string, ws: ReturnType<typeof withVariantTheme>) =>
  addThemeCustomSwatch(
    {
      themeId,
      name: "My Swatch",
      intent: "test",
      parameters: { colorspace: Colorspace.HEX, value: "#112233" },
    } as ExtractPayload<"add_theme_custom_swatch">,
    ws,
  )

const swatchOverrides = (
  ws: ReturnType<typeof withVariantTheme>,
  themeId: string,
) => (ws.themes[themeId]!.overrides as Record<string, any>).swatch ?? {}

describe("addThemeCustomSwatch", () => {
  it("appends a custom swatch cell to a variant theme", () => {
    const next = addSwatch(variantThemeId, withVariantTheme())
    const swatch = swatchOverrides(next, variantThemeId)
    expect(swatch.custom1).toMatchObject({ name: "My Swatch" })
  })

  it("is a no-op for a default theme entry", () => {
    const workspace = withVariantTheme()
    expect(addSwatch(defaultThemeId, workspace)).toBe(workspace)
  })
})

describe("removeThemeCustomSwatch", () => {
  it("drops a custom swatch slot from a variant theme", () => {
    const added = addSwatch(variantThemeId, withVariantTheme())
    const removed = removeThemeCustomSwatch(
      { themeId: variantThemeId, key: "custom1" } as ExtractPayload<"remove_theme_custom_swatch">,
      added,
    )
    expect(swatchOverrides(removed, variantThemeId).custom1).toBeUndefined()
  })

  it("is a no-op for a default theme entry", () => {
    const workspace = withVariantTheme()
    expect(
      removeThemeCustomSwatch(
        { themeId: defaultThemeId, key: "custom1" } as ExtractPayload<"remove_theme_custom_swatch">,
        workspace,
      ),
    ).toBe(workspace)
  })
})
