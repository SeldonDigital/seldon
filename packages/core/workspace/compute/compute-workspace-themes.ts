import { instantiateTheme } from "../../themes/compute/instantiate-theme"
import {
  STOCK_THEMES_BY_ID,
  THEMES,
  THEMES_BY_ID,
} from "../../themes/stock"
import type { ComputedTheme } from "../../themes/types/theme"
import type {
  ThemeInstanceId,
  ThemeTemplateId,
} from "../../themes/types/theme-id"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../helpers/themes/workspace-editable-theme"
import { parseThemeTemplate } from "../model/template-ref"

interface WorkspaceThemeEntry {
  id: string
  label?: string
  template?: string
  overrides?: Record<string, unknown>
}

interface WorkspaceThemeSource {
  themes?: Record<string, WorkspaceThemeEntry>
}

function normalizeThemeId(themeId: string): string {
  const parsed = parseThemeTemplate(themeId)
  if (parsed?.kind === "catalog") return parsed.themeCatalogId
  if (parsed?.kind === "theme") return parsed.themeId
  return themeId
}

function materializeWorkspaceTheme(entry: WorkspaceThemeEntry): ComputedTheme {
  const parsed = entry.template ? parseThemeTemplate(entry.template) : null

  if (parsed?.kind === "theme") {
    throw new Error(`Nested theme templates are not supported: ${entry.template}`)
  }

  const templateId =
    parsed?.kind === "catalog"
      ? (parsed.themeCatalogId as ThemeTemplateId)
      : ("default" as ThemeTemplateId)

  const computed = instantiateTheme(
    templateId,
    entry.overrides,
    STOCK_THEMES_BY_ID,
  )

  return {
    ...computed,
    id: entry.id as ThemeInstanceId,
    metadata: {
      ...computed.metadata,
      id: entry.id as ThemeInstanceId,
      name: entry.label ?? computed.metadata.name,
    },
  }
}

/**
 * Returns every computed theme available to a workspace without mutating or persisting
 * derived theme rows. Stock themes come from the catalog; workspace custom/entry themes
 * are materialized from raw source data on demand and can be memoized by callers.
 */
export function computeWorkspaceThemes(
  workspace: WorkspaceThemeSource,
): ComputedTheme[] {
  const byId = new Map<string, ComputedTheme>(
    THEMES.map((theme) => [theme.id, theme]),
  )

  Object.values(workspace.themes ?? {}).forEach((entry) => {
    const computedTheme = materializeWorkspaceTheme(entry)
    byId.set(computedTheme.id, computedTheme)
  })

  return Array.from(byId.values())
}

/**
 * Resolves a theme id or workspace theme ref to a computed in-memory theme.
 * Throws when the ref cannot be resolved from workspace entries or stock themes.
 */
function resolveThemeRef(themeId: string): string {
  if (themeId === "seldonTheme") {
    return WORKSPACE_EDITABLE_THEME_ENTRY_ID
  }
  return themeId
}

export function getComputedTheme(
  themeId: ThemeInstanceId | string,
  workspace: WorkspaceThemeSource,
): ComputedTheme {
  const normalizedThemeId = normalizeThemeId(resolveThemeRef(themeId))
  const theme =
    computeWorkspaceThemes(workspace).find(
      (theme) => theme.id === normalizedThemeId,
    ) ?? THEMES_BY_ID[normalizedThemeId as ThemeTemplateId]

  if (!theme) {
    throw new Error(`Theme ${themeId} not found`)
  }

  return theme
}
