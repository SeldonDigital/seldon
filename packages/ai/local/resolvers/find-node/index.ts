import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import { nodeStringsSummary } from "../../../prompt/context-sections/node-strings"
import {
  type FindNodeCandidate,
  buildFindNodeEscalateStage,
  findNodeMissMessage,
} from "../../../prompt/stages/find-node"
import { callOllamaFormat } from "../../ollama-client"
import { type TurnContext, recordStep } from "../../turn-context"
import type { MessageReason } from "../resolve-target"
import { rankBySimilarity } from "./embed-rank"
import { spatialLabels } from "./geometry-labels"

/**
 * The embedding-based find_node: matches a natural-language phrase against
 * the active board's nodes without ever serializing the tree into a model
 * prompt. Candidates are stringified (component, label, string values, and a
 * geometry-derived spatial label), ranked by local embedding similarity, and
 * only an ambiguous ranking escalates to one narrow enum-constrained pick
 * over the top few candidates. Resolution follows the uniform contract:
 * one node id, or one terminal clarification.
 */

export type FindNodeResult =
  | { kind: "resolved"; nodeId: string }
  | { kind: "message"; text: string; reason: MessageReason }

type Candidate = FindNodeCandidate

/** Top-two score gap below which the ranking counts as ambiguous. */
const ESCALATION_MARGIN = 0.04
/** How many ranked candidates the escalation call chooses among. */
const ESCALATION_POOL = 6
/** Most candidates the no-embeddings fallback will offer the model. */
const FALLBACK_POOL = 12
/** How many ranked candidates the transcript's ranking step lists. */
const RANKING_PREVIEW_COUNT = 5

/** Every node on the board as an embeddable candidate string. */
function collectCandidates(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
): Candidate[] {
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) return []
  const activeBoard = workspace.boards[boardKey]
  const boardCannotBeSearched =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard))
  if (boardCannotBeSearched) return []

  const nodeIds: string[] = []
  walkBoardTreeRefs(activeBoard.variants, (ref) => {
    nodeIds.push(ref.id)
  })
  const spatialLabelsByNodeId = spatialLabels(workspace, boardKey, nodeIds)

  return nodeIds.flatMap((nodeId) => {
    const node = workspace.nodes[nodeId]
    const nodeIsMissing = node === undefined
    if (nodeIsMissing) return []
    const descriptorParts = [
      getNodeCatalogId(node, workspace) ?? "",
      node.label ?? "",
      nodeStringsSummary(workspace, nodeId),
    ].filter((part) => part !== "")
    const spatialLabel = spatialLabelsByNodeId.get(nodeId)
    const nodeHasSpatialLabel = spatialLabel !== undefined
    if (nodeHasSpatialLabel) descriptorParts.push(`position: ${spatialLabel}`)
    return [{ id: nodeId, text: descriptorParts.join(", ") }]
  })
}

/** One enum-constrained pick over a small labeled candidate list. */
async function escalate(
  context: TurnContext,
  query: string,
  pool: Candidate[],
): Promise<FindNodeResult> {
  const { prompt, schema } = buildFindNodeEscalateStage({ query, pool })

  const { value: pickAnswer, metrics } = await callOllamaFormat<{ id: string }>(
    {
      model: context.model,
      host: context.host,
      prompt,
      schema,
    },
  )
  context.calls.push(metrics)
  const modelFoundAMatch = pickAnswer.id !== "none"
  recordStep(context, "find_node_escalate", {
    ok: modelFoundAMatch,
    prompt,
    output: JSON.stringify(pickAnswer, null, 2),
  })

  if (!modelFoundAMatch) {
    return {
      kind: "message",
      text: findNodeMissMessage(query, pool),
      reason: "not-found",
    }
  }
  return { kind: "resolved", nodeId: pickAnswer.id }
}

/**
 * Resolves a query phrase to one node id on the active board. The default
 * path is embedding-only (no model call); an ambiguous top-two escalates to
 * one narrow pick; unavailable embeddings fall back to that same pick over a
 * bounded candidate list.
 */
export async function findNodeSemantic(
  context: TurnContext,
  query: string,
): Promise<FindNodeResult> {
  const candidates = collectCandidates(
    context.state.workspace,
    context.resolved.resolvedKey,
  )
  const noBoardHasSearchableNodes = candidates.length === 0
  if (noBoardHasSearchableNodes) {
    return {
      kind: "message",
      text: "No component board is active, so there is nothing to search. Open a board first.",
      reason: "no-target",
    }
  }

  const rankedCandidates = await rankBySimilarity(query, candidates)

  const embeddingsAreUnavailable = rankedCandidates === null
  if (embeddingsAreUnavailable) {
    // Embeddings unavailable: bounded LLM pick, or a terminal ask when the
    // board is too big to offer honestly.
    const boardIsTooBigToOfferHonestly = candidates.length > FALLBACK_POOL
    if (boardIsTooBigToOfferHonestly) {
      return {
        kind: "message",
        text: `I can't search ${candidates.length} elements without the local search index. Select the element on the canvas, or name it more specifically.`,
        reason: "no-index",
      }
    }
    return escalate(context, query, candidates)
  }
  recordStep(context, "find_node_rank", {
    ok: true,
    output: [
      `Embedding similarity ranking for "${query}" (no model call). Top candidates:`,
      ...rankedCandidates
        .slice(0, RANKING_PREVIEW_COUNT)
        .map(
          (rankedEntry) =>
            `- ${rankedEntry.id}: ${rankedEntry.score.toFixed(3)}`,
        ),
    ].join("\n"),
  })

  const candidateById = new Map(
    candidates.map((candidate) => [candidate.id, candidate]),
  )
  const bestMatch = rankedCandidates[0]!
  const runnerUp = rankedCandidates[1]

  const rankingIsDecisive =
    runnerUp === undefined ||
    bestMatch.score - runnerUp.score >= ESCALATION_MARGIN
  if (rankingIsDecisive) {
    return { kind: "resolved", nodeId: bestMatch.id }
  }

  const escalationPool = rankedCandidates
    .slice(0, ESCALATION_POOL)
    .map((rankedEntry) => candidateById.get(rankedEntry.id)!)
  return escalate(context, query, escalationPool)
}
