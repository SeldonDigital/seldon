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

import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolveNodeTarget } from "../resolvers/resolve-target"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/** The parent ref and sibling position of a node within a board's variant trees. */
function findSiblingPosition(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  nodeId: string,
): { parentId: string; index: number; count: number } | undefined {
  if (boardKey === undefined) return undefined
  const board = workspace.boards[boardKey]
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board)))
    return undefined
  let found: { parentId: string; index: number; count: number } | undefined
  walkBoardTreeRefs(board.variants, (ref) => {
    const children = ref.children ?? []
    const index = children.findIndex((child) => child.id === nodeId)
    if (index === -1) return
    found = { parentId: ref.id, index, count: children.length }
    return true
  })
  return found
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
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const position = findSiblingPosition(
    context.state.workspace,
    context.resolved.resolvedKey,
    target.nodeId,
  )
  if (!position) {
    return {
      kind: "message",
      text: `${target.nodeId} has no reorderable siblings on the active board.`,
    }
  }
  if (position.count < 2) {
    return {
      kind: "message",
      text: `${target.nodeId} is its parent's only child, so there is nothing to reorder.`,
    }
  }

  const { value, metrics } = await callOllamaFormat<{
    position: "first" | "last" | "up" | "down"
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "Where does the user want to move this element among its siblings?",
      `It is currently at position ${position.index + 1} of ${position.count}.`,
      `Message: ${JSON.stringify(context.message)}`,
      '"first" = to the start, "last" = to the end, "up" = one position earlier, "down" = one position later.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        position: { type: "string", enum: ["first", "last", "up", "down"] },
      },
      required: ["position"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_position", true)

  const newIndex =
    value.position === "first"
      ? 0
      : value.position === "last"
        ? position.count - 1
        : value.position === "up"
          ? Math.max(0, position.index - 1)
          : Math.min(position.count - 1, position.index + 1)

  if (newIndex === position.index) {
    return {
      kind: "message",
      text: `${target.nodeId} is already ${value.position === "first" || value.position === "up" ? "first" : "last"} among its siblings.`,
    }
  }

  try {
    commit(context.state, {
      type: "reorder_instance_in_parent",
      payload: { instanceId: target.nodeId, newIndex },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't reorder: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Moved ${target.nodeId} to position ${newIndex + 1} of ${position.count}.`,
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
  const { value, metrics } = await callOllamaFormat<{
    item: string
    destination: string
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to move one element into another container.",
      `Message: ${JSON.stringify(context.message)}`,
      'Extract the shortest phrase naming what to move ("item" -- empty string when the message means the current selection) and the shortest phrase naming where it goes ("destination").',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        item: { type: "string" },
        destination: { type: "string", minLength: 1 },
      },
      required: ["item", "destination"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "extract_move", true)

  const item = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    context.resolved.selectedNodeId,
    context.resolved.selectedBoardId,
    "selection",
    value.item.trim() === "" ? undefined : value.item,
    context.resolved.scope,
  )
  recordStep(context, "resolve_target", item.kind === "resolved")
  if (item.kind === "message") return { kind: "message", text: item.text }

  const destination = resolveNodeTarget(
    context.state.workspace,
    context.resolved.resolvedKey,
    undefined,
    undefined,
    { nodeId: value.destination },
    value.destination,
    context.resolved.scope,
  )
  recordStep(context, "resolve_destination", destination.kind === "resolved")
  if (destination.kind === "message")
    return { kind: "message", text: destination.text }

  try {
    commit(context.state, {
      type: "move_instance",
      payload: {
        instanceId: item.nodeId,
        target: { parentId: destination.nodeId },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't move: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Moved ${item.nodeId} into ${destination.nodeId}.`,
  }
}
