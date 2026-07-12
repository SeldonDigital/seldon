import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const TITLE =
  "Theme tokens (reference as @scope.key, for example @swatch.primary):"

/**
 * Seldon prefers theme references over literals for color, spacing, corners, and
 * shadows, but an `@scope.key` reference only resolves if the key exists. These
 * are the scopes worth referencing from component properties; structural theme
 * metadata is left out to keep the list actionable.
 */
const TOKEN_SCOPES = [
  "swatch",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "size",
  "margin",
  "padding",
  "gap",
  "corners",
  "borderWidth",
  "font",
  "border",
  "gradient",
  "shadow",
] as const

/**
 * Context section: Theme tokens.
 *
 * Listing the real token ids lets the model reference tokens instead of
 * inventing them. The reserved token key sets are shared across themes, so one
 * computed theme is a faithful sample of the ids any theme exposes. Theme
 * computation can throw on a malformed workspace; a failure drops the section
 * rather than the whole context, since references are a convenience the model
 * can work without.
 */
export function themeTokensSection(workspace: Workspace): string[] {
  const body = themeTokenLines(workspace)
  return section(TITLE, body)
}

/**
 * Context section: Theme token search.
 *
 * The full token list is large, and most edits reference a handful of tokens. A
 * query matches a scope name or a token key, so the model can pull just the
 * `@swatch.*` set or the tokens whose id contains "primary" instead of the whole
 * table. Falls back to nothing when no token matches, so the caller can report a
 * clean miss.
 */
export function searchThemeTokensSection(
  workspace: Workspace,
  query: string,
): string[] {
  const needle = query.trim().toLowerCase()
  if (needle === "") return []

  const lines: string[] = []
  for (const line of themeTokenLines(workspace)) {
    const [scopeLabel] = line.split(":")
    const scope = scopeLabel.replace(/^@/, "")
    const keys = line.slice(line.indexOf(":") + 1).trim().split(", ")
    const scopeHit = scope.toLowerCase().includes(needle)
    const matched = scopeHit
      ? keys
      : keys.filter((key) => key.toLowerCase().includes(needle))
    if (matched.length === 0) continue
    lines.push(`@${scope}: ${matched.join(", ")}`)
  }

  return section(
    `Theme tokens matching "${query}" (reference as @scope.key):`,
    lines,
  )
}

function themeTokenLines(workspace: Workspace): string[] {
  try {
    const computed = computeWorkspaceThemes(workspace)
    const theme = computed[0]
    if (!theme) return []
    const lines: string[] = []
    for (const scope of TOKEN_SCOPES) {
      const table = (theme as unknown as Record<string, unknown>)[scope]
      if (!table || typeof table !== "object") continue
      const keys = Object.keys(table as Record<string, unknown>)
      if (keys.length === 0) continue
      lines.push(`@${scope}: ${keys.join(", ")}`)
    }
    return lines
  } catch {
    return []
  }
}
