"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useCallback } from "react"

import { loadRefBindings } from "./use-ref-bindings"

/**
 * Turns the ref connector overlay on and off.
 *
 * Enabling it is what reads the linked folder. A browser only grants a directory
 * permission during a gesture, so the menu item and the shortcut both have to be
 * the thing that loads, and both route through here.
 *
 * The read is not awaited. Its outcome lands in the ref bindings store as loading
 * and problem state, which the overlay reports, so waiting here would only delay
 * the overlay appearing.
 */
export function useRefConnections() {
  const workspaceId = useWorkspaceId()
  const { showRefConnections, setShowRefConnections } = useEditorConfig()

  const toggleRefConnections = useCallback(() => {
    if (showRefConnections) {
      setShowRefConnections(false)

      return
    }

    setShowRefConnections(true)

    if (workspaceId) {
      void loadRefBindings(workspaceId)
    }
  }, [setShowRefConnections, showRefConnections, workspaceId])

  return { showRefConnections, toggleRefConnections }
}
