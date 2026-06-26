import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { duplicateTheme } from "./duplicate-theme"

const sourceThemeId = "theme-seldon-default"

describe("duplicateTheme", () => {
  it("clones a theme entry as a variant pointing at the source", () => {
    const workspace = createEmptyWorkspace()
    const next = duplicateTheme(
      {
        themeId: sourceThemeId,
        newThemeId: "theme-seldon-copy",
      } as ExtractPayload<"duplicate_theme">,
      workspace,
    )

    const clone = next.themes["theme-seldon-copy"]
    expect(clone).toBeDefined()
    expect(clone!.type).toBe("variant")
    expect(clone!.template).toBe(`theme:${sourceThemeId}`)
    expect(
      next.boards["seldon"]!.variants.some((v) => v.id === "theme-seldon-copy"),
    ).toBe(true)
  })

  it("is a no-op for an unknown theme id", () => {
    const workspace = createEmptyWorkspace()
    expect(
      duplicateTheme(
        { themeId: "theme-ghost-default" } as ExtractPayload<"duplicate_theme">,
        workspace,
      ),
    ).toBe(workspace)
  })
})
