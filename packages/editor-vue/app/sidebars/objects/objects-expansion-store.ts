import { getCurrentWorkspace } from "@app/workspace/history-store"
import { collectDescendantNodeIds } from "@seldon/editor/lib/workspace/component-tree"
import { findComponentForNode } from "@seldon/editor/lib/workspace/node-tree"
import {
  getComponentKey,
  getNode,
} from "@seldon/editor/lib/workspace/workspace-accessors"
import { defineStore } from "pinia"
import { ref } from "vue"

import type { InstanceId, VariantId } from "@seldon/core"
import {
  nodeTraversalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"

/**
 * Node- and board-level expansion for the objects tree, keyed by board key or
 * node id. Every mutation replaces the `Set` so reads through `isExpanded` stay
 * reactive. Mirrors the React `use-expansion` store; sections use the separate
 * `section-expansion-store`.
 */
export const useObjectsExpansionStore = defineStore("objects-expansion", () => {
  const expandedObjects = ref<Set<string>>(new Set())

  function expandObjects(ids: string[]): void {
    const next = new Set(expandedObjects.value)
    ids.forEach((id) => next.add(id))
    expandedObjects.value = next
  }

  function collapseObjects(ids: string[]): void {
    const next = new Set(expandedObjects.value)
    ids.forEach((id) => next.delete(id))
    expandedObjects.value = next
  }

  function isExpanded(id: string): boolean {
    return expandedObjects.value.has(id)
  }

  /**
   * Toggles one object, or the object plus its ancestor chain when
   * `includeAncestors` is set (Alt+click). Ancestor collection walks parents to
   * the tree root, adding each variant's board key so the whole lineage opens.
   */
  function toggle(
    id: string,
    shouldExpand?: boolean,
    options?: { includeAncestors?: boolean },
  ): void {
    const expand = shouldExpand ?? !expandedObjects.value.has(id)

    if (!options?.includeAncestors) {
      if (expand) expandObjects([id])
      else collapseObjects([id])
      return
    }

    const workspace = getCurrentWorkspace()
    const node = getNode(workspace, id as InstanceId | VariantId)
    const idsToToggle: string[] = []
    let currentNode: EntryNode | undefined = node ?? undefined

    while (currentNode) {
      idsToToggle.push(currentNode.id)
      if (typeCheckingService.isVariant(currentNode)) {
        const board = findComponentForNode(currentNode, workspace)
        if (board) idsToToggle.push(getComponentKey(board))
      }
      const parentNode = nodeTraversalService.findParentNode(
        currentNode.id,
        workspace,
      )
      if (!parentNode) break
      currentNode = parentNode as EntryNode
    }

    if (expand) expandObjects(idsToToggle)
    else collapseObjects(idsToToggle)
  }

  /** All descendant node ids under a node, resolved against the committed workspace. */
  function getAllDescendantNodeIds(nodeId: string): string[] {
    const workspace = getCurrentWorkspace()
    const node = getNode(workspace, nodeId)
    if (!node) return []
    const board = findComponentForNode(node, workspace)
    if (!board) return []
    return collectDescendantNodeIds(board, nodeId)
  }

  return {
    expandedObjects,
    expandObjects,
    collapseObjects,
    isExpanded,
    toggle,
    getAllDescendantNodeIds,
  }
})
