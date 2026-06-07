import merge from "lodash/merge"

import { STOCK_THEMES_BY_ID, THEMES, THEMES_BY_ID } from "../../themes/catalog"
import { instantiateTheme } from "../../themes/compute/instantiate-theme"
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

type WorkspaceThemeEntries = Record<string, WorkspaceThemeEntry>

interface WorkspaceThemeSource {
  themes?: WorkspaceThemeEntries
}

function normalizeThemeId(themeId: string): string {
  const parsed = parseThemeTemplate(themeId)
  if (parsed?.kind === "catalog") return parsed.themeCatalogId
  if (parsed?.kind === "theme") return parsed.themeId
  return themeId
}

/**
 * Resolves the stock template id and the override layers for a theme entry.
 *
 * Variant themes use `template: theme:{themeId}`, so the chain walks parent
 * entries until it reaches a `catalog:{themeCatalogId}` template. Override layers
 * return base-first: parent overrides come before the entry's own overrides so
 * the entry wins on merge.
 */
function resolveThemeChain(
  entry: WorkspaceThemeEntry,
  themesById: WorkspaceThemeEntries,
  seen: Set<string>,
): {
  templateId: ThemeTemplateId
  overrides: Array<Record<string, unknown> | undefined>
} {
  if (seen.has(entry.id)) {
    throw new Error(`Theme template cycle detected at: ${entry.id}`)
  }
  seen.add(entry.id)

  const parsed = entry.template ? parseThemeTemplate(entry.template) : null

  if (parsed?.kind === "theme") {
    const parentEntry = themesById[parsed.themeId]
    if (!parentEntry) {
      return {
        templateId: "seldon" as ThemeTemplateId,
        overrides: [entry.overrides],
      }
    }
    const parent = resolveThemeChain(parentEntry, themesById, seen)
    return {
      templateId: parent.templateId,
      overrides: [...parent.overrides, entry.overrides],
    }
  }

  const templateId =
    parsed?.kind === "catalog"
      ? (parsed.themeCatalogId as ThemeTemplateId)
      : ("seldon" as ThemeTemplateId)

  return { templateId, overrides: [entry.overrides] }
}

function materializeWorkspaceTheme(
  entry: WorkspaceThemeEntry,
  themesById: WorkspaceThemeEntries,
): ComputedTheme {
  const { templateId, overrides } = resolveThemeChain(
    entry,
    themesById,
    new Set<string>(),
  )

  const mergedOverrides = merge(
    {},
    ...overrides.map((layer) => layer ?? {}),
  ) as Record<string, unknown>

  const computed = instantiateTheme(
    templateId,
    mergedOverrides,
    STOCK_THEMES_BY_ID,
  )

  return {
    ...computed,
    id: entry.id as ThemeInstanceId,
    metadata: {
      ...computed.metadata,
      id: entry.id as ThemeInstanceId,
      name: computed.metadata.name,
    },
  }
}

/**
 * Caches computed themes by the workspace `themes` object reference. Reducers build
 * new `themes` references through Immer when a theme changes, so unchanged workspaces
 * (selection, expansion, and edits that do not touch themes) reuse the cached result.
 */
const computedThemesCache = new WeakMap<object, ComputedTheme[]>()

/**
 * Returns every computed theme available to a workspace without mutating or persisting
 * derived theme rows. Stock themes come from the catalog; workspace custom/entry themes
 * are materialized from raw source data on demand. Results are memoized by the workspace
 * `themes` reference.
 */
export function computeWorkspaceThemes(
  workspace: WorkspaceThemeSource,
): ComputedTheme[] {
  const themesSource = workspace.themes

  if (themesSource) {
    const cached = computedThemesCache.get(themesSource)
    if (cached) return cached
  }

  const byId = new Map<string, ComputedTheme>(
    THEMES.map((theme) => [theme.id, theme]),
  )

  const themesById = themesSource ?? {}
  Object.values(themesById).forEach((entry) => {
    const computedTheme = materializeWorkspaceTheme(entry, themesById)
    byId.set(computedTheme.id, computedTheme)
  })

  const result = Array.from(byId.values())

  if (themesSource) {
    computedThemesCache.set(themesSource, result)
  }

  return result
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
