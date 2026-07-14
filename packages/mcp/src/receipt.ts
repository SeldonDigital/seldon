import { isDeepStrictEqual } from "node:util"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Diff-derived change receipts: counts of entities
 * added/modified/removed per collection, ids of created entities (so
 * follow-up batches can target them), and per-action no-op flags
 * ("accepted but changed nothing"). Never the workspace itself.
 *
 * Handlers are pure and Immer-based (verified by the reducer-purity suite),
 * so untouched entries keep their object identity across a dispatch —
 * reference equality proves "unchanged". The reverse does not hold: some
 * handlers rebuild an entry without changing its contents (e.g.
 * `set_node_properties` re-merges the overrides bag even when the values are
 * identical), so entries whose reference changed are confirmed with a deep
 * comparison. Only touched entries pay that cost.
 */
export interface CollectionDelta {
  added: number
  modified: number
  removed: number
}

export interface ActionOutcome {
  index: number
  type: string
  /** True when the action was accepted but changed nothing. */
  noop: boolean
  /** Ids of entities this action created, across all collections. */
  createdIds: string[]
}

export interface BatchReceipt {
  applied: number
  summary: Record<CollectionName, CollectionDelta>
  /** Ids of entities the whole batch created, per collection. */
  createdIds: Record<CollectionName, string[]>
  actions: ActionOutcome[]
}

const COLLECTIONS = [
  ["nodes", "nodes"],
  ["boards", "boards"],
  ["playgrounds", "playgrounds"],
  ["themes", "themes"],
  ["font-collections", "fontCollections"],
  ["icon-sets", "iconSets"],
  ["media", "media"],
] as const

type CollectionKey = (typeof COLLECTIONS)[number][0]
export type CollectionName = (typeof COLLECTIONS)[number][1]

interface MapDiff {
  addedIds: string[]
  modified: number
  removed: number
}

/**
 * Diffs two entity maps. Reference inequality on an entry present in both is
 * verified with a deep comparison before it counts as modified.
 */
export function diffEntityMaps(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): MapDiff {
  if (before === after) return { addedIds: [], modified: 0, removed: 0 }

  const addedIds: string[] = []
  let modified = 0
  let removed = 0

  for (const key of Object.keys(after)) {
    if (!(key in before)) {
      addedIds.push(key)
    } else if (
      before[key] !== after[key] &&
      !isDeepStrictEqual(before[key], after[key])
    ) {
      modified++
    }
  }
  for (const key of Object.keys(before)) {
    if (!(key in after)) removed++
  }

  return { addedIds, modified, removed }
}

function getCollection(
  workspace: Workspace,
  key: CollectionKey,
): Record<string, unknown> {
  return workspace[key] as Record<string, unknown>
}

function diffWorkspaces(
  before: Workspace,
  after: Workspace,
): { deltas: Record<CollectionName, MapDiff>; changed: boolean } {
  const deltas = {} as Record<CollectionName, MapDiff>
  let changed = false

  for (const [key, name] of COLLECTIONS) {
    const diff = diffEntityMaps(
      getCollection(before, key),
      getCollection(after, key),
    )
    deltas[name] = diff
    if (diff.addedIds.length > 0 || diff.modified > 0 || diff.removed > 0) {
      changed = true
    }
  }

  if (
    !changed &&
    before.metadata !== after.metadata &&
    !isDeepStrictEqual(before.metadata, after.metadata)
  ) {
    changed = true
  }

  return { deltas, changed }
}

/** One reducer step: the workspace before and after a single action. */
export interface BatchStep {
  type: string
  before: Workspace
  after: Workspace
}

export function buildReceipt(steps: BatchStep[]): BatchReceipt {
  const first = steps[0]!
  const last = steps[steps.length - 1]!

  const overall = diffWorkspaces(first.before, last.after)
  const summary = {} as Record<CollectionName, CollectionDelta>
  const createdIds = {} as Record<CollectionName, string[]>
  for (const [, name] of COLLECTIONS) {
    const diff = overall.deltas[name]
    summary[name] = {
      added: diff.addedIds.length,
      modified: diff.modified,
      removed: diff.removed,
    }
    createdIds[name] = diff.addedIds
  }

  const actions = steps.map((step, index): ActionOutcome => {
    if (step.after === step.before) {
      return { index, type: step.type, noop: true, createdIds: [] }
    }
    const stepDiff = diffWorkspaces(step.before, step.after)
    const stepCreated = Object.values(stepDiff.deltas).flatMap(
      (diff) => diff.addedIds,
    )
    return {
      index,
      type: step.type,
      noop: !stepDiff.changed,
      createdIds: stepCreated,
    }
  })

  return { applied: steps.length, summary, createdIds, actions }
}
