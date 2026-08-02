import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
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
import { assembleLayeredWrites } from "./layered-paint"
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
  refuseSetTarget,
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

  // A class reference fans out; a single reference is a one-element fan.
  // Property names and values resolve ONCE (they come from the message, which
  // is the same for every member), then each member picks its own write node.
  const targetNodeIds =
    resolvedTarget.kind === "resolved-many"
      ? resolvedTarget.nodeIds
      : [resolvedTarget.nodeId]

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[targetNodeIds[0]!]!,
    context.state.workspace,
  )
  const nodeHasNoComponentSchema = !catalogId
  if (nodeHasNoComponentSchema) {
    return {
      kind: "message",
      text: `Node ${targetNodeIds[0]} has no component schema, so its properties can't be resolved.`,
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

  // Dedupe by write node: members of a class often share one component
  // source, and a cascade would reach every one of them through a single
  // write. Ten instances of one source must become one write, not ten.
  const writeNodes = new Map<string, { cascaded: boolean }>()
  for (const targetNodeId of targetNodeIds) {
    const writeTarget = resolveWriteNode(context, targetNodeId)
    if (isClarification(writeTarget)) return forwardClarification(writeTarget)
    const alreadyPlanned = writeNodes.get(writeTarget.nodeId)
    writeNodes.set(writeTarget.nodeId, {
      cascaded: (alreadyPlanned?.cascaded ?? false) || writeTarget.cascaded,
    })
  }

  let appliedCount = 0
  for (const [writeNodeId] of writeNodes) {
    // Fold layered-paint facet writes into whole layer stacks against the
    // node the write actually lands on, so the merge neither drops sibling
    // layers nor leaves a facet on a layer kind that cannot render it.
    const assembledProperties = assembleLayeredWrites(
      context.state.workspace,
      writeNodeId,
      propertyValues,
    )
    try {
      commit(context.state, {
        type: "set_node_properties",
        payload: { nodeId: writeNodeId, properties: assembledProperties },
      } as WorkspaceAction)
      appliedCount += 1
    } catch (caught) {
      // A partial batch is reported truthfully: what landed, what didn't.
      return {
        kind: "message",
        text:
          appliedCount === 0
            ? `Couldn't apply that change: ${commitFailureReason(caught)}`
            : `Applied the change to ${appliedCount} of ${writeNodes.size} elements, then failed on ${writeNodeId}: ${commitFailureReason(caught)}`,
      }
    }
  }
  recordStep(context, "commit", { ok: true })

  // Tagged values render through core's own display form ("100px", "@swatch
  // .primary"), never raw JSON in a user-facing sentence.
  const describeValue = (rawValue: unknown): string => {
    const valueIsTagged =
      typeof rawValue === "object" && rawValue !== null && "type" in rawValue
    if (valueIsTagged) {
      const displayForm = stringifyValue(rawValue as never)
      if (displayForm !== undefined) return displayForm
    }
    return JSON.stringify(rawValue)
  }
  const describedChanges = propertyNames.keys
    .map(
      (propertyKey) =>
        `${propertyKey} to ${describeValue(propertyValues[propertyKey])}`,
    )
    .join(", ")
  const [onlyWriteNodeId] = writeNodes.keys()
  const someWriteCascaded = [...writeNodes.values()].some(
    (writeNode) => writeNode.cascaded,
  )
  const reachNote = someWriteCascaded
    ? " on the component source, so every instance follows"
    : ""
  return {
    kind: "applied",
    reply:
      writeNodes.size === 1
        ? `Set ${describedChanges} on ${onlyWriteNodeId}${reachNote}.`
        : `Set ${describedChanges} on ${writeNodes.size} elements${reachNote}.`,
  }
}

/** Handles the `reset_node_property` intent: target -> name -> commit. */
export async function executeResetProperty(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  // Same fan as set: "reset the color on all the chips" resets each member.
  // No write-node dedupe here -- reset clears the node's own override.
  const targetNodeIds =
    resolvedTarget.kind === "resolved-many"
      ? resolvedTarget.nodeIds
      : [resolvedTarget.nodeId]

  const catalogId = getNodeCatalogId(
    context.state.workspace.nodes[targetNodeIds[0]!]!,
    context.state.workspace,
  )
  const nodeHasNoComponentSchema = !catalogId
  if (nodeHasNoComponentSchema) {
    return {
      kind: "message",
      text: `Node ${targetNodeIds[0]} has no component schema, so its properties can't be resolved.`,
    }
  }

  const propertyNames = await resolvePropertyNames(context, catalogId)
  if (isClarification(propertyNames)) return forwardClarification(propertyNames)

  for (const targetNodeId of targetNodeIds)
  for (const dottedKey of propertyNames.keys) {
    // A compound facet path (`border.color`) resets via propertyKey +
    // subpropertyKey; a layered path (`background.0.color`) additionally
    // carries its slot as layerIndex, which the reset payload supports
    // natively. A bare key resets the whole property.
    const segments = dottedKey.split(".")
    const [propertyKey] = segments
    const keyNamesALayerSlot =
      segments.length === 3 && /^\d+$/.test(segments[1]!)
    const subpropertyKey = keyNamesALayerSlot ? segments[2] : segments[1]
    const layerIndex = keyNamesALayerSlot ? Number(segments[1]) : undefined
    const keyNamesAFacet = Boolean(subpropertyKey)
    try {
      commit(context.state, {
        type: "reset_node_property",
        payload: keyNamesAFacet
          ? keyNamesALayerSlot
            ? {
                nodeId: targetNodeId,
                propertyKey,
                subpropertyKey,
                layerIndex,
              }
            : { nodeId: targetNodeId, propertyKey, subpropertyKey }
          : { nodeId: targetNodeId, propertyKey },
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
    reply:
      targetNodeIds.length === 1
        ? `Reset ${propertyNames.keys.join(", ")} on ${targetNodeIds[0]}.`
        : `Reset ${propertyNames.keys.join(", ")} on ${targetNodeIds.length} elements.`,
  }
}

/** Handles the `set_node_label` intent: target -> extract label -> commit. */
export async function executeSetLabel(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)
  // One label across N elements is never what a rename means.
  if (resolvedTarget.kind === "resolved-many")
    return refuseSetTarget("rename", resolvedTarget.nodeIds.length)

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
