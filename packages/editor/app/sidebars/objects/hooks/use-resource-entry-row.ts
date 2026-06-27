import { MenuEntry } from "@lib/menus"
import { useMemo } from "react"
import { Variant } from "@seldon/core"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { buildResetMenuEntry } from "../../shared/build-reset-menu-entry"
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

  // The selected entry gets a "..." menu: "Duplicate" plus a tail group of
  // "Delete" (custom entries only) and "Reset". The default entry resets to
  // catalog, a custom entry resets to default. Resource kinds that omit a
  // builder simply skip that action.
  const actions: MenuEntry[] = useMemo(() => {
    if (!isSelected || !entry) return []

    const { buildDuplicateAction, buildDeleteAction, buildResetAction } = config

    const entries: MenuEntry[] = []

    if (buildDuplicateAction) {
      entries.push({
        id: "duplicate",
        label: entry.isDefault
          ? `Duplicate ${entry.label} Default`
          : `Duplicate ${entry.label}`,
        onSelect: () => dispatch(buildDuplicateAction(entryId)),
        testId: `${config.testId}-${entryId}-duplicate`,
      })
    }

    const tail: MenuEntry[] = []

    if (!entry.isDefault && buildDeleteAction) {
      tail.push({
        id: "delete",
        label: `Delete ${entry.label}`,
        onSelect: () => dispatch(buildDeleteAction(entryId)),
        testId: `${config.testId}-${entryId}-delete`,
      })
    }

    if (buildResetAction) {
      tail.push(
        buildResetMenuEntry({
          label: entry.isDefault ? "Reset to Catalog" : "Reset to Default",
          onSelect: () => dispatch(buildResetAction(entryId)),
          testId: `${config.testId}-${entryId}-reset`,
        }),
      )
    }

    if (entries.length > 0 && tail.length > 0) entries.push("separator")
    entries.push(...tail)

    return entries
  }, [config, entry, entryId, isSelected, dispatch])

  return { isEditingName, setEditingName, submitLabel, actions }
}
