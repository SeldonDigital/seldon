import {
  getThemeTemplateThemeId,
  parseThemeTemplate,
} from "@seldon/core/workspace/model/template-ref"
import type { Workspace } from "@seldon/core/workspace/types"

import { kebabCase } from "../../react/utils/case-utils"

type ThemeEntry = {
  id: string
  type?: string
  label?: string
  template?: string
}

/**
 * Base slug for a root default theme entry. Derives from the stock theme
 * catalog id in `template: "catalog:{id}"` so distinct themes stay unique even
 * when their entries share a generic label like "Default". Falls back to the
 * label or id when the template is missing or not a catalog ref.
 */
function getDefaultEntrySlug(entry: ThemeEntry): string {
  const parsed = parseThemeTemplate(entry.template ?? "")
  if (parsed?.kind === "catalog") {
    return kebabCase(parsed.themeCatalogId)
  }
  return kebabCase(entry.label || entry.id)
}

/**
 * Walks a variant entry up its `theme:{id}` template chain to the root
 * default-type entry and returns that root's slug.
 */
function getRootDefaultSlug(
  entry: ThemeEntry,
  themes: Record<string, ThemeEntry>,
): string {
  const seen = new Set<string>()
  let current: ThemeEntry | undefined = entry

  while (current && current.type === "variant") {
    if (seen.has(current.id)) break
    seen.add(current.id)
    const parentId = getThemeTemplateThemeId(current.template ?? "")
    current = parentId ? themes[parentId] : undefined
  }

  if (current) {
    return getDefaultEntrySlug(current)
  }
  return "default"
}

/**
 * Maps a workspace theme id to a stable, human-readable slug used for both the
 * exported stylesheet filename and its `--sdn-{slug}-` CSS variable prefix.
 *
 * Default-type entries slug from their stock theme catalog id (for example
 * "catalog:highContrast" -> "high-contrast"). Variant entries prepend their
 * root default slug and append their own label (for example "Red" ->
 * "high-contrast-red"). An id without a workspace entry (stock template
 * fallback) slugs from the id.
 */
export function getThemeSlug(themeId: string, workspace: Workspace): string {
  const themes = workspace.themes as Record<string, ThemeEntry> | undefined
  const entry = themes?.[themeId]

  if (!entry) {
    return kebabCase(themeId)
  }

  if (entry.type === "variant") {
    const rootSlug = getRootDefaultSlug(entry, themes ?? {})
    return `${rootSlug}-${kebabCase(entry.label || entry.id)}`
  }

  return getDefaultEntrySlug(entry)
}
