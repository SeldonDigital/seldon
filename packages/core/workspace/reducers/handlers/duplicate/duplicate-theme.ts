import { current, isDraft, produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { formatEntryId } from "../../../helpers/general/entry-id"
import { getNextVariantLabel } from "../../../helpers/general/get-next-variant-label"
import { themeBoardKeyFromEntryId } from "../../../helpers/themes/theme-id"
import type { EntryTheme } from "../../../model/entry-theme"
import { formatThemeLink } from "../../../model/template-ref"
import { randomSuffix } from "../shared/random-suffix"

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

    const boardKey = themeBoardKeyFromEntryId(payload.themeId)
    if (!boardKey) return

    const newId =
      payload.newThemeId ?? formatEntryId("theme", boardKey, randomSuffix())

    if (draft.themes[newId]) return

    const board = draft.boards[boardKey]
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
