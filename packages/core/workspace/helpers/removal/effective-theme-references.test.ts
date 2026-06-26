import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import type { ExtractPayload, Workspace } from "../../../index"
import { addComponent } from "../../reducers/handlers/add/add-component"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../themes/workspace-editable-theme"
import { hasEffectiveThemeReference } from "./effective-theme-references"

const ws: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)

describe("hasEffectiveThemeReference", () => {
  it("is true for the default editable theme entry", () => {
    expect(
      hasEffectiveThemeReference(ws, WORKSPACE_EDITABLE_THEME_ENTRY_ID),
    ).toBe(true)
  })

  it("is false for a theme id no board or node references", () => {
    expect(hasEffectiveThemeReference(ws, "theme-does-not-exist")).toBe(false)
  })
})
