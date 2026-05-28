export type EntryThemeId = string

export type EntryThemeType = "default" | "variant"

export type EntryThemeOverrides = Record<string, unknown>

export type EntryThemeTokenOverrides = EntryThemeOverrides

export interface EntryTheme {
  id: EntryThemeId
  type: EntryThemeType
  label: string
  template: string
  overrides: EntryThemeOverrides
  __editor?: Record<string, unknown>
}

export function isEntryThemeDefault(
  entry: EntryTheme,
): entry is EntryTheme & { type: "default" } {
  return entry.type === "default"
}

export function isEntryThemeVariant(
  entry: EntryTheme,
): entry is EntryTheme & { type: "variant" } {
  return entry.type === "variant"
}
