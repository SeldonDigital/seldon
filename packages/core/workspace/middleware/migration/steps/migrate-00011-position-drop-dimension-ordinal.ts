import type { Workspace } from "../../../model/workspace"

/**
 * v11: drop theme dimension ordinals from layout position insets.
 *
 * The layout `position` property no longer accepts a `themeOrdinal`
 * (`@dimension.*`) reference on its `top` / `right` / `bottom` / `left` edges;
 * an inset now takes a measured length only. This step rewrites any position
 * edge still holding a `themeOrdinal` cell to EMPTY so the value falls back to
 * unset instead of an unsupported reference.
 *
 * Only the layout `position` bag is touched. Margin, padding, and corners keep
 * their own theme ordinals, and the background layer `position` facet stores an
 * anchor or measure rather than edge keys, so neither matches here.
 */

const POSITION_SIDES = ["top", "right", "bottom", "left"] as const
const THEME_ORDINAL = "themeOrdinal"

const EMPTY_CELL = { type: "empty", value: null } as const

/** A plain, untagged object is a candidate container to recurse into. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !("type" in (value as Record<string, unknown>))
  )
}

/** True when a cell is a `{ type: "themeOrdinal", ... }` reference. */
function isThemeOrdinalCell(cell: unknown): boolean {
  return (
    !!cell &&
    typeof cell === "object" &&
    (cell as { type?: unknown }).type === THEME_ORDINAL
  )
}

/** True when a value is a layout position bag carrying edge keys. */
function isPositionBag(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value) && POSITION_SIDES.some((side) => side in value)
}

function positionBagHasThemeOrdinal(bag: Record<string, unknown>): boolean {
  return POSITION_SIDES.some((side) => isThemeOrdinalCell(bag[side]))
}

/** True when a value tree holds a position inset with a theme ordinal edge. */
function treeHasThemeOrdinalInset(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(treeHasThemeOrdinalInset)
  }
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>

  if (
    isPositionBag(record.position) &&
    positionBagHasThemeOrdinal(record.position)
  ) {
    return true
  }

  return Object.values(record).some(treeHasThemeOrdinalInset)
}

/** Rewrites theme ordinal position edges to EMPTY in a value tree, in place. */
function rewriteThemeOrdinalInsets(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteThemeOrdinalInsets(item)
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>

  if (isPositionBag(record.position)) {
    const bag = record.position as Record<string, unknown>
    for (const side of POSITION_SIDES) {
      if (isThemeOrdinalCell(bag[side])) {
        bag[side] = { ...EMPTY_CELL }
      }
    }
  }

  for (const sub of Object.values(record)) rewriteThemeOrdinalInsets(sub)
}

/** True when any board, node, or node state holds a theme ordinal inset. */
function migrationApplies(workspace: Workspace): boolean {
  for (const board of Object.values(workspace.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties && treeHasThemeOrdinalInset(componentProperties)) {
      return true
    }
  }

  for (const node of Object.values(workspace.nodes)) {
    if (treeHasThemeOrdinalInset(node.overrides)) return true
    if (node.states && treeHasThemeOrdinalInset(node.states)) return true
  }

  return false
}

export function migrateV11PositionDropDimensionOrdinal(
  workspace: Workspace,
): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const board of Object.values(next.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties) rewriteThemeOrdinalInsets(componentProperties)
  }

  for (const node of Object.values(next.nodes)) {
    rewriteThemeOrdinalInsets(node.overrides)
    if (node.states) rewriteThemeOrdinalInsets(node.states)
  }

  return next
}
