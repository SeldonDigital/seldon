import type { Board } from "@seldon/core/workspace/types"

import {
  markedBoardTree,
  markedSelectionSubtree,
} from "../../prompt/context-sections/marked-board"
import {
  type PickVerdict,
  type Quantifier,
  type ScopedPickVerdict,
  buildPickInSelectionStage,
  buildPickTargetStage,
  buildQuantifierStage,
} from "../../prompt/stages/pick-target"
import { describeNodeInWords } from "../node-words"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"
import { HOW_TO_ANSWER, type TargetResolution } from "./resolve-target"

/**
 * The reference pick: two constrained calls over the active board, replacing
 * the extract-phrase-then-search ladder.
 *
 * The ladder asked the model for a free-text element name and then spent code
 * defending against the answer -- an invented "container", a generic
 * "element", a grammatical-number reading of plurality, a count parsed out of
 * the sentence. Here the model never types a name: it reads the board with
 * the selection marked and answers with ids it was shown. What the code does
 * is enumerate what exists and execute the pick, which is not language work.
 *
 * Off by default. The deterministic ladder stays the shipped path until the
 * eval says this one is better.
 */
export function pickTargetIsEnabled(): boolean {
  return process.env.SELDON_AI_PICK_TARGET === "1"
}

/** How many candidates an ambiguity ask names before it stops listing. */
const ASK_LIST_LIMIT = 5

async function askQuantifier(context: TurnContext): Promise<Quantifier> {
  const { prompt, schema } = buildQuantifierStage({ message: context.message })
  const { value: quantifierAnswer, metrics } = await callOllamaFormat<{
    quantifier: Quantifier
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "quantifier", {
    ok: true,
    prompt,
    output: JSON.stringify(quantifierAnswer, null, 2),
  })
  return quantifierAnswer.quantifier
}

/** The ask for a tie the pick could not separate, in the user's own terms. */
function ambiguityAsk(
  context: TurnContext,
  candidateIds: readonly string[],
): TargetResolution {
  const namedCandidates = candidateIds
    .slice(0, ASK_LIST_LIMIT)
    .map((nodeId) => `- ${describeNodeInWords(context.state.workspace, nodeId)}`)
    .join("\n")
  const droppedCount = candidateIds.length - ASK_LIST_LIMIT
  const listWasTruncated = droppedCount > 0
  const truncationNote = listWasTruncated
    ? `\n(and ${droppedCount} more)`
    : ""
  return {
    kind: "message",
    text: `That could be several elements:\n${namedCandidates}${truncationNote}\n${HOW_TO_ANSWER}`,
    reason: "several",
    candidateIds: [...candidateIds],
  }
}

/** The terminal message for a pick that found nothing on the board. */
function nothingMatchedAsk(context: TurnContext): TargetResolution {
  return {
    kind: "message",
    text: `I couldn't find an element on this board that "${context.message}" refers to. Name it, or select it on the canvas and ask again.`,
    reason: "no-target",
  }
}

/**
 * The narrow pass over the selection subtree. Returns undefined when there is
 * nothing selected to look at, or when the pass declined ("wider") -- both mean
 * the same thing to the caller: go and read the whole board.
 */
async function pickWithinSelection(
  context: TurnContext,
  activeBoard: Board,
  quantifier: Quantifier,
): Promise<TargetResolution | undefined> {
  const selection = markedSelectionSubtree({
    workspace: context.state.workspace,
    activeBoard,
    selectedNodeId: context.resolved.selectedNodeId,
  })
  const thereIsNoSelectionToLookAt = selection.nodeIds.length === 0
  if (thereIsNoSelectionToLookAt) return undefined

  const { prompt, schema } = buildPickInSelectionStage({
    message: context.message,
    selectionLines: selection.lines,
    nodeIds: selection.nodeIds,
    quantifier,
  })
  const { value: scopedAnswer, metrics } = await callOllamaFormat<{
    verdict: ScopedPickVerdict
    nodeIds: string[]
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  const pickedIds = scopedAnswer.nodeIds.filter((nodeId) =>
    selection.nodeIds.includes(nodeId),
  )
  // A pass that claims a find but names nothing has told us nothing, so it
  // widens rather than reporting a miss the board might well answer.
  const passWantsTheWholeBoard =
    scopedAnswer.verdict === "wider" || pickedIds.length === 0
  recordStep(context, "pick_in_selection", {
    ok: !passWantsTheWholeBoard,
    prompt,
    output: JSON.stringify({ ...scopedAnswer, quantifier, pickedIds }, null, 2),
  })
  if (passWantsTheWholeBoard) return undefined

  const passTiedBetweenCandidates =
    scopedAnswer.verdict === "ambiguous" && pickedIds.length > 1
  if (passTiedBetweenCandidates) return ambiguityAsk(context, pickedIds)

  const passNamedOneElement = pickedIds.length === 1
  if (passNamedOneElement) return { kind: "resolved", nodeId: pickedIds[0]! }
  return { kind: "resolved-many", nodeIds: pickedIds }
}

/**
 * Resolves the message's target by picking ids off the marked board. Returns
 * undefined when there is no board to pick from, so the caller falls back to
 * the deterministic path rather than guessing.
 */
export async function pickTarget(
  context: TurnContext,
): Promise<TargetResolution | undefined> {
  const boardKey = context.resolved.resolvedKey
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) return undefined
  const activeBoard = context.state.workspace.boards[boardKey]
  if (!activeBoard) return undefined

  const board = markedBoardTree({
    workspace: context.state.workspace,
    activeBoard,
    selectedNodeId: context.resolved.selectedNodeId,
  })
  const boardHasNothingToPick = board.nodeIds.length === 0
  if (boardHasNothingToPick) return undefined

  const quantifier = await askQuantifier(context)

  // Narrow pass first: most edits are about the selected element, and a dozen
  // lines read better at 8b than a whole board. It can decline, which is the
  // only reason looking at a short list first is safe.
  const narrowResolution = await pickWithinSelection(
    context,
    activeBoard,
    quantifier,
  )
  const narrowPassAnsweredTheReference = narrowResolution !== undefined
  if (narrowPassAnsweredTheReference) return narrowResolution

  const { prompt, schema } = buildPickTargetStage({
    message: context.message,
    boardLines: board.lines,
    nodeIds: board.nodeIds,
    quantifier,
  })
  const { value: pickAnswer, metrics } = await callOllamaFormat<{
    verdict: PickVerdict
    nodeIds: string[]
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  // The enum bounds each id to the board, but not the array's length or its
  // agreement with the verdict: "found" with nothing picked is an answer that
  // claims success and delivers none, so it is treated as the miss it is.
  const pickedIds = pickAnswer.nodeIds.filter((nodeId) =>
    board.nodeIds.includes(nodeId),
  )
  const pickFoundNothing =
    pickAnswer.verdict === "none" || pickedIds.length === 0
  recordStep(context, "pick_target", {
    ok: !pickFoundNothing,
    prompt,
    output: JSON.stringify(
      { ...pickAnswer, quantifier, pickedIds },
      null,
      2,
    ),
  })
  if (pickFoundNothing) return nothingMatchedAsk(context)

  const pickTiedBetweenCandidates =
    pickAnswer.verdict === "ambiguous" && pickedIds.length > 1
  if (pickTiedBetweenCandidates) return ambiguityAsk(context, pickedIds)

  const pickNamedOneElement = pickedIds.length === 1
  if (pickNamedOneElement) return { kind: "resolved", nodeId: pickedIds[0]! }
  return { kind: "resolved-many", nodeIds: pickedIds }
}
