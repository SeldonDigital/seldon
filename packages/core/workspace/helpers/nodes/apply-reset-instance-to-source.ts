import { produce } from "immer"

import { formatNodeLink, parseNodeLink } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNodeId, Workspace } from "../../types"
import { getVariantTree } from "../components/get-variant-tree"
import { findBoardContainingTreeNodeId } from "./duplicate-entry-variant-subtree"

interface SubtreeRepoint {
  id: EntryNodeId
  sourceId: EntryNodeId | null
}

/**
 * Pairs each instance node with the structurally-matching source node by child
 * index. A slot present on one side but not the other yields a `null` source,
 * so that node clears its overrides without repointing its template.
 */
function collectSubtreeRepoints(
  instanceRef: ComponentTreeRef,
  sourceRef: ComponentTreeRef | null,
  out: SubtreeRepoint[],
): void {
  out.push({
    id: instanceRef.id as EntryNodeId,
    sourceId: sourceRef ? (sourceRef.id as EntryNodeId) : null,
  })

  const instanceChildren = instanceRef.children ?? []
  const sourceChildren = sourceRef?.children ?? []
  for (let index = 0; index < instanceChildren.length; index++) {
    collectSubtreeRepoints(
      instanceChildren[index],
      sourceChildren[index] ?? null,
      out,
    )
  }
}

/**
 * Reverts an instance subtree to its source: the node one hop up its template
 * chain. Clears every subtree node's overrides and repoints each node's template
 * to the source's structurally-matching child, so a child resolves to the
 * source variant's child rather than to its own template baseline. Node ids and
 * tree structure survive, so downstream instances keep their links and overrides.
 *
 * Slots where the instance tree and source tree diverge clear overrides only and
 * keep their existing template, so structurally edited instances stay intact.
 */
export function applyResetInstanceToSource(
  workspace: Workspace,
  instanceId: EntryNodeId,
): Workspace {
  const instanceNode = workspace.nodes[instanceId]
  if (!instanceNode) return workspace

  const sourceLink = parseNodeLink(instanceNode.template)
  if (!sourceLink || !workspace.nodes[sourceLink.nodeId]) return workspace
  const sourceId = sourceLink.nodeId as EntryNodeId

  const instanceLocated = findBoardContainingTreeNodeId(workspace, instanceId)
  if (!instanceLocated) return workspace
  const instanceTree = getVariantTree(instanceLocated.board, instanceId)
  if (!instanceTree) return workspace

  const sourceLocated = findBoardContainingTreeNodeId(workspace, sourceId)
  const sourceTree = sourceLocated
    ? getVariantTree(sourceLocated.board, sourceId)
    : null

  const repoints: SubtreeRepoint[] = []
  collectSubtreeRepoints(instanceTree, sourceTree, repoints)

  return produce(workspace, (draft) => {
    for (const { id, sourceId: matchedSourceId } of repoints) {
      const node = draft.nodes[id]
      if (!node) continue
      node.overrides = {}
      if (matchedSourceId && matchedSourceId !== id) {
        node.template = formatNodeLink(matchedSourceId)
      }
    }
  })
}
