export type EntryIconSetId = string

export type EntryIconSetType = "default" | "variant"

export type EntryIconSetOverrides = Record<string, unknown>

export interface EntryIconSet {
  id: EntryIconSetId
  type: EntryIconSetType
  label: string
  template: string
  overrides: EntryIconSetOverrides
  __editor?: Record<string, unknown>
}

export function isEntryIconSetDefault(
  entry: EntryIconSet,
): entry is EntryIconSet & { type: "default" } {
  return entry.type === "default"
}
