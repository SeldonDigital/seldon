import { useEffect, useState } from "react"

interface UseRenameValueOptions {
  label: string
  isEditing: boolean
  setEditing: (editing: boolean) => void
}

/**
 * Shared rename-value state for sidebar inline renames. Seeds the working value
 * from `label` each time editing begins, and exposes a `cancel` that restores
 * the label and exits edit mode. Slot-specific hooks layer their own input or
 * control rendering on top of this state.
 *
 * The seed runs only when `isEditing` flips on, so a label change mid-edit never
 * clobbers what the user is typing.
 */
export function useRenameValue({
  label,
  isEditing,
  setEditing,
}: UseRenameValueOptions) {
  const [value, setValue] = useState(label)

  useEffect(() => {
    if (isEditing) {
      setValue(label)
    }
    // Seed only on the edit-mode transition; label changes mid-edit are ignored.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  const cancel = () => {
    setValue(label)
    setEditing(false)
  }

  return { value, setValue, cancel }
}
