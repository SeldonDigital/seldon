import { useMemo } from "react"
import { Variant } from "@seldon/core"
import { MenuEntry } from "@lib/menus"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import type { ResourceRowConfig } from "../VMResourceEntry"
import { buildResetMenuEntry } from "../../shared/build-reset-menu-entry"
import { useEditState } from "./use-edit-state"

type EntrySnapshot = {
  label: string
  isDefault: boolean
  hasOverrides?: boolean
}

interface UseResourceEntryRowInput {
  config: ResourceRowConfig
  entryId: string
  entry?: EntrySnapshot
  isSelected: boolean
}

/**
 * Edit state, rename command, and reset actions for a resource entry row.
 */
export function useResourceEntryRow({
  config,
  entryId,
  entry,
  isSelected,
}: UseResourceEntryRowInput) {
  const { dispatch } = useWorkspace({ usePreview: false })
  const { isEditingName, setEditingName } = useEditState({
    id: entryId,
  } as unknown as Variant)

  const submitLabel = (newLabel: string) => {
    if (!config.buildLabelAction) return
    dispatch(config.buildLabelAction(entryId, newLabel.trim()))
    setEditingName(false)
  }

  const buildResetAction = config.buildResetAction
  const canReset =
    Boolean(buildResetAction) &&
    isSelected &&
    !!entry &&
    (entry.isDefault || entry.hasOverrides === true)

  const resetActions: MenuEntry[] = useMemo(() => {
    if (!buildResetAction || !canReset || !entry) return []
    return [
      buildResetMenuEntry({
        label: entry.isDefault ? "Reset to Catalog" : "Reset to Default",
        onSelect: () => dispatch(buildResetAction(entryId)),
        testId: `${config.testId}-${entryId}-reset`,
      }),
    ]
  }, [
    buildResetAction,
    canReset,
    entry,
    dispatch,
    config.testId,
    entryId,
  ])

  return { isEditingName, setEditingName, submitLabel, resetActions }
}
