import { current, isDraft, produce } from "immer"
import type { EntryTheme } from "../../../model/entry-theme"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import type { ExtractPayload, Workspace } from "../../../../index"
import { getNextVariantLabel } from "../../../helpers/general/get-next-variant-label"
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
    const draftEntry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!draftEntry) return

    const entry = (
      isDraft(draftEntry) ? current(draftEntry) : draftEntry
    ) as EntryTheme

    const boardKey = themeComponentKeyFromThemeId(payload.themeId)
    if (!boardKey) return

    const newId = payload.newThemeId ?? `theme-${boardKey}-${randomSuffix()}`

    if (draft.themes[newId]) return

    const board = draft.components[boardKey]
    const isThemeBoard = board?.type === "theme"

    const base = isThemeBoard ? board.label : entry.label
    const existing = new Set<string>()
    if (isThemeBoard && board.variants) {
      for (const ref of board.variants) {
        const existingLabel = draft.themes[ref.id]?.label
        if (existingLabel) existing.add(existingLabel)
      }
    }

    const clone: EntryTheme = {
      ...entry,
      id: newId,
      type: "variant",
      label: getNextVariantLabel(base, existing),
      template: formatThemeLink(payload.themeId),
      overrides: structuredClone(entry.overrides) as EntryTheme["overrides"],
    }

    draft.themes[newId] = clone

    if (isThemeBoard && board.variants) {
      board.variants.push({ id: newId })
    }
  })
}
