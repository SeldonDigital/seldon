import { EntryTheme, EntryThemeTokenOverrides, Workspace, parseThemeTemplate } from "../../types"

export function getThemeOverrides(
  theme: EntryTheme,
  workspace: Workspace,
): EntryThemeTokenOverrides {
  const chain: EntryTheme[] = []
  const visited = new Set<string>()
  let cursor: EntryTheme | null = theme

  while (cursor && !visited.has(cursor.id)) {
    visited.add(cursor.id)
    chain.push(cursor)
    const parsed = parseThemeTemplate(cursor.template)
    if (!parsed || parsed.kind !== "theme") break
    cursor = workspace.themes[parsed.themeId] ?? null
  }

  return chain.reverse().reduce<EntryThemeTokenOverrides>(
    (acc, item) => ({ ...acc, ...item.overrides }),
    {},
  )
}
