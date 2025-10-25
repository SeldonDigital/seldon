import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Instance, Variant } from "@seldon/core"
import { useSelection } from "@lib/workspace/use-selection"

export function useObjectsPanelShortcuts(node: Variant | Instance) {
  const { selectedId } = useSelection()
  const [isEditingName, setEditingName] = useState(false)
  const isSelected = selectedId === node.id

  useHotkeys("mod+r", () => setEditingName(true), {
    enabled: isSelected && !isEditingName,
  })

  return { isEditingName, setEditingName }
}
