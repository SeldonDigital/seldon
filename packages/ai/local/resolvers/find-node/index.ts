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
  | { kind: "message"; text: string }

type Candidate = FindNodeCandidate

/** Top-two score gap below which the ranking counts as ambiguous. */
const ESCALATION_MARGIN = 0.04
/** How many ranked candidates the escalation call chooses among. */
const ESCALATION_POOL = 6
/** Most candidates the no-embeddings fallback will offer the model. */
const FALLBACK_POOL = 12

/** Every node on the board as an embeddable candidate string. */
function collectCandidates(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
): Candidate[] {
  if (boardKey === undefined) return []
  const board = workspace.boards[boardKey]
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board))) return []

  const ids: string[] = []
  walkBoardTreeRefs(board.variants, (ref) => {
    ids.push(ref.id)
  })
  const positions = spatialLabels(workspace, boardKey, ids)

  return ids.flatMap((id) => {
    const node = workspace.nodes[id]
    if (!node) return []
    const parts = [
      getNodeCatalogId(node, workspace) ?? "",
      node.label ?? "",
      nodeStringsSummary(workspace, id),
    ].filter((part) => part !== "")
    const position = positions.get(id)
    if (position) parts.push(`position: ${position}`)
    return [{ id, text: parts.join(", ") }]
  })
}

/** One enum-constrained pick over a small labeled candidate list. */
async function escalate(
  context: TurnContext,
  query: string,
  pool: Candidate[],
): Promise<FindNodeResult> {
  const { prompt, schema } = buildFindNodeEscalateStage({ query, pool })

  const { value, metrics } = await callOllamaFormat<{ id: string }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "find_node_escalate", value.id !== "none", {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

  if (value.id === "none") {
    return { kind: "message", text: findNodeMissMessage(query, pool) }
  }
  return { kind: "resolved", nodeId: value.id }
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
  if (candidates.length === 0) {
    return {
      kind: "message",
      text: "No component board is active, so there is nothing to search. Open a board first.",
    }
  }

  const ranked = await rankBySimilarity(query, candidates)

  if (ranked === null) {
    // Embeddings unavailable: bounded LLM pick, or a terminal ask when the
    // board is too big to offer honestly.
    if (candidates.length > FALLBACK_POOL) {
      return {
        kind: "message",
        text: `I can't search ${candidates.length} elements without the local search index. Select the element on the canvas, or name it more specifically.`,
      }
    }
    return escalate(context, query, candidates)
  }
  recordStep(context, "find_node_rank", true, {
    output: [
      `Embedding similarity ranking for "${query}" (no model call). Top candidates:`,
      ...ranked
        .slice(0, 5)
        .map((entry) => `- ${entry.id}: ${entry.score.toFixed(3)}`),
    ].join("\n"),
  })

  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]))
  const top = ranked[0]!
  const runnerUp = ranked[1]

  if (!runnerUp || top.score - runnerUp.score >= ESCALATION_MARGIN) {
    return { kind: "resolved", nodeId: top.id }
  }

  const pool = ranked
    .slice(0, ESCALATION_POOL)
    .map((entry) => byId.get(entry.id)!)
  return escalate(context, query, pool)
}
