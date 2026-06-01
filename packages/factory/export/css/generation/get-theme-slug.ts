import { getThemeTemplateThemeId } from "@seldon/core/workspace/model/template-ref"
import type { Workspace } from "@seldon/core/workspace/types"
import { kebabCase } from "../../react/utils/case-utils"

type ThemeEntry = {
  id: string
  type?: string
  label?: string
  template?: string
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
    return kebabCase(current.label || current.id)
  }
  return "default"
}

/**
 * Maps a workspace theme id to a stable, human-readable slug used for both the
 * exported stylesheet filename and its `--sdn-{slug}-` CSS variable prefix.
 *
 * Default-type entries slug from their label (for example "Default" -> "default").
 * Variant entries prepend their root default slug (for example "Red" -> "default-red").
 * An id without a workspace entry (stock template fallback) slugs from the id.
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

  return kebabCase(entry.label || entry.id)
}
