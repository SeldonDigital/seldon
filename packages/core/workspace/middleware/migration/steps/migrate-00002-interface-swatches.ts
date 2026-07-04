import type { EntryTheme } from "../../../model/entry-theme"
import type { Workspace } from "../../../model/workspace"

/**
 * v2: promote custom swatch refs to interface swatch ids.
 *
 * Stock themes moved their semantic `customN` swatches into reserved interface
 * slots (`active`, `punch`, `positive`, ...). This step rewrites every
 * `@swatch.customN` reference in node overrides, and every promoted swatch key
 * inside theme entry overrides, to the matching interface id for the theme the
 * reference resolves against.
 *
 * Non-promoted `customN` keep their ids. Nodes with no explicit theme resolve
 * against the Seldon map, matching the workspace default theme.
 */

/** old `customN` -> interface id, per stock theme template id. */
const PROMOTION_MAPS: Record<string, Record<string, string>> = {
  seldon: {
    custom1: "active",
    custom2: "punch",
    custom3: "positive",
    custom4: "negative",
    custom5: "warning",
    custom6: "accent",
    custom7: "offBlack",
    custom8: "offWhite",
  },
  highContrast: {
    custom1: "active",
    custom2: "punch",
    custom3: "positive",
    custom4: "negative",
    custom5: "warning",
    custom6: "accent",
    custom7: "offBlack",
    custom8: "offWhite",
  },
  industrial: {
    custom1: "negative",
    custom2: "positive",
    custom3: "active",
    custom4: "warning",
    custom5: "offBlack",
  },
  sky: {
    custom1: "negative",
    custom2: "punch",
    custom3: "positive",
    custom4: "offBlack",
  },
  royalAzure: {
    custom1: "offBlack",
    custom2: "positive",
    custom3: "active",
    custom4: "warning",
    custom5: "accent",
    custom6: "offWhite",
  },
  sunsetBlue: {
    custom1: "offBlack",
    custom2: "positive",
    custom3: "active",
    custom4: "warning",
    custom5: "accent",
    custom6: "offWhite",
  },
  wildberry: {
    custom1: "offBlack",
    custom2: "positive",
    custom3: "active",
    custom4: "warning",
    custom5: "accent",
    custom6: "offWhite",
  },
  material: {
    custom3: "negative",
  },
  pop: {
    custom4: "offBlack",
  },
  earth: {},
}

const DEFAULT_THEME_TEMPLATE = "seldon"

const SWATCH_REF = /^@swatch\.(custom\d+)$/

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

/** True when a value tree holds a `@swatch.customN` ref that `map` promotes. */
function treeHasPromotableRef(
  value: unknown,
  map: Record<string, string>,
): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => treeHasPromotableRef(item, map))
  }
  if (!value || typeof value !== "object") return false
  for (const sub of Object.values(value as Record<string, unknown>)) {
    if (typeof sub === "string") {
      const match = SWATCH_REF.exec(sub)
      if (match && map[match[1]!]) return true
    } else if (treeHasPromotableRef(sub, map)) {
      return true
    }
  }
  return false
}

/** True when theme `swatch` overrides hold a key that `map` promotes. */
function themeOverridesNeedRewrite(
  overrides: Record<string, unknown>,
  map: Record<string, string>,
): boolean {
  const swatch = overrides.swatch
  if (swatch && typeof swatch === "object" && !Array.isArray(swatch)) {
    const swatchRecord = swatch as Record<string, unknown>
    for (const oldId of Object.keys(map)) {
      if (oldId in swatchRecord) return true
    }
  }
  return treeHasPromotableRef(overrides, map)
}

/** Rewrites `@swatch.customN` strings in a value tree using `map`, in place. */
function rewriteSwatchRefs(value: unknown, map: Record<string, string>): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteSwatchRefs(item, map)
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>
  for (const [key, sub] of Object.entries(record)) {
    if (typeof sub === "string") {
      const match = SWATCH_REF.exec(sub)
      const promoted = match && map[match[1]!]
      if (promoted) {
        record[key] = `@swatch.${promoted}`
      }
      continue
    }
    rewriteSwatchRefs(sub, map)
  }
}

/** Renames promoted `customN` keys inside a theme entry's `swatch` overrides. */
function renameThemeSwatchKeys(
  overrides: Record<string, unknown>,
  map: Record<string, string>,
): void {
  const swatch = overrides.swatch
  if (!swatch || typeof swatch !== "object" || Array.isArray(swatch)) return
  const swatchRecord = swatch as Record<string, unknown>
  for (const [oldId, newId] of Object.entries(map)) {
    if (oldId in swatchRecord) {
      swatchRecord[newId] = swatchRecord[oldId]
      delete swatchRecord[oldId]
    }
  }
}

/** Resolves the promotion map a board's component properties rewrite against. */
function boardPromotionMap(
  board: unknown,
  themes: Record<string, EntryTheme>,
): Record<string, string> | undefined {
  const componentTheme = (board as { componentTheme?: string }).componentTheme
  const templateId = componentTheme
    ? resolveThemeTemplateId(componentTheme, themes)
    : DEFAULT_THEME_TEMPLATE
  const map = templateId ? PROMOTION_MAPS[templateId] : undefined
  return map && Object.keys(map).length > 0 ? map : undefined
}

/** Resolves the promotion map a node's overrides rewrite against. */
function nodePromotionMap(
  node: { theme?: string | null },
  themes: Record<string, EntryTheme>,
): Record<string, string> | undefined {
  const templateId = node.theme
    ? resolveThemeTemplateId(node.theme, themes)
    : DEFAULT_THEME_TEMPLATE
  const map = templateId ? PROMOTION_MAPS[templateId] : undefined
  return map && Object.keys(map).length > 0 ? map : undefined
}

/** Resolves the promotion map a theme entry's overrides rewrite against. */
function themePromotionMap(
  entry: EntryTheme,
  themes: Record<string, EntryTheme>,
): Record<string, string> | undefined {
  const templateId = resolveThemeTemplateId(entry.id, themes)
  const map = templateId ? PROMOTION_MAPS[templateId] : undefined
  return map && Object.keys(map).length > 0 ? map : undefined
}

/** True when any board, node, or theme entry holds a promotable ref or key. */
function migrationApplies(workspace: Workspace): boolean {
  const themes = workspace.themes

  for (const board of Object.values(workspace.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (!componentProperties) continue
    const map = boardPromotionMap(board, themes)
    if (map && treeHasPromotableRef(componentProperties, map)) return true
  }

  for (const node of Object.values(workspace.nodes)) {
    const map = nodePromotionMap(node, themes)
    if (!map) continue
    if (treeHasPromotableRef(node.overrides, map)) return true
    if (node.states && treeHasPromotableRef(node.states, map)) return true
  }

  for (const entry of Object.values(themes)) {
    const map = themePromotionMap(entry, themes)
    if (map && themeOverridesNeedRewrite(entry.overrides, map)) return true
  }

  return false
}

export function migrateV2InterfaceSwatches(workspace: Workspace): Workspace {
  // Nothing to rewrite keeps the input reference, so already-clean workspaces
  // skip the clone. The reducer hands us a deeply frozen state, so when there
  // is work, rewrite a clone in place instead of the frozen original.
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)
  const themes = next.themes

  for (const board of Object.values(next.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (!componentProperties) continue
    const map = boardPromotionMap(board, themes)
    if (map) rewriteSwatchRefs(componentProperties, map)
  }

  for (const node of Object.values(next.nodes)) {
    const map = nodePromotionMap(node, themes)
    if (!map) continue
    // Walk the whole node so refs in the Normal `overrides` bag and any
    // per-state override bags are rewritten. Only `@swatch.customN` strings
    // change, so `template` and `theme` fields are untouched.
    rewriteSwatchRefs(node.overrides, map)
    if (node.states) rewriteSwatchRefs(node.states, map)
  }

  for (const entry of Object.values(themes)) {
    const map = themePromotionMap(entry, themes)
    if (!map) continue
    renameThemeSwatchKeys(entry.overrides, map)
    rewriteSwatchRefs(entry.overrides, map)
  }

  return next
}
