import { STOCK_THEMES_BY_ID } from "../../../../themes/catalog"
import type { ThemeTemplateId } from "../../../../themes/types/theme-id"
import type { EntryTheme } from "../../../model/entry-theme"
import type { Workspace } from "../../../model/workspace"

/**
 * v7: backfill `colorHarmony.parameters.mode` and `chromaChange`.
 *
 * Stock themes now author both parameters, so a theme entry whose template
 * chain reaches a known stock theme resolves them by deep merge and needs no
 * change. This step stamps defaults into an entry's overrides only when the
 * chain cannot supply a value: `chromaChange: 0`, and `mode` from the resolved
 * stock template id, `"dark"` for `industrial` and `"light"` otherwise.
 */

const DARK_STOCK_TEMPLATE_IDS = new Set<string>(["industrial"])

/** Resolves a theme entry's stock template id by following `theme:` links. */
function resolveThemeTemplateId(
  entryId: string,
  themes: Record<string, EntryTheme>,
  seen: Set<string> = new Set(),
): string | undefined {
  if (seen.has(entryId)) return undefined
  seen.add(entryId)
  const entry = themes[entryId]
  if (!entry) return undefined
  const [prefix, suffix] = entry.template.split(":")
  if (prefix === "catalog") return suffix
  if (prefix === "theme" && suffix) {
    return resolveThemeTemplateId(suffix, themes, seen)
  }
  return undefined
}

/** Reads the entry's own `overrides.colorHarmony.parameters` record, if any. */
function overrideColorHarmonyParameters(
  entry: EntryTheme,
): Record<string, unknown> | undefined {
  const colorHarmony = entry.overrides.colorHarmony
  if (!colorHarmony || typeof colorHarmony !== "object") return undefined
  const parameters = (colorHarmony as Record<string, unknown>).parameters
  if (!parameters || typeof parameters !== "object") return undefined
  return parameters as Record<string, unknown>
}

/** True when an override in the entry's template chain supplies `key`. */
function chainOverridesSupply(
  entry: EntryTheme,
  themes: Record<string, EntryTheme>,
  key: string,
  seen: Set<string> = new Set(),
): boolean {
  if (seen.has(entry.id)) return false
  seen.add(entry.id)
  const parameters = overrideColorHarmonyParameters(entry)
  if (parameters && parameters[key] !== undefined) return true
  const [prefix, suffix] = entry.template.split(":")
  if (prefix === "theme" && suffix && themes[suffix]) {
    return chainOverridesSupply(themes[suffix], themes, key, seen)
  }
  return false
}

/** True when the entry cannot resolve `key` from its template chain. */
function entryNeedsStamp(
  entry: EntryTheme,
  themes: Record<string, EntryTheme>,
  key: "mode" | "chromaChange",
): boolean {
  const templateId = resolveThemeTemplateId(entry.id, themes)
  const stockTheme = templateId
    ? STOCK_THEMES_BY_ID[templateId as ThemeTemplateId]
    : undefined
  if (stockTheme) return false
  return !chainOverridesSupply(entry, themes, key)
}

function migrationApplies(workspace: Workspace): boolean {
  return Object.values(workspace.themes).some(
    (entry) =>
      entryNeedsStamp(entry, workspace.themes, "mode") ||
      entryNeedsStamp(entry, workspace.themes, "chromaChange"),
  )
}

export function migrateV7ThemeModeChroma(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)
  const themes = next.themes

  for (const entry of Object.values(themes)) {
    const needsMode = entryNeedsStamp(entry, themes, "mode")
    const needsChroma = entryNeedsStamp(entry, themes, "chromaChange")
    if (!needsMode && !needsChroma) continue

    const overrides = entry.overrides
    const colorHarmony = (overrides.colorHarmony ??= {}) as Record<
      string,
      unknown
    >
    const parameters = (colorHarmony.parameters ??= {}) as Record<
      string,
      unknown
    >

    if (needsMode) {
      const templateId = resolveThemeTemplateId(entry.id, themes)
      parameters.mode =
        templateId && DARK_STOCK_TEMPLATE_IDS.has(templateId) ? "dark" : "light"
    }
    if (needsChroma) {
      parameters.chromaChange = 0
    }
  }

  return next
}
