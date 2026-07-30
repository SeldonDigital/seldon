import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
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
import { resolvePropertyNames } from "../resolvers/resolve-property-name"
import { resolvePropertyValue } from "../resolvers/resolve-property-value"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/** The component board key whose variant trees list this node id, if any. */
function boardKeyOfNode(
  workspace: Workspace,
  nodeId: string,
): BoardKey | undefined {
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue
    let found = false
    walkBoardTreeRefs(board.variants, (ref) => {
      if (ref.id !== nodeId) return
      found = true
      return true
    })
    if (found) return key as BoardKey
  }
  return undefined
}

/**
 * Picks the node the write should land on, preserving the cascade rule the
 * old harness proved out: a local override by default; the shared component
 * source only when the selection is broad and that source sits on the active
 * board. An "all"-reach write to a source on another board would silently
 * restyle every instance across the workspace, so it terminates with a
 * confirmation ask instead (workspace scope is exempt -- the user chose to
 * act across the file).
 */
function resolveWriteNode(
  context: TurnContext,
  targetNodeId: string,
):
  | { kind: "write"; nodeId: string; cascaded: boolean }
  | { kind: "message"; text: string } {
  const { workspace } = context.state
  const { resolved } = context
  const sourceId = getSourceNodeId(workspace, targetNodeId)
  const sourceBoardKey = boardKeyOfNode(workspace, sourceId)
  const sourceOnActiveBoard =
    resolved.resolvedKey !== undefined &&
    sourceBoardKey === resolved.resolvedKey

  const cascade = resolved.scope !== "instance" && sourceOnActiveBoard

  if (
    cascade &&
    resolved.scope !== "workspace" &&
    !sourceOnActiveBoard &&
    sourceId !== targetNodeId
  ) {
    return {
      kind: "message",
      text: `Changing ${targetNodeId} here would write its shared source ${sourceId}${
        sourceBoardKey ? ` on board ${sourceBoardKey}` : ""
      }, which every instance across the workspace resolves from. Select the node directly to change only it, or say so explicitly to change every instance.`,
    }
  }

  return {
    kind: "write",
    nodeId: cascade ? sourceId : targetNodeId,
    cascaded: cascade && sourceId !== targetNodeId,
  }
}

/** Handles the `set_node_properties` intent: target -> names -> values -> commit. */
export async function executeSetProperties(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[target.nodeId]!,
    context.state.workspace,
  )
  if (!catalogId) {
    return {
      kind: "message",
      text: `Node ${target.nodeId} has no component schema, so its properties can't be resolved.`,
    }
  }

  const names = await resolvePropertyNames(context, catalogId)
  if (names.kind === "message") return { kind: "message", text: names.text }

  const properties: Record<string, unknown> = {}
  for (const key of names.keys) {
    const value = await resolvePropertyValue(context, key)
    if (value.kind === "message") return { kind: "message", text: value.text }
    properties[key] = value.value
  }

  const write = resolveWriteNode(context, target.nodeId)
  if (write.kind === "message") return { kind: "message", text: write.text }

  try {
    commit(context.state, {
      type: "set_node_properties",
      payload: { nodeId: write.nodeId, properties },
    } as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't apply that change: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)

  const described = names.keys
    .map((key) => `${key} to ${JSON.stringify(properties[key])}`)
    .join(", ")
  const reach = write.cascaded
    ? " on the component source, so every instance follows"
    : ""
  return {
    kind: "applied",
    reply: `Set ${described} on ${write.nodeId}${reach}.`,
  }
}

/** Handles the `reset_node_property` intent: target -> name -> commit. */
export async function executeResetProperty(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[target.nodeId]!,
    context.state.workspace,
  )
  if (!catalogId) {
    return {
      kind: "message",
      text: `Node ${target.nodeId} has no component schema, so its properties can't be resolved.`,
    }
  }

  const names = await resolvePropertyNames(context, catalogId)
  if (names.kind === "message") return { kind: "message", text: names.text }

  for (const key of names.keys) {
    // A dotted facet path resets via propertyKey + subpropertyKey.
    const [propertyKey, subpropertyKey] = key.split(".")
    try {
      commit(context.state, {
        type: "reset_node_property",
        payload: subpropertyKey
          ? { nodeId: target.nodeId, propertyKey, subpropertyKey }
          : { nodeId: target.nodeId, propertyKey },
      } as unknown as WorkspaceAction)
    } catch (caught) {
      return {
        kind: "message",
        text: `Couldn't reset ${key}: ${commitFailureReason(caught)}`,
      }
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Reset ${names.keys.join(", ")} on ${target.nodeId}.`,
  }
}

/** Handles the `set_node_label` intent: target -> extract label -> commit. */
export async function executeSetLabel(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const { value, metrics } = await callOllamaFormat<{ label: string }>({
    model: context.model,
    host: context.host,
    prompt: [
      "Extract the new name the user wants from this message.",
      `Message: ${JSON.stringify(context.message)}`,
      'Answer with {"label": "<the new name, verbatim>"}.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: { label: { type: "string", minLength: 1 } },
      required: ["label"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "extract_label", true)

  try {
    commit(context.state, {
      type: "set_node_label",
      payload: { nodeId: target.nodeId, label: value.label },
    } as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't rename: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Renamed ${target.nodeId} to "${value.label}".`,
  }
}
