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

import { buildSetLabelStage } from "../../prompt/stages/properties"
import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolvePropertyNames } from "../resolvers/resolve-property-name"
import { resolvePropertyValue } from "../resolvers/resolve-property-value"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  forwardClarification,
  isClarification,
  recordStep,
} from "../turn-context"

/** The component board key whose variant trees list this node id, if any. */
function boardKeyOfNode(
  workspace: Workspace,
  nodeId: string,
): BoardKey | undefined {
  for (const [boardKey, board] of Object.entries(workspace.boards)) {
    const boardHasNoVariantTrees =
      !isComponentBoard(board) && !isAuthoredBoard(board)
    if (boardHasNoVariantTrees) continue
    let boardListsNode = false
    walkBoardTreeRefs(board.variants, (ref) => {
      const refIsTheNode = ref.id === nodeId
      if (!refIsTheNode) return
      boardListsNode = true
      return true
    })
    if (boardListsNode) return boardKey as BoardKey
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
  const componentSourceId = getSourceNodeId(workspace, targetNodeId)
  const sourceBoardKey = boardKeyOfNode(workspace, componentSourceId)
  const sourceIsOnActiveBoard =
    resolved.resolvedKey !== undefined &&
    sourceBoardKey === resolved.resolvedKey
  const targetInheritsFromTheSource = componentSourceId !== targetNodeId
  const userChoseToActAcrossTheFile = resolved.scope === "workspace"
  const selectionIsInstanceScoped = resolved.scope === "instance"

  const cascadeToComponentSource =
    !selectionIsInstanceScoped && sourceIsOnActiveBoard

  // NOTE: unreachable as written -- `cascadeToComponentSource` can only be
  // true when `sourceIsOnActiveBoard` is, so `!sourceIsOnActiveBoard` never
  // holds here. The protection still exists in practice: a source on another
  // board makes `cascadeToComponentSource` false, so the write lands on the
  // local override rather than the shared source.
  const wouldSilentlyRestyleEveryInstance =
    cascadeToComponentSource &&
    !userChoseToActAcrossTheFile &&
    !sourceIsOnActiveBoard &&
    targetInheritsFromTheSource
  if (wouldSilentlyRestyleEveryInstance) {
    return {
      kind: "message",
      text: `Changing ${targetNodeId} here would write its shared source ${componentSourceId}${
        sourceBoardKey ? ` on board ${sourceBoardKey}` : ""
      }, which every instance across the workspace resolves from. Select the node directly to change only it, or say so explicitly to change every instance.`,
    }
  }

  return {
    kind: "write",
    nodeId: cascadeToComponentSource ? componentSourceId : targetNodeId,
    cascaded: cascadeToComponentSource && targetInheritsFromTheSource,
  }
}

/** Handles the `set_node_properties` intent: target -> names -> values -> commit. */
export async function executeSetProperties(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[resolvedTarget.nodeId]!,
    context.state.workspace,
  )
  const nodeHasNoComponentSchema = !catalogId
  if (nodeHasNoComponentSchema) {
    return {
      kind: "message",
      text: `Node ${resolvedTarget.nodeId} has no component schema, so its properties can't be resolved.`,
    }
  }

  const propertyNames = await resolvePropertyNames(context, catalogId)
  if (isClarification(propertyNames)) return forwardClarification(propertyNames)

  const propertyValues: Record<string, unknown> = {}
  for (const propertyKey of propertyNames.keys) {
    const valueResolution = await resolvePropertyValue(context, propertyKey)
    if (isClarification(valueResolution))
      return forwardClarification(valueResolution)
    propertyValues[propertyKey] = valueResolution.value
  }

  const writeTarget = resolveWriteNode(context, resolvedTarget.nodeId)
  if (isClarification(writeTarget)) return forwardClarification(writeTarget)

  try {
    commit(context.state, {
      type: "set_node_properties",
      payload: { nodeId: writeTarget.nodeId, properties: propertyValues },
    } as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't apply that change: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })

  const describedChanges = propertyNames.keys
    .map(
      (propertyKey) =>
        `${propertyKey} to ${JSON.stringify(propertyValues[propertyKey])}`,
    )
    .join(", ")
  const reachNote = writeTarget.cascaded
    ? " on the component source, so every instance follows"
    : ""
  return {
    kind: "applied",
    reply: `Set ${describedChanges} on ${writeTarget.nodeId}${reachNote}.`,
  }
}

/** Handles the `reset_node_property` intent: target -> name -> commit. */
export async function executeResetProperty(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[resolvedTarget.nodeId]!,
    context.state.workspace,
  )
  const nodeHasNoComponentSchema = !catalogId
  if (nodeHasNoComponentSchema) {
    return {
      kind: "message",
      text: `Node ${resolvedTarget.nodeId} has no component schema, so its properties can't be resolved.`,
    }
  }

  const propertyNames = await resolvePropertyNames(context, catalogId)
  if (isClarification(propertyNames)) return forwardClarification(propertyNames)

  for (const dottedKey of propertyNames.keys) {
    // A dotted facet path resets via propertyKey + subpropertyKey.
    const [propertyKey, subpropertyKey] = dottedKey.split(".")
    const keyNamesAFacet = Boolean(subpropertyKey)
    try {
      commit(context.state, {
        type: "reset_node_property",
        payload: keyNamesAFacet
          ? { nodeId: resolvedTarget.nodeId, propertyKey, subpropertyKey }
          : { nodeId: resolvedTarget.nodeId, propertyKey },
      } as unknown as WorkspaceAction)
    } catch (caught) {
      return {
        kind: "message",
        text: `Couldn't reset ${dottedKey}: ${commitFailureReason(caught)}`,
      }
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Reset ${propertyNames.keys.join(", ")} on ${resolvedTarget.nodeId}.`,
  }
}

/** Handles the `set_node_label` intent: target -> extract label -> commit. */
export async function executeSetLabel(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const { prompt, schema } = buildSetLabelStage({ message: context.message })
  const { value: labelAnswer, metrics } = await callOllamaFormat<{
    label: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "extract_label", {
    ok: true,
    prompt,
    output: JSON.stringify(labelAnswer, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_node_label",
      payload: { nodeId: resolvedTarget.nodeId, label: labelAnswer.label },
    } as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't rename: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Renamed ${resolvedTarget.nodeId} to "${labelAnswer.label}".`,
  }
}
