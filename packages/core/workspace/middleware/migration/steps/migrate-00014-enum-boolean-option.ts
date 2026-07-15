import type { Workspace } from "../../../model/workspace"

/**
 * v14: make closed-set properties option-tagged.
 *
 * Enum and on/off boolean properties are now `option`-only in core, so a stored
 * `exact` cell for one of them is an invalid shape. This step walks every board
 * `componentProperties`, node `overrides`, and node `states`, and rewrites any
 * cell keyed by a convert property from `{ type: "exact" }` to
 * `{ type: "option" }`, keeping the value. This includes the `exact: false`
 * cells the v13 step wrote for `clip` and `wrapChildren` before they narrowed
 * to option-only.
 *
 * Keyed by property name like the v13 step, since none of these keys double as a
 * compound facet. Only `exact` cells are touched, so `empty`, `inherit`, and
 * already-`option` cells are left alone. Guarded and idempotent, safe to re-run.
 */

const CONVERT_KEYS = new Set([
  "direction",
  "orientation",
  "align",
  "cellAlign",
  "display",
  "resize",
  "screenSize",
  "imageFit",
  "inputType",
  "role",
  "preload",
  "trackKind",
  "fontStyle",
  "ariaLive",
  "ariaCurrent",
  "ariaHasPopup",
  "ariaInvalid",
  "ariaPressed",
  "ariaChecked",
  "wrapChildren",
  "clip",
  "wrapText",
  "gradientRepeat",
  "checked",
  "ariaHidden",
  "ariaSelected",
  "ariaRequired",
  "ariaReadonly",
  "ariaExpanded",
  "ariaDisabled",
  "controls",
  "autoPlay",
  "loop",
  "muted",
  "trackDefault",
])

/** True when a value is a tagged property cell of `exact` type. */
function isExactCell(cell: unknown): boolean {
  if (!cell || typeof cell !== "object") return false
  return (cell as { type?: unknown }).type === "exact"
}

/** True when a value tree holds a convert-key cell still tagged `exact`. */
function treeNeedsRewrite(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(treeNeedsRewrite)
  }
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>

  for (const [key, sub] of Object.entries(record)) {
    if (CONVERT_KEYS.has(key) && isExactCell(sub)) return true
    if (treeNeedsRewrite(sub)) return true
  }

  return false
}

/** Rewrites convert-key `exact` cells to `option`, in place. */
function rewriteTree(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteTree(item)
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>

  for (const [key, sub] of Object.entries(record)) {
    if (CONVERT_KEYS.has(key) && isExactCell(sub)) {
      record[key] = { ...(sub as object), type: "option" }
      continue
    }
    rewriteTree(sub)
  }
}

/** True when any board, node, or node state holds a target cell to rewrite. */
function migrationApplies(workspace: Workspace): boolean {
  for (const board of Object.values(workspace.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties && treeNeedsRewrite(componentProperties)) {
      return true
    }
  }

  for (const node of Object.values(workspace.nodes)) {
    if (treeNeedsRewrite(node.overrides)) return true
    if (node.states && treeNeedsRewrite(node.states)) return true
  }

  return false
}

export function migrateV14EnumBooleanOption(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const board of Object.values(next.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties) rewriteTree(componentProperties)
  }

  for (const node of Object.values(next.nodes)) {
    rewriteTree(node.overrides)
    if (node.states) rewriteTree(node.states)
  }

  return next
}
