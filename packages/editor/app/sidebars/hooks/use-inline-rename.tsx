import { ReactNode, useCallback, useEffect, useState } from "react"
import { Combobox } from "@seldon/components/custom-components"

interface UseInlineRenameInput {
  label: string
  isEditing: boolean
  setEditing: (editing: boolean) => void
  onSubmit: (value: string) => void
}

/**
 * Controlled rename input for sidebar row labels. Callers pass the result as
 * `textLabel.children` while editing.
 */
export function useInlineRename({
  label,
  isEditing,
  setEditing,
  onSubmit,
}: UseInlineRenameInput): { labelChildren: ReactNode } {
  const [renameValue, setRenameValue] = useState(label)

  useEffect(() => {
    if (isEditing) {
      setRenameValue(label)
    }
  }, [isEditing, label])

  const handleCancelRename = useCallback(() => {
    setRenameValue(label)
    setEditing(false)
  }, [label, setEditing])

  const labelChildren = isEditing ? (
    <Combobox
      mode="standalone"
      value={renameValue}
      onValueChange={setRenameValue}
      onSubmit={onSubmit}
      onCancel={handleCancelRename}
    />
  ) : (
    label
  )

  return { labelChildren }
}
