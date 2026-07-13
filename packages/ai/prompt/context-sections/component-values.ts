import { findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { joinCompoundFacetKey } from "@seldon/core/properties/schemas/helpers/property-path"
import {
  getPresetOptions,
  getPropertyOptions,
} from "@seldon/core/properties/schemas/helpers/property-options"
import { getPropertySchema } from "@seldon/core/properties/schemas/helpers/get-property-schema"
import { getThemeLookSection } from "@seldon/core/themes/looks/resolve-theme-look"
import type { Theme } from "@seldon/core/themes/types"
import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import type { Workspace } from "@seldon/core/workspace/types"

import { SHORTHAND_SIDES, propertyShape } from "../property-taxonomy"
import { section } from "./section"

const TITLE =
  "Settable values (pick from the choices listed; a key with only a free value shape is omitted here):"

/**
 * Enumerating the choices a facet accepts, its option keywords or theme tokens
 * or numeric units, lets the model pick a value in one step instead of
 * reasoning about what a property might take. Facets that accept only a free
 * value, such as a text string, report nothing: the choice list would be empty,
 * and the shapes section already tells the model how to write a free value.
 * Returns null when there is no choice worth listing, so the caller drops the
 * row rather than print an empty one.
 */
/** Strips spaces and punctuation so a display name only counts as distinct from
 * its id when it truly differs, e.g. "Tint 4" vs "swatch4" or "Wide" vs "custom1". */
function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

/** The friendly name a theme cell carries, if any, from a scope table. */
function cellName(table: unknown, id: string): string | null {
  if (table && typeof table === "object") {
    const cell = (table as Record<string, unknown>)[id]
    if (cell && typeof cell === "object" && "name" in cell) {
      const name = (cell as { name?: unknown }).name
      if (typeof name === "string" && name.trim() !== "") return name
    }
  }
  return null
}

/**
 * Renders a theme token as `token (Name)` when its computed cell carries a
 * friendly name that differs from the id, so the model can map a user's words
 * ("Tint 4", a custom "Wide" spacing, a named Look) to the token it must
 * reference. Resolves the scope from the token: prefixed tokens (`@padding.custom1`)
 * read their scope table directly; bare tokens read the property's Look section
 * (font, border, gradient, shadow) or fall back to the swatch table for colors.
 */
function annotateThemeToken(
  token: string,
  schemaKey: string,
  theme?: Theme,
): string {
  if (!theme) return token

  let table: unknown
  let id: string
  if (token.startsWith("@")) {
    const dot = token.indexOf(".")
    const scope = dot === -1 ? "" : token.slice(1, dot)
    id = dot === -1 ? token.slice(1) : token.slice(dot + 1)
    table = (theme as unknown as Record<string, unknown>)[scope]
  } else {
    id = token
    table =
      getThemeLookSection(theme, schemaKey) ??
      (theme as unknown as { swatch?: unknown }).swatch
  }

  const name = cellName(table, id)
  if (name && normalizeToken(name) !== normalizeToken(id)) {
    return `${token} (${name})`
  }
  return token
}

function describeChoices(schemaKey: string, theme?: Theme): string | null {
  const schema = getPropertySchema(schemaKey)
  if (!schema) return null
  const supports = schema.supports ?? []
  const parts: string[] = []

  if (supports.includes("option")) {
    const options = getPresetOptions(schemaKey).map(String)
    if (options.length > 0) parts.push(options.join(" / "))
  }
  if (supports.includes("themeOrdinal")) {
    const tokens = getPropertyOptions(schemaKey, "themeOrdinal", theme)
      .map(String)
      .map((token) => annotateThemeToken(token, schemaKey, theme))
    if (tokens.length > 0) parts.push(tokens.join(" / "))
  }
  if (supports.includes("themeCategorical")) {
    const tokens = getPropertyOptions(schemaKey, "themeCategorical", theme)
      .map(String)
      .map((token) => annotateThemeToken(token, schemaKey, theme))
    if (tokens.length > 0) parts.push(tokens.join(" / "))
  }

  const hasChoice = parts.length > 0
  const units = schema.units?.allowed
  if (units && units.length > 0) parts.push(`number (${units.join("|")})`)

  if (!hasChoice && (!units || units.length === 0)) return null
  return parts.join("  ·  ")
}

/**
 * The choice lines for one component: each atomic property, each compound facet,
 * and each shorthand side that accepts a fixed set of values. Layered paint keys
 * (background, shadow) are covered by the shapes section and skipped here, except
 * that their per-facet choices still surface through the facet path. Returns the
 * body lines only, so a caller can wrap them or fold several components together.
 */
export function componentValueLines(catalogId: string, theme?: Theme): string[] {
  const schema = findComponentSchema(catalogId)
  if (!schema?.properties) return []

  const lines: string[] = []
  for (const key of Object.keys(schema.properties)) {
    const shape = propertyShape(key)
    if (shape === "atomic") {
      const choices = describeChoices(key, theme)
      if (choices) lines.push(`- ${key}: ${choices}`)
    } else if (shape === "compound" || shape === "layered") {
      const facets = COMPOUND_FACET_DISPLAY_ORDER[key] ?? []
      for (const facet of facets) {
        const facetKey = joinCompoundFacetKey(key, facet)
        const choices = describeChoices(facetKey, theme)
        if (choices) lines.push(`- ${key}.${facet}: ${choices}`)
      }
    } else if (shape === "shorthand") {
      const choices = describeChoices(key, theme)
      if (choices) {
        const sides = SHORTHAND_SIDES[key] ?? []
        lines.push(`- ${key}.{${sides.join("|")}}: ${choices}`)
      }
    }
  }
  return lines
}

/**
 * Context section: Settable values for one or more components. Theme tokens are
 * read from the workspace's computed theme so the listed ids are real. Theme
 * computation can throw on a malformed workspace, so a failure drops the token
 * choices rather than the section, since option and unit choices still help.
 */
export function componentValuesSection(
  catalogIds: Set<string>,
  workspace: Workspace,
  title: string = TITLE,
): string[] {
  let theme: Theme | undefined
  try {
    theme = computeWorkspaceThemes(workspace)[0] as unknown as Theme | undefined
  } catch {
    theme = undefined
  }

  const body: string[] = []
  const many = catalogIds.size > 1
  for (const catalogId of [...catalogIds].sort()) {
    const lines = componentValueLines(catalogId, theme)
    if (lines.length === 0) continue
    if (many) body.push(`${catalogId}:`)
    body.push(...lines)
  }
  return section(title, body)
}
