"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useCallback } from "react"

import { loadRefBindings } from "./use-ref-bindings"

/**
 * Turns the reference badge overlay on and off.
 *
 * Enabling it is what reads the linked folder. A browser only grants a directory
 * permission during a gesture, so the menu item and the shortcut both have to be
 * the thing that loads, and both route through here.
 *
 * The read is not awaited. Its outcome lands in the ref bindings store as loading
 * and problem state, which the overlay reports, so waiting here would only delay
 * the overlay appearing.
 */
export function useRefBadges() {
  const workspaceId = useWorkspaceId()
  const { showRefBadges, setShowRefBadges } = useEditorConfig()

  const toggleRefBadges = useCallback(() => {
    if (showRefBadges) {
      setShowRefBadges(false)

      return
    }

    setShowRefBadges(true)

    if (workspaceId) {
      void loadRefBindings(workspaceId)
    }
  }, [setShowRefBadges, showRefBadges, workspaceId])

  return { showRefBadges, toggleRefBadges }
}
