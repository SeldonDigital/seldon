import { describe, expect, it } from "vitest"

import type { EntryTheme, ExtractPayload, Workspace } from "../../../index"
import { duplicateTheme } from "../../reducers/handlers/duplicate/duplicate-theme"
import { createEmptyWorkspace } from "../create-empty-workspace"
import { getDefaultThemeEntryLabel } from "./default-theme-entry-label"
import { getThemeEntryDisplayName } from "./get-theme-entry-display-name"
import { getThemeOverrides } from "./get-theme-overrides"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "./workspace-editable-theme"

const defaultThemeId = "theme-seldon-default"
const empty = () => createEmptyWorkspace()
const entry = (ws: Workspace, id: string) => ws.themes[id]

describe("getDefaultThemeEntryLabel", () => {
  it("returns a non-empty label for the default theme entry", () => {
    const ws = empty()
    const label = getDefaultThemeEntryLabel(entry(ws, defaultThemeId), ws)
    expect(typeof label).toBe("string")
    expect(label.length).toBeGreaterThan(0)
  })

  it("returns Custom for a variant entry", () => {
    const ws = duplicateTheme(
      {
        themeId: defaultThemeId,
        newThemeId: "theme-seldon-copy",
      } as ExtractPayload<"duplicate_theme">,
      empty(),
    )
    expect(getDefaultThemeEntryLabel(entry(ws, "theme-seldon-copy"), ws)).toBe(
      "Custom",
    )
  })
})

describe("getThemeEntryDisplayName", () => {
  it("shows the board label for the default entry, undefined for unknown ids", () => {
    const ws = empty()
    expect(typeof getThemeEntryDisplayName(defaultThemeId, ws)).toBe("string")
    expect(getThemeEntryDisplayName("not-a-theme", ws)).toBeUndefined()
  })
})

describe("getThemeOverrides", () => {
  it("merges the template chain into one overrides object", () => {
    const ws = empty()
    expect(typeof getThemeOverrides(entry(ws, defaultThemeId), ws)).toBe(
      "object",
    )
  })
})

describe("workspace-editable-theme", () => {
  it("points at the default seldon entry and seeds it when missing", () => {
    expect(WORKSPACE_EDITABLE_THEME_ENTRY_ID).toBe(defaultThemeId)
    const target: { themes?: Record<string, EntryTheme> } = {}
    ensureWorkspaceEditableThemeEntry(target)
    expect(target.themes?.[WORKSPACE_EDITABLE_THEME_ENTRY_ID]).toBeDefined()
  })
})
