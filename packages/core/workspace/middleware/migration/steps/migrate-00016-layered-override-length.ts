import {
  getEffectiveNodeProperties,
  getInheritedNodeProperties,
} from "../../../compute/compute-node-properties"
import type { Workspace } from "../../../model/workspace"

/**
 * v16: pad short layered paint overrides up to their baseline stack length.
 *
 * A node's `background` / `shadow` override is now authoritative for the layer
 * count: a shorter override truncates the inherited tail instead of keeping it.
 * Files authored before this change store short overrides that relied on the
 * old merge keeping the longer inherited stack. This step pads each such
 * override with trailing empty bags up to the baseline length, so the visible
 * stack does not change on load. Users then remove unwanted layers explicitly.
 *
 * Node overrides pad up to the inherited stack (the node's stack without its own
 * override). State overrides pad up to the node's normal effective stack, which
 * is the base a state layers over.
 */

const LAYERED_KEYS = ["background", "shadow"] as const

function stackLength(value: unknown): number {
  if (Array.isArray(value)) return value.length
  return value ? 1 : 0
}

/**
 * Pads every layered array in `bag` up to the matching baseline length with
 * trailing empty bags. Returns true when it changed anything.
 */
function padLayeredArrays(
  bag: Record<string, unknown> | undefined,
  baseLength: Record<string, number>,
): boolean {
  if (!bag || typeof bag !== "object") return false
  let changed = false
  for (const key of LAYERED_KEYS) {
    const value = bag[key]
    if (!Array.isArray(value)) continue
    const target = baseLength[key] ?? 0
    while (value.length < target) {
      value.push({})
      changed = true
    }
  }
  return changed
}

export function migrateV16LayeredOverrideLength(
  workspace: Workspace,
): Workspace {
  const next = structuredClone(workspace)
  let changed = false

  for (const [nodeId, node] of Object.entries(next.nodes)) {
    // Lengths come from the original workspace so padding one node never shifts
    // the baseline another node reads. Empty-bag padding preserves visuals, so
    // the baseline lengths are stable regardless.
    const inherited = getInheritedNodeProperties(nodeId, workspace)
    const inheritedLengths: Record<string, number> = {}
    for (const key of LAYERED_KEYS) {
      inheritedLengths[key] = stackLength(inherited[key])
    }
    if (padLayeredArrays(node.overrides, inheritedLengths)) changed = true

    if (node.states) {
      const effective = getEffectiveNodeProperties(nodeId, workspace)
      const effectiveLengths: Record<string, number> = {}
      for (const key of LAYERED_KEYS) {
        effectiveLengths[key] = stackLength(effective[key])
      }
      for (const stateBag of Object.values(node.states)) {
        if (
          padLayeredArrays(
            stateBag as Record<string, unknown>,
            effectiveLengths,
          )
        ) {
          changed = true
        }
      }
    }
  }

  return changed ? next : workspace
}
