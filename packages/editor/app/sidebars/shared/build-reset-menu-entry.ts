import { MenuEntry } from "@lib/menus"

interface BuildResetMenuEntryInput {
  label: string
  onSelect: () => void
  testId: string
  id?: string
  disabled?: boolean
}

export function buildResetMenuEntry({
  label,
  onSelect,
  testId,
  id = "reset",
  disabled,
}: BuildResetMenuEntryInput): MenuEntry {
  return {
    id,
    label,
    onSelect,
    testId,
    disabled,
  }
}
