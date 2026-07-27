"use client"

import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useCallback } from "react"

import { isEntryNodeInstance } from "@seldon/core/workspace/model"

import { useEditorConfig } from "./use-editor-config"

/**
 * Toggles isolation mode. Enabling requires a default or custom variant to be
 * selected and captures its board as the frozen anchor; disabling clears it.
 * `canToggleIsolation` stays true while isolation is on so it can always be
 * turned off. Shared by the Edit menu and the keyboard shortcut so the gate and
 * capture logic live in one place.
 */
export function useToggleIsolation() {
  const { isolatedView, enableIsolation, disableIsolation } = useEditorConfig()
  const { activeBoard } = useActiveBoard()
  const { selectedNode } = useSelection()
  const { workspace } = useWorkspace()

  const selectedVariantRootId =
    selectedNode != null && !isEntryNodeInstance(selectedNode) ? selectedNode.id : null
  const canToggleIsolation = isolatedView || selectedVariantRootId != null

  const toggleIsolation = useCallback(() => {
    if (isolatedView) {
      disableIsolation()

      return
    }

    if (!selectedVariantRootId || !activeBoard) return
    enableIsolation(resolveComponentKey(activeBoard, workspace), selectedVariantRootId)
  }, [
    isolatedView,
    selectedVariantRootId,
    activeBoard,
    workspace,
    enableIsolation,
    disableIsolation,
  ])

  return { toggleIsolation, canToggleIsolation }
}
