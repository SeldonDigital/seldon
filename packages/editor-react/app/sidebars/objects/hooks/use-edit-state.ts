import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Instance, Variant } from "@seldon/core"
import { useIsNodeSelected } from "@lib/workspace/hooks/use-selection"

/**
 * Centralized edit state management for objects panel.
 * Handles keyboard shortcuts and edit mode state.
 */
export function useEditState(node: Variant | Instance) {
  const isSelected = useIsNodeSelected(node.id)
  const [isEditingName, setEditingName] = useState(false)

  useHotkeys("mod+r", () => setEditingName(true), {
    enabled: isSelected && !isEditingName,
  })

  return { isEditingName, setEditingName }
}
