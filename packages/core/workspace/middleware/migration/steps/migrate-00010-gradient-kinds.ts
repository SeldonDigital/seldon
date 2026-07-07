import type { Workspace } from "../../../model/workspace"

/**
 * v10: split the single `gradient` background kind into explicit kinds.
 *
 * Background gradient layers used to store `kind: gradient` plus a `gradientType`
 * facet (`linear` | `radial` | `conic`). The kind is now explicit, so this step
 * rewrites every background layer with `kind === "gradient"` to
 * `linearGradient` / `radialGradient` / `conicGradient` from its `gradientType`,
 * then drops the now-redundant `gradientType` facet.
 *
 * Theme gradient looks keep their `gradientType` parameter (it scopes presets by
 * kind) and have no `kind` facet, so they are left untouched. The walker matches
 * only objects carrying a background `kind` cell.
 */

const LEGACY_GRADIENT_KIND = "gradient"

const GRADIENT_TYPE_TO_KIND: Record<string, string> = {
  linear: "linearGradient",
  radial: "radialGradient",
  conic: "conicGradient",
}

/** Reads the option value from a `{ type: "option", value }` cell, if present. */
function readOptionValue(cell: unknown): string | undefined {
  if (!cell || typeof cell !== "object") return undefined
  const value = (cell as { value?: unknown }).value
  return typeof value === "string" ? value : undefined
}

/** True when a value tree holds a background layer with the legacy gradient kind. */
function treeHasLegacyGradient(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(treeHasLegacyGradient)
  }
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  if (readOptionValue(record.kind) === LEGACY_GRADIENT_KIND) return true
  return Object.values(record).some(treeHasLegacyGradient)
}

/** Rewrites legacy gradient layers in a value tree, in place. */
function rewriteGradientLayers(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteGradientLayers(item)
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>

  if (readOptionValue(record.kind) === LEGACY_GRADIENT_KIND) {
    const gradientType = readOptionValue(record.gradientType) ?? "linear"
    const nextKind = GRADIENT_TYPE_TO_KIND[gradientType] ?? "linearGradient"
    ;(record.kind as { value: unknown }).value = nextKind
    delete record.gradientType
  }

  for (const sub of Object.values(record)) rewriteGradientLayers(sub)
}

/** True when any board, node, or node state holds a legacy gradient layer. */
function migrationApplies(workspace: Workspace): boolean {
  for (const board of Object.values(workspace.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties && treeHasLegacyGradient(componentProperties)) {
      return true
    }
  }

  for (const node of Object.values(workspace.nodes)) {
    if (treeHasLegacyGradient(node.overrides)) return true
    if (node.states && treeHasLegacyGradient(node.states)) return true
  }

  return false
}

export function migrateV10GradientKinds(workspace: Workspace): Workspace {
  if (!migrationApplies(workspace)) return workspace

  const next = structuredClone(workspace)

  for (const board of Object.values(next.boards)) {
    const componentProperties = (board as { componentProperties?: unknown })
      .componentProperties
    if (componentProperties) rewriteGradientLayers(componentProperties)
  }

  for (const node of Object.values(next.nodes)) {
    rewriteGradientLayers(node.overrides)
    if (node.states) rewriteGradientLayers(node.states)
  }

  return next
}
