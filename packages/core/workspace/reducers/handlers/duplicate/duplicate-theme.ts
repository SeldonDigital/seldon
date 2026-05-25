import { produce } from "immer"
import type { EntryTheme } from "../../../model/entry-theme"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import type { ExtractPayload, Workspace } from "../../../../index"
import { formatThemeLink } from "../../../model/template-ref"

function themeComponentKeyFromThemeId(themeId: string): string | null {
  const without = themeId.startsWith("theme-")
    ? themeId.slice("theme-".length)
    : null
  if (!without) return null
  const lastDash = without.lastIndexOf("-")
  if (lastDash <= 0) return null
  return without.slice(0, lastDash)
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Clones a variant `themes` entry, points its template at the source, and appends it to the owning theme board.
 */
export function duplicateTheme(
  payload: ExtractPayload<"duplicate_theme">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry) return

    const componentKey = themeComponentKeyFromThemeId(payload.themeId)
    if (!componentKey) return

    const newId = payload.newThemeId ?? `theme-${componentKey}-${randomSuffix()}`

    if (draft.themes[newId]) return

    const clone: EntryTheme = {
      ...entry,
      id: newId,
      type: "variant",
      label: `${entry.label} copy`,
      template: formatThemeLink(payload.themeId),
      overrides: structuredClone(entry.overrides) as EntryTheme["overrides"],
    }

    draft.themes[newId] = clone

    const board = draft.components[componentKey]
    if (board?.type === "theme" && board.variants) {
      board.variants.push({ id: newId })
    }
  })
}
