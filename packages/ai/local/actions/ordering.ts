import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

import { buildMoveStage, buildReorderStage } from "../../prompt/stages/ordering"
import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolveNodeTarget } from "../resolvers/resolve-target"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  forwardClarification,
  isClarification,
  recordStep,
} from "../turn-context"

/** Fewer siblings than this and there is no ordering to change. */
const MINIMUM_SIBLINGS_TO_REORDER = 2

/** The parent ref and sibling position of a node within a board's variant trees. */
function findSiblingPosition(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  nodeId: string,
): { parentId: string; index: number; count: number } | undefined {
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) return undefined
  const activeBoard = workspace.boards[boardKey]
  const boardHasNoVariantTrees =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard))
  if (boardHasNoVariantTrees) return undefined
  let siblingPosition:
    | { parentId: string; index: number; count: number }
    | undefined
  walkBoardTreeRefs(activeBoard.variants, (ref) => {
    const childRefs = ref.children ?? []
    const childIndex = childRefs.findIndex((child) => child.id === nodeId)
    const nodeIsNotAChildOfThisRef = childIndex === -1
    if (nodeIsNotAChildOfThisRef) return
    siblingPosition = {
      parentId: ref.id,
      index: childIndex,
      count: childRefs.length,
    }
    return true
  })
  return siblingPosition
}

/**
 * Handles the `reorder_instance` intent: target -> one narrow call for the
 * position word -> compute the index deterministically from real sibling
 * geometry -> commit. The model never emits an index; it picks a direction,
 * and code does the arithmetic against the actual child list.
 */
export async function executeReorder(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const siblingPosition = findSiblingPosition(
    context.state.workspace,
    context.resolved.resolvedKey,
    resolvedTarget.nodeId,
  )
  const nodeHasNoSiblingContext = siblingPosition === undefined
  if (nodeHasNoSiblingContext) {
    return {
      kind: "message",
      text: `${resolvedTarget.nodeId} has no reorderable siblings on the active board.`,
    }
  }
  const nodeIsAnOnlyChild = siblingPosition.count < MINIMUM_SIBLINGS_TO_REORDER
  if (nodeIsAnOnlyChild) {
    return {
      kind: "message",
      text: `${resolvedTarget.nodeId} is its parent's only child, so there is nothing to reorder.`,
    }
  }

  const { prompt, schema } = buildReorderStage({
    message: context.message,
    index: siblingPosition.index + 1,
    count: siblingPosition.count,
  })
  const { value: positionAnswer, metrics } = await callOllamaFormat<{
    position: "first" | "last" | "up" | "down"
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_position", {
    ok: true,
    prompt,
    output: JSON.stringify(positionAnswer, null, 2),
  })

  const lastSiblingIndex = siblingPosition.count - 1
  const newIndex =
    positionAnswer.position === "first"
      ? 0
      : positionAnswer.position === "last"
        ? lastSiblingIndex
        : positionAnswer.position === "up"
          ? Math.max(0, siblingPosition.index - 1)
          : Math.min(lastSiblingIndex, siblingPosition.index + 1)

  const nodeIsAlreadyInThatPosition = newIndex === siblingPosition.index
  if (nodeIsAlreadyInThatPosition) {
    const askedToMoveTowardTheStart =
      positionAnswer.position === "first" || positionAnswer.position === "up"
    return {
      kind: "message",
      text: `${resolvedTarget.nodeId} is already ${askedToMoveTowardTheStart ? "first" : "last"} among its siblings.`,
    }
  }

  try {
    commit(context.state, {
      type: "reorder_instance_in_parent",
      payload: { instanceId: resolvedTarget.nodeId, newIndex },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't reorder: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Moved ${resolvedTarget.nodeId} to position ${newIndex + 1} of ${siblingPosition.count}.`,
  }
}

/**
 * Handles the `move_instance` intent: extract the item and destination
 * phrases in one shallow call, resolve each through target resolution, then
 * commit. The reducer rejects cross-variant moves, moves into a default
 * variant, and level violations, and that rejection terminates the turn with
 * its exact reason.
 */
export async function executeMove(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const { prompt, schema } = buildMoveStage({ message: context.message })
  const { value: moveAnswer, metrics } = await callOllamaFormat<{
    item: string
    destination: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "extract_move", {
    ok: true,
    prompt,
    output: JSON.stringify(moveAnswer, null, 2),
  })

  const itemPhraseIsBlank = moveAnswer.item.trim() === ""
  const itemResolution = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    context.resolved.selectedNodeId,
    context.resolved.selectedBoardId,
    "selection",
    itemPhraseIsBlank ? undefined : moveAnswer.item,
    context.resolved.scope,
  )
  const itemNeedsClarification = isClarification(itemResolution)
  recordStep(context, "resolve_target", {
    ok: !itemNeedsClarification,
    output: itemNeedsClarification
      ? itemResolution.text
      : `Resolved the item to move to node ${itemResolution.nodeId} (deterministic, no model call).`,
  })
  if (itemNeedsClarification) return forwardClarification(itemResolution)

  const destinationResolution = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    undefined,
    undefined,
    { nodeId: moveAnswer.destination },
    moveAnswer.destination,
    context.resolved.scope,
  )
  const destinationNeedsClarification = isClarification(destinationResolution)
  recordStep(context, "resolve_destination", {
    ok: !destinationNeedsClarification,
    output: destinationNeedsClarification
      ? destinationResolution.text
      : `Resolved the destination to node ${destinationResolution.nodeId} (deterministic, no model call).`,
  })
  if (destinationNeedsClarification)
    return forwardClarification(destinationResolution)

  try {
    commit(context.state, {
      type: "move_instance",
      payload: {
        instanceId: itemResolution.nodeId,
        target: { parentId: destinationResolution.nodeId },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't move: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Moved ${itemResolution.nodeId} into ${destinationResolution.nodeId}.`,
  }
}
