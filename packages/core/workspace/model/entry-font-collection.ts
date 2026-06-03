export type EntryFontCollectionId = string

export type EntryFontCollectionType = "default" | "variant"

export type EntryFontCollectionOverrides = Record<string, unknown>

export interface EntryFontCollection {
  id: EntryFontCollectionId
  type: EntryFontCollectionType
  label: string
  template: string
  overrides: EntryFontCollectionOverrides
  __editor?: Record<string, unknown>
}

export function isEntryFontCollectionDefault(
  entry: EntryFontCollection,
): entry is EntryFontCollection & { type: "default" } {
  return entry.type === "default"
}

export function isEntryFontCollectionVariant(
  entry: EntryFontCollection,
): entry is EntryFontCollection & { type: "variant" } {
  return entry.type === "variant"
}
