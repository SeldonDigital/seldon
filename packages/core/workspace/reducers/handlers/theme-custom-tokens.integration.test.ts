import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import type { ThemeCustomTokenSection } from "../types"
import { addThemeCustomToken } from "./add/add-theme-custom-token"
import { duplicateTheme } from "./duplicate/duplicate-theme"
import { removeThemeCustomToken } from "./remove/remove-theme-custom-token"

const defaultThemeId = "theme-seldon-default"
const variantThemeId = "theme-seldon-copy"

const variantWorkspace = () =>
  duplicateTheme(
    {
      themeId: defaultThemeId,
      newThemeId: variantThemeId,
    } as ExtractPayload<"duplicate_theme">,
    createEmptyWorkspace(),
  )

const addPayload = (themeId: string) =>
  ({
    themeId,
    name: "Custom Token",
    intent: "test",
    kind: "exact",
    parameters: {},
  }) as never

const removePayload = (themeId: string) =>
  ({ themeId, key: "custom1" }) as never

const section = (ws: Workspace, key: string) =>
  ((ws.themes[variantThemeId]!.overrides as Record<string, unknown>)[key] ??
    {}) as Record<string, unknown>

const ADD_SECTIONS: ThemeCustomTokenSection[] = [
  "font",
  "border",
  "gradient",
  "shadow",
  "scrollbar",
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "corners",
  "borderWidth",
  "blur",
  "spread",
  "fontSize",
  "fontWeight",
  "lineHeight",
]

const REMOVE_SECTIONS = ADD_SECTIONS as Exclude<
  ThemeCustomTokenSection,
  "swatch"
>[]

describe("addThemeCustomToken", () => {
  it.each(ADD_SECTIONS)(
    "%s appends a custom slot to a variant theme",
    (key) => {
      const next = addThemeCustomToken(
        key,
        addPayload(variantThemeId),
        variantWorkspace(),
      )
      expect(section(next, key).custom1).toBeDefined()
    },
  )

  it.each(ADD_SECTIONS)("%s is a no-op for a default theme entry", (key) => {
    const workspace = variantWorkspace()
    expect(addThemeCustomToken(key, addPayload(defaultThemeId), workspace)).toBe(
      workspace,
    )
  })
})

describe("removeThemeCustomToken", () => {
  it.each(REMOVE_SECTIONS)(
    "%s drops a custom slot from a variant theme",
    (key) => {
      const seeded = produce(variantWorkspace(), (draft) => {
        ;(draft.themes[variantThemeId]!.overrides as Record<string, unknown>)[
          key
        ] = {
          custom1: { name: "seed" },
        }
      })
      const removed = removeThemeCustomToken(
        key,
        removePayload(variantThemeId),
        seeded,
      )
      expect(section(removed, key).custom1).toBeUndefined()
    },
  )

  it.each(REMOVE_SECTIONS)("%s is a no-op for a default theme entry", (key) => {
    const workspace = variantWorkspace()
    expect(
      removeThemeCustomToken(key, removePayload(defaultThemeId), workspace),
    ).toBe(workspace)
  })
})
