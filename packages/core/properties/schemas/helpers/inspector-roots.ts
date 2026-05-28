import { PROPERTY_DISPLAY_ORDER } from "../../constants/property-display"
import { PROPERTY_COMPOUND_CATALOG } from "../../constants/shared/compound-properties"

/**
 * Border sides repeat the full border facet set. They render as facets under the single
 * `border` row, not as their own inspector rows.
 */
const FOLDED_BORDER_SIDES = [
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
]

/** Compound parents shown as one inspector row each. */
const COMPOUND_ROOTS = PROPERTY_COMPOUND_CATALOG.map((entry) => entry.key).filter(
  (key) => !FOLDED_BORDER_SIDES.includes(key),
)

/**
 * `borderCollapse` is a standalone top-level property. The `${parent}${Facet}` join
 * convention collides with `border` + `collapse`, so it is excluded from folding.
 */
const STANDALONE_DESPITE_PREFIX = new Set<string>(["borderCollapse"])

/** Compound parents ordered longest-first so `borderTop*` matches before `border*`. */
const FOLDABLE_PARENTS = [...FOLDED_BORDER_SIDES, ...COMPOUND_ROOTS].sort(
  (a, b) => b.length - a.length,
)

function foldToInspectorRoot(catalogKey: string): string {
  if (STANDALONE_DESPITE_PREFIX.has(catalogKey)) return catalogKey

  for (const parent of FOLDABLE_PARENTS) {
    if (
      catalogKey.length > parent.length &&
      catalogKey.startsWith(parent) &&
      catalogKey[parent.length] === catalogKey[parent.length]!.toUpperCase()
    ) {
      return FOLDED_BORDER_SIDES.includes(parent) ? "border" : parent
    }
  }

  return catalogKey
}

/**
 * Ordered list of top-level inspector rows derived from `PROPERTY_DISPLAY_ORDER`.
 * Flattened facet keys fold into their compound parent (`backgroundColor` -> `background`,
 * border sides -> `border`); standalone atomic and shorthand keys are kept as-is.
 * This is the universe of property rows an inspector can show for any node.
 */
export function getInspectorRootPropertyKeys(): string[] {
  const roots: string[] = []
  const seen = new Set<string>()

  for (const block of PROPERTY_DISPLAY_ORDER) {
    for (const key of block.keys) {
      const root = foldToInspectorRoot(key)
      if (!seen.has(root)) {
        seen.add(root)
        roots.push(root)
      }
    }
  }

  return roots
}
