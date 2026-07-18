import { computed, type ComputedRef } from "vue"
import type { Workspace } from "@seldon/core/workspace/types"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import {
  buildThemeEditActions,
  buildThemeResetAction,
} from "@seldon/editor/lib/themes/build-theme-edit-actions"
import {
  buildThemeTokenRows,
  groupThemeTokenRows,
  type ThemeTokenSectionRows,
} from "@seldon/editor/lib/themes/build-theme-token-rows"
import { useDispatch } from "@lib/workspace/use-dispatch"

/**
 * Theme token editing for the properties sidebar. Given the selected theme
 * entry id, resolves the computed theme, flattens it into grouped editable
 * rows, and commits edits/resets through the shared action builders so the Vue
 * editor dispatches the same workspace actions as the React editor.
 */
export function useThemeProperties(
  themeEntryId: ComputedRef<EntryThemeId | null>,
  workspace: ComputedRef<Workspace>,
) {
  const dispatch = useDispatch()

  const sections = computed<ThemeTokenSectionRows[]>(() => {
    const id = themeEntryId.value
    if (!id) return []
    const entry = workspace.value.themes[id]
    if (!entry) return []

    const theme = getComputedTheme(id, workspace.value)
    // A swatch missing from the template theme was added on the entry itself, so
    // its row is base state rather than an override.
    const baseSwatchIds = new Set(
      Object.keys(getComputedTheme(entry.template, workspace.value).swatch),
    )
    const rows = buildThemeTokenRows(theme, entry.overrides, baseSwatchIds)
    return groupThemeTokenRows(rows)
  })

  function commit(key: string, raw: string): void {
    const id = themeEntryId.value
    if (!id) return
    const actions = buildThemeEditActions(id, key, raw, workspace.value)
    for (const action of actions) dispatch(action as never)
  }

  function reset(key: string): void {
    const id = themeEntryId.value
    if (!id) return
    const action = buildThemeResetAction(id, key)
    if (action) dispatch(action as never)
  }

  return { sections, commit, reset }
}
