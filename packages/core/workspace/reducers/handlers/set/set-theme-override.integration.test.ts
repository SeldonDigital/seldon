import { describe, expect, it } from "vitest"

import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { setThemeOverride } from "./set-theme-override"

const workspace = createEmptyWorkspace()
const themeId = Object.keys(workspace.themes)[0]!

const override = (path: string, value: unknown, ws = workspace) =>
  setThemeOverride(
    { themeId, path, value } as ExtractPayload<"set_theme_override">,
    ws,
  )

describe("setThemeOverride", () => {
  it("writes a nested override value into the theme entry", () => {
    const next = override("color.primary.value", "#123456")
    const overrides = next.themes[themeId]!.overrides as Record<string, any>
    expect(overrides.color.primary.value).toBe("#123456")
  })

  it("removes a path when the value is null", () => {
    const withValue = override("color.primary.value", "#123456")
    const cleared = override("color.primary.value", null, withValue)
    const overrides = cleared.themes[themeId]!.overrides as Record<string, any>
    expect(overrides.color?.primary?.value).toBeUndefined()
  })

  it("is a no-op for an unknown theme id", () => {
    const result = setThemeOverride(
      {
        themeId: "ghost-theme",
        path: "color.primary.value",
        value: "#000000",
      } as ExtractPayload<"set_theme_override">,
      workspace,
    )
    expect(result).toBe(workspace)
  })
})
