"use client"

import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { resolveIsolationRootId } from "@seldon/editor/lib/isolation/resolve-isolation-root-id"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useCallback, useMemo } from "react"

import { useEditorConfig } from "./use-editor-config"

/**
 * Toggles isolation mode. Enabling isolates the variant the selection sits in,
 * from the variant root itself or from anything nested inside it, and captures
 * its board as the frozen anchor; disabling clears it. `canToggleIsolation`
 * stays true while isolation is on so it can always be turned off. Shared by
 * the Edit menu and the keyboard shortcut so the gate and capture logic live in
 * one place.
 */
export function useToggleIsolation() {
  const { isolatedView, enableIsolation, disableIsolation } = useEditorConfig()
  const { activeBoard } = useActiveBoard()
  const { selectedNodeId, selectedNodeRootId } = useSelection()
  const { workspace } = useWorkspace()

  const isolationRootId = useMemo(
    () => resolveIsolationRootId(selectedNodeId, selectedNodeRootId, activeBoard),
    [selectedNodeId, selectedNodeRootId, activeBoard],
  )
  const canToggleIsolation = isolatedView || isolationRootId != null

  const toggleIsolation = useCallback(() => {
    if (isolatedView) {
      disableIsolation()

      return
    }

    if (!isolationRootId || !activeBoard) return
    enableIsolation(resolveComponentKey(activeBoard, workspace), isolationRootId)
  }, [isolatedView, isolationRootId, activeBoard, workspace, enableIsolation, disableIsolation])

  return { toggleIsolation, canToggleIsolation }
}
