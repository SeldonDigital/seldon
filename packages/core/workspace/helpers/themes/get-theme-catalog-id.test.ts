import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../index"
import { duplicateTheme } from "../../reducers/handlers/duplicate/duplicate-theme"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { getThemeCatalogId } from "./get-theme-catalog-id"

const defaultThemeId = "theme-seldon-default"

describe("getThemeCatalogId", () => {
  it("resolves a catalog template directly", () => {
    const ws = createEmptyWorkspace()
    const theme = ws.themes[defaultThemeId]
    expect(getThemeCatalogId(theme, ws)).toBe("seldon")
  })

  it("resolves through a variant's parent chain", () => {
    const ws = duplicateTheme(
      {
        themeId: defaultThemeId,
        newThemeId: "theme-seldon-copy",
      } as ExtractPayload<"duplicate_theme">,
      createEmptyWorkspace(),
    )
    const variant = ws.themes["theme-seldon-copy"]
    expect(getThemeCatalogId(variant, ws)).toBe("seldon")
  })
})
