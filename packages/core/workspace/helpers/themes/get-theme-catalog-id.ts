import { EntryTheme, Workspace, parseThemeTemplate } from "../../types"

function resolveCatalogId(
  theme: EntryTheme,
  workspace: Workspace,
  visited: Set<string>,
): string | null {
  if (visited.has(theme.id)) return null
  visited.add(theme.id)

  const parsed = parseThemeTemplate(theme.template)
  if (!parsed) return null
  if (parsed.kind === "catalog") return parsed.themeCatalogId

  const parentTheme = workspace.themes[parsed.themeId]
  if (!parentTheme) return null
  return resolveCatalogId(parentTheme, workspace, visited)
}

export function getThemeCatalogId(
  theme: EntryTheme,
  workspace: Workspace,
): string | null {
  return resolveCatalogId(theme, workspace, new Set<string>())
}
