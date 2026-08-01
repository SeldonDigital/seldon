import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import { type TurnContext, recordStep } from "../../turn-context"
import { rankBySimilarity } from "./embed-rank"
import { describeCandidate } from "./index"
import {
  siblingOrder,
  spatialDirection,
  spatialLabels,
} from "./geometry-labels"

/**
 * Narrows an exhaustive class-match pool down to a bounded, ranked subset --
 * "the top two chips" or "the two texts about cars" -- without touching
 * resolveClassTarget's own exhaustive matching. A directional cue in the
 * query ("top", "last", ...) sorts the pool by real tree geometry, in code;
 * anything else ranks the pool by embedding similarity against the raw
 * query, since the distinguishing content ("about cars") lives outside the
 * bare class noun a caller already matched on. When neither is possible --
 * no directional cue and no embeddings -- narrowing degrades to returning
 * the full pool: an unrequested "too many" is a resolution-count miss the
 * eval can see, never a wrong node silently picked.
 */

export type NarrowResult = { kind: "resolved-many"; nodeIds: string[] }

function narrowBySpatialOrder(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  poolNodeIds: string[],
  direction: "ascending" | "descending",
  count: number,
): string[] | undefined {
  const orderByNodeId = siblingOrder(workspace, boardKey, poolNodeIds)
  const everyPoolNodeHasAnOrder = poolNodeIds.every((nodeId) =>
    orderByNodeId.has(nodeId),
  )
  if (!everyPoolNodeHasAnOrder) return undefined
  const sorted = [...poolNodeIds].sort((nodeIdA, nodeIdB) => {
    const indexA = orderByNodeId.get(nodeIdA)!.index
    const indexB = orderByNodeId.get(nodeIdB)!.index
    return direction === "ascending" ? indexA - indexB : indexB - indexA
  })
  return sorted.slice(0, count)
}

async function narrowBySemanticRank(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  poolNodeIds: string[],
  query: string,
  count: number,
): Promise<string[] | undefined> {
  const spatialLabelsByNodeId = spatialLabels(workspace, boardKey, poolNodeIds)
  const candidates = poolNodeIds.flatMap((nodeId) => {
    const candidate = describeCandidate(
      workspace,
      nodeId,
      spatialLabelsByNodeId.get(nodeId),
    )
    return candidate ? [candidate] : []
  })
  const ranked = await rankBySimilarity(query, candidates)
  const embeddingsAreUnavailable = ranked === null
  if (embeddingsAreUnavailable) return undefined
  return ranked.slice(0, count).map((rankedEntry) => rankedEntry.id)
}

export async function narrowClassTarget(
  context: TurnContext,
  poolNodeIds: string[],
  count: number,
  query: string,
): Promise<NarrowResult> {
  const workspace = context.state.workspace
  const boardKey = context.resolved.resolvedKey

  const direction = spatialDirection(query)
  const narrowedNodeIds =
    direction !== undefined
      ? narrowBySpatialOrder(workspace, boardKey, poolNodeIds, direction, count)
      : await narrowBySemanticRank(workspace, boardKey, poolNodeIds, query, count)

  if (narrowedNodeIds === undefined) {
    recordStep(context, "narrow_target", {
      ok: false,
      output: `Could not narrow to ${count}: no spatial cue and embeddings unavailable. Returning all ${poolNodeIds.length} matches.`,
    })
    return { kind: "resolved-many", nodeIds: poolNodeIds }
  }

  recordStep(context, "narrow_target", {
    ok: true,
    output:
      direction !== undefined
        ? `Narrowed ${poolNodeIds.length} matches to the ${direction === "ascending" ? "first" : "last"} ${count} by tree order (deterministic, no model call).`
        : `Narrowed ${poolNodeIds.length} matches to the top ${count} by embedding similarity to "${query}" (no model call).`,
  })

  return { kind: "resolved-many", nodeIds: narrowedNodeIds }
}
