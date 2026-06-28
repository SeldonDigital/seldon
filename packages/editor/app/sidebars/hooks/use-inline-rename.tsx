import { ReactNode } from "react"
import { VMCombobox } from "@lib/menus"
import { useRenameValue } from "./use-rename-value"

interface UseInlineRenameInput {
  label: string
  isEditing: boolean
  setEditing: (editing: boolean) => void
  onSubmit: (value: string) => void
}

/**
 * Renders a standalone `<VMCombobox>` rename control into a sidebar row's name
 * label. Callers pass the result as `textLabel.children` while editing.
 */
export function useInlineRename({
  label,
  isEditing,
  setEditing,
  onSubmit,
}: UseInlineRenameInput): { labelChildren: ReactNode } {
  const { value, setValue, cancel } = useRenameValue({
    label,
    isEditing,
    setEditing,
  })

  const editControl = (
    <VMCombobox
      mode="standalone"
      value={value}
      onValueChange={setValue}
      onSubmit={onSubmit}
      onCancel={cancel}
    />
  )
  const labelChildren = isEditing ? editControl : label

  return { labelChildren }
}
