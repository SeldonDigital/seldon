import type { MenuEntry } from "@app/menus/types"
import { useDispatch } from "@app/workspace/use-dispatch"
import { buildResetMenuEntry } from "@seldon/editor/lib/menus/reset-menu"
import { type ComputedRef, computed } from "vue"

import type { ResourceRowConfig } from "../helpers/resource-row-config"
import { useEditState } from "./use-edit-state"

type EntrySnapshot = {
  label: string
  isDefault: boolean
  hasOverrides?: boolean
}

interface UseResourceEntryRowInput {
  config: ResourceRowConfig
  entryId: string
  entry: () => EntrySnapshot | undefined
  isSelected: () => boolean
}

/**
 * Edit state, rename command, and reset/duplicate/delete actions for a resource
 * entry row. Mirrors the React `useResourceEntryRow`.
 */
export function useResourceEntryRow(input: UseResourceEntryRowInput) {
  const dispatch = useDispatch()
  const { isEditingName, setEditingName } = useEditState(input.isSelected)

  function submitLabel(newLabel: string): void {
    if (!input.config.buildLabelAction) return
    dispatch(input.config.buildLabelAction(input.entryId, newLabel.trim()))
    setEditingName(false)
  }

  const actions: ComputedRef<MenuEntry[]> = computed(() => {
    const entry = input.entry()
    if (!input.isSelected() || !entry) return []

    const { buildDuplicateAction, buildDeleteAction, buildResetAction } =
      input.config
    const entries: MenuEntry[] = []

    if (buildDuplicateAction) {
      entries.push({
        id: "duplicate",
        label: entry.isDefault
          ? `Duplicate ${entry.label} Default`
          : `Duplicate ${entry.label}`,
        onSelect: () => dispatch(buildDuplicateAction(input.entryId)),
        testId: `${input.config.testId}-${input.entryId}-duplicate`,
      })
    }

    const tail: MenuEntry[] = []

    if (!entry.isDefault && buildDeleteAction) {
      tail.push({
        id: "delete",
        label: `Delete ${entry.label}`,
        onSelect: () => dispatch(buildDeleteAction(input.entryId)),
        testId: `${input.config.testId}-${input.entryId}-delete`,
      })
    }

    if (buildResetAction) {
      tail.push(
        buildResetMenuEntry({
          label: entry.isDefault ? "Reset to Catalog" : "Reset to Default",
          onSelect: () => dispatch(buildResetAction(input.entryId)),
          testId: `${input.config.testId}-${input.entryId}-reset`,
        }),
      )
    }

    if (entries.length > 0 && tail.length > 0) entries.push("separator")
    entries.push(...tail)

    return entries
  })

  return { isEditingName, setEditingName, submitLabel, actions }
}
