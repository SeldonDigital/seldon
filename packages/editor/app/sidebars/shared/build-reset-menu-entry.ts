import { MenuEntry } from "@lib/menus"

interface BuildResetMenuEntryInput {
  label: string
  onSelect: () => void
  testId: string
}

export function buildResetMenuEntry({
  label,
  onSelect,
  testId,
}: BuildResetMenuEntryInput): MenuEntry {
  return {
    id: "reset",
    label,
    onSelect,
    testId,
  }
}
