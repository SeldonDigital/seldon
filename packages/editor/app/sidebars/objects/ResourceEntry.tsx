"use client"

import { useRowActionsMenu } from "@lib/menus/use-row-actions-menu"
import { buildFieldStateProps } from "@lib/views/state-props"
import { useCallback, useRef } from "react"
import {
  useIsResourceEntrySelected,
  useSelection,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useTool } from "@lib/hooks/use-tool"
import { useRenameInput } from "../hooks/use-rename-input"
import { useResourceEntryRow } from "./hooks/use-resource-entry-row"
import { useRowClick } from "./hooks/use-row-click"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { IconProps } from "@seldon/components/primitives/Icon"
import { RowSelectionTarget } from "./RowSelectionTarget"
import type { ResourceRowConfig } from "./helpers/resource-row-config"

type ResourceEntryProps = {
  config: ResourceRowConfig
  entryId: string
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * View-model for one resource board variant entry (theme, font collection,
 * icon set, or media). Renders as a leaf row: the board shows its default
 * entry and custom variants. Selecting the row highlights and scrolls to its
 * canvas preview.
 */
export function ResourceEntry({
  config,
  entryId,
  show = true,
  parentIsSelected = false,
}: ResourceEntryProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectResourceEntry } = useSelection()
  const isSelected = useIsResourceEntrySelected(config.kind, entryId)
  const entry = config.getEntry(workspace, entryId)

  const { isEditingName, setEditingName, submitLabel, actions } =
    useResourceEntryRow({
      config,
      entryId,
      entry,
      isSelected,
    })
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectResourceEntry(config.kind, entryId),
  })

  const canRename = Boolean(config.buildLabelAction) && !entry?.isDefault

  const onDoubleClick = useCallback(() => {
    if (canRename) {
      setEditingName(true)
    }
  }, [canRename, setEditingName])

  const rowRef = useRef<HTMLDivElement>(null)

  const actionsMenu = useRowActionsMenu(actions, {
    focusTargetRef: rowRef,
  })

  const nameInput = useRenameInput({
    label: entry?.label ?? "",
    isEditing: isEditingName && Boolean(config.buildLabelAction),
    setEditing: setEditingName,
    onSubmit: submitLabel,
  })

  if (!show || !entry) return null

  const icon2: IconProps = { icon: config.icon }

  // Resource rows are always leaves, so the toggle slot stays a spacer with its
  // chevron hidden (mirrors the childless `NodeController` treatment) to keep label
  // indentation aligned. The trailing actions icon keeps the generated
  // `seldon-more` default, hidden by the actions button placeholder. Per-row
  // data flows through stable refs.
  const seldonRefs = {
    nodeToggleIcon: { style: { opacity: 0 } },
    nodeIcon: { ...icon2 },
    nodeLabel: { ...nameInput },
    nodeActions: { ...actionsMenu.buttonIconic },
  }

  // The row's selection is styled on its combobox-field child, matching `NodeController`
  // and `BoardController`.
  const comboboxField = buildFieldStateProps({ selected: isSelected })

  // Root-level row state mirrors selection for selectors and tests.
  const itemNodeState = {
    "aria-selected": isActive || undefined,
  }

  return (
    <>
      <RowSelectionTarget
        ref={rowRef}
        selectionId={entryId}
        selectionKind={config.selectionKind}
      >
        <ItemNode
          buttonIconic={{}}
          comboboxField={comboboxField}
          seldonRefs={seldonRefs}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          {...itemNodeState}
          data-testid={config.testId}
          data-resource-entry-id={entryId}
          data-resource-kind={config.kind}
          data-active={isActive}
        />
      </RowSelectionTarget>
      {actionsMenu.menu}
    </>
  )
}
