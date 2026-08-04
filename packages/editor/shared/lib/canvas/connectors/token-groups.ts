/**
 * The token badge groups and the top-level inspector property keys each one draws.
 *
 * A group maps to a View menu toggle and clusters its badges together in the gutter.
 * Keys are inspector root keys, so a compound like `background` or `font` is one key
 * that draws one badge and expands its facets inside the card.
 *
 * Everything here is a plain description shared by both editors, so both place the
 * same badges in the same groups from the same selection.
 */
export type TokenBadgeGroup =
  | "layout"
  | "space"
  | "dimension"
  | "appearance"
  | "typography"
  | "effects"

export interface TokenGroupDefinition {
  group: TokenBadgeGroup
  keys: string[]
}

/**
 * The groups in the order they read down the gutter, each with its property keys in
 * the order they read within the cluster.
 */
export const TOKEN_BADGE_GROUPS: TokenGroupDefinition[] = [
  { group: "layout", keys: ["direction", "orientation", "align"] },
  { group: "dimension", keys: ["width", "height", "rotation"] },
  { group: "space", keys: ["margin", "padding", "gap"] },
  { group: "appearance", keys: ["color", "opacity", "background", "border", "corners"] },
  { group: "typography", keys: ["font", "textAlign"] },
  { group: "effects", keys: ["shadow"] },
]
