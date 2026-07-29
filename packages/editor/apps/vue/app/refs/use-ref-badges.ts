import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useWorkspaceId } from "@app/project/use-workspace-id"

import { loadRefBindings } from "./ref-bindings-store"

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
 *
 * Mirrors the React `useRefBadges`.
 */
export function useRefBadges() {
  const config = useEditorConfigStore()
  const workspaceId = useWorkspaceId()

  function toggleRefBadges(): void {
    if (config.showRefBadges) {
      config.setShowRefBadges(false)

      return
    }

    config.setShowRefBadges(true)

    const id = workspaceId.value

    if (id) void loadRefBindings(id)
  }

  return { toggleRefBadges }
}
