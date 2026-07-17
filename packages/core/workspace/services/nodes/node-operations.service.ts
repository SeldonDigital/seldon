import { WritableDraft, current, isDraft, produce } from "immer"

import { ComponentId } from "../../../components/constants"
import { invariant } from "../../../index"
import { debugLog } from "../../../utils/debug-logger"
import { ErrorMessages } from "../../constants"
import { componentBoardUniqueNodeId } from "../../helpers/components/entry-node-ids"
import { getBoardByNodeId } from "../../helpers/components/get-board-by-node-id"
import { getBoardVariantRootIds } from "../../helpers/components/get-board-variant-root-ids"
import { getVariantTree } from "../../helpers/components/get-variant-tree"
import {
  getCompositionContainers,
  getContainerByKey,
} from "../../helpers/general/get-composition-containers"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { collectTreeRefIds } from "../../helpers/nodes/collect-tree-ref-ids"
import {
  buildDuplicateEntryVariantSubtreePlan,
  findBoardContainingTreeNodeId,
  insertComponentTreeInstanceAfterSibling,
} from "../../helpers/nodes/duplicate-entry-variant-subtree"
import { moveItemInArray } from "../../helpers/nodes/move-utils"
import {
  getNextSandboxTop,
  isSandboxNode,
  setSandboxTop,
} from "../../helpers/nodes/sandbox"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import type { ComponentTreeRef } from "../../model/component-tree"
import {
  isAuthoredBoard,
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../../model/components"
import type { BoardKey } from "../../model/components"
import type { EntryNode } from "../../model/entry-node"
import {
  formatNodeLink,
  parseNodeCatalog,
  parseNodeLink,
} from "../../model/template-ref"
import {
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { boardOrderService } from "../components/board-order.service"
import { workspaceMutationService } from "../mutation/workspace-mutation.service"
import {
  collectReferencedTreeIdsExcludingSubtree,
  findTreeRef,
  insertComponentTreeChild,
  removeComponentTreeChild,
} from "../shared/component-tree-helpers"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import {
  withInstanceAndParentMutation,
  withNodeMutation,
  withVariantAndBoardMutation,
} from "../shared/workspace-operation-helpers"
import { typeCheckingService } from "../type-checking/type-checking.service"
import { nodeRelationshipService } from "./node-relationship.service"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"

function nodeCatalogComponentId(node: unknown): ComponentId | undefined {
  if (node && typeof node === "object" && "template" in node) {
    const cat = parseNodeCatalog((node as { template: string }).template)
    if (cat?.kind === "catalog" && cat.componentId) {
      return cat.componentId as ComponentId
    }
  }
  return undefined
}

function cloneEntryNodeAsInstance(
  row: EntryNode,
  newId: string,
  templateNodeId: string,
  idMap: Map<string, string>,
): EntryNode {
  const clone = structuredClone(row) as EntryNode
  clone.id = newId
  clone.type = "instance"
  clone.template = formatNodeLink(templateNodeId)
  clone.origin = "user"
  // A ref must stay globally unique; never carry it onto a copy.
  delete clone.ref
  // Born linked: an instance inherits its source's properties and states through
  // the template link, so it starts with none of its own. Copying them would
  // freeze the source's values and shadow later edits to the source.
  clone.overrides = {}
  delete clone.states
  const link = parseNodeLink(row.template)
  if (link?.kind === "node" && idMap.has(link.nodeId)) {
    clone.template = formatNodeLink(idMap.get(link.nodeId)!)
  }
  return clone
}

function remapTreeRef(
  ref: ComponentTreeRef,
  sourceRootId: string,
  newRootId: string,
  idMap: Map<string, string>,
): ComponentTreeRef {
  const mapped =
    ref.id === sourceRootId ? newRootId : (idMap.get(ref.id) ?? ref.id)
  return {
    id: mapped,
    children: ref.children?.map((child) =>
      remapTreeRef(child, sourceRootId, newRootId, idMap),
    ),
  }
}

/**
 * Service for node CRUD operations and workspace mutations.
 */
export class NodeOperationsService {
  public insertNode(
    {
      nodeId,
      parentId,
      parentIndex,
    }: {
      nodeId: VariantId | InstanceId
      parentId: VariantId | InstanceId
      parentIndex?: number
    },
    workspace: Workspace,
  ): { workspace: Workspace; createdNodeId: InstanceId } {
    debugLog("Workspace", "insertNode", "Inserting node", {
      nodeId,
      parentId,
      parentIndex,
    })

    let newId: InstanceId
    // Read the source subtree from a plain snapshot. `_instantiateNode` only
    // reads to build the new nodes, and `structuredClone` throws on Immer draft
    // proxies, so cloning must operate on non-draft data.
    const sourceWorkspace = isDraft(workspace)
      ? (current(workspace) as Workspace)
      : workspace
    const updatedWorkspace = produce(workspace, (draft) => {
      const parentBoard = getBoardByNodeId(draft, parentId)
      invariant(parentBoard, `Board not found for parent ${parentId}`)

      const {
        newId: newNodeId,
        newTreeRef,
        newNodes,
      } = this._instantiateNode(nodeId, sourceWorkspace)

      Object.assign(draft.nodes, newNodes)

      const inserted = insertComponentTreeChild(
        parentBoard,
        parentId,
        newTreeRef,
        parentIndex,
      )
      invariant(
        inserted,
        `insertNode: could not insert ${newNodeId} under parent ${parentId}`,
      )

      newId = newNodeId
    })

    return {
      workspace: updatedWorkspace,
      createdNodeId: newId!,
    }
  }

  private deleteBoard(
    componentId: ComponentId,
    workspace: Workspace,
  ): Workspace {
    const workspaceAfterDeletion = mutateWorkspace(workspace, (draft) => {
      const board = draft.boards[componentId]
      if (!board) return

      for (const rootId of getBoardVariantRootIds(board)) {
        this._deleteVariantFromDraft(rootId as VariantId, draft)
      }

      delete draft.boards[componentId]
    })

    return boardOrderService.realignBoardOrder(workspaceAfterDeletion)
  }

  public deleteBoardByKey(boardKey: BoardKey, workspace: Workspace): Workspace {
    if (workspace.playgrounds?.[boardKey]) {
      return this.deletePlaygroundByKey(boardKey, workspace)
    }

    const board = workspace.boards[boardKey]
    if (!board) return workspace

    if (isComponentBoard(board) || isAuthoredBoard(board)) {
      return this.deleteBoard(boardKey as ComponentId, workspace)
    }

    if (isThemeBoard(board)) {
      return this._deleteResourceBoard(boardKey, workspace, "themes")
    }
    if (isFontCollectionBoard(board)) {
      return this._deleteResourceBoard(boardKey, workspace, "font-collections")
    }
    if (isMediaBoard(board)) {
      return this._deleteResourceBoard(boardKey, workspace, "media")
    }
    if (isIconSetBoard(board)) {
      return this._deleteResourceBoard(boardKey, workspace, "icon-sets")
    }

    return workspace
  }

  /** Deletes a resource board and its entries from the matching resource map. */
  private _deleteResourceBoard(
    boardKey: BoardKey,
    workspace: Workspace,
    resourceMap: "themes" | "font-collections" | "icon-sets" | "media",
  ): Workspace {
    const next = mutateWorkspace(workspace, (draft) => {
      const board = draft.boards[boardKey]
      if (!board) return
      const entries = draft[resourceMap] as Record<string, unknown>
      for (const ref of board.variants) {
        delete entries[ref.id]
      }
      delete draft.boards[boardKey]
    })
    return boardOrderService.realignBoardOrder(next)
  }

  /**
   * Deletes a playground container and every Sandbox root subtree it owns.
   * Playground containers live in `workspace.playgrounds`, not `workspace.boards`,
   * so this mirrors the playground-board deletion path against that map.
   */
  public deletePlaygroundByKey(
    playgroundKey: BoardKey,
    workspace: Workspace,
  ): Workspace {
    const playground = workspace.playgrounds?.[playgroundKey]
    if (!playground) return workspace

    return mutateWorkspace(workspace, (draft) => {
      const row = draft.playgrounds[playgroundKey]
      if (!row) return

      for (const rootId of getBoardVariantRootIds(row)) {
        this._deleteVariantFromDraft(rootId as VariantId, draft)
      }

      delete draft.playgrounds[playgroundKey]
    })
  }

  public deleteInstance(
    instanceId: InstanceId,
    workspace: Workspace,
  ): Workspace {
    return withInstanceAndParentMutation(
      instanceId,
      workspace,
      (_instance, _parent, draft) => {
        // `_deleteSubtreeFromDraft` collects the descendant ids and removes the
        // tree child itself, so the ref must stay in place until it runs.
        this._deleteSubtreeFromDraft(instanceId, draft)
      },
    )
  }

  public moveInstance(
    instanceId: InstanceId,
    newPosition: {
      parentId: VariantId | InstanceId
      index: number
    },
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(instanceId, workspace, (_node, draft) => {
      const currentParent = nodeTraversalService.findParentNode(
        instanceId,
        draft,
      )
      invariant(currentParent, `Parent not found for node ${instanceId}`)

      const oldBoard = getBoardByNodeId(draft, currentParent.id)
      invariant(oldBoard, `Board not found for parent ${currentParent.id}`)

      // Capture the full tree ref before removing it so the instance keeps its
      // child subtree. Inserting a bare { id } ref would orphan every child node.
      const treeRef = findTreeRef(oldBoard, instanceId)
      invariant(treeRef, `Tree ref not found for instance ${instanceId}`)

      // Reinserting a live subtree under its own descendant would make the tree
      // ref contain itself, which overflows Immer when it freezes the draft.
      // Validation rejects this earlier; bail out as a no-op if it slips through.
      if (collectTreeRefIds(treeRef).includes(newPosition.parentId)) {
        return
      }

      removeComponentTreeChild(oldBoard, instanceId)

      const newBoard = getBoardByNodeId(draft, newPosition.parentId)
      invariant(newBoard, `Board not found for parent ${newPosition.parentId}`)

      const inserted = insertComponentTreeChild(
        newBoard,
        newPosition.parentId,
        treeRef,
        newPosition.index,
      )
      invariant(
        inserted,
        `moveInstance: could not insert ${instanceId} under ${newPosition.parentId}`,
      )
    })
  }

  public deleteVariant(variantId: VariantId, workspace: Workspace): Workspace {
    return withNodeMutation(variantId, workspace, (_variant, draft) => {
      this._deleteVariantFromDraft(variantId, draft)
    })
  }

  /**
   * Removes a variant, every instance that links to it, and all board refs to it,
   * mutating the draft in place. Callers that already hold a draft (board deletion)
   * use this directly so node deletions propagate; merging a nested result with
   * `Object.assign` would silently keep deleted node ids.
   */
  private _deleteVariantFromDraft(
    variantId: VariantId,
    draft: WritableDraft<Workspace>,
  ): void {
    for (const [id, node] of Object.entries(draft.nodes)) {
      if (!typeCheckingService.isInstance(node)) continue
      const linkedVariant = parseNodeLink(node.template)?.nodeId
      if (linkedVariant === variantId) {
        this._deleteSubtreeFromDraft(id as InstanceId, draft)
      }
    }

    // Delete the variant subtree while its tree ref still exists, then drop the
    // dangling refs from every board. Removing the refs first would leave the
    // descendant nodes orphaned.
    this._deleteSubtreeFromDraft(variantId, draft)

    for (const board of getCompositionContainers(draft)) {
      if (!board) continue
      board.variants = board.variants.filter((ref) => ref.id !== variantId)
      walkRemoveVariantRefs(board.variants, variantId)
    }
  }

  private _deleteSubtreeFromDraft(
    nodeId: VariantId | InstanceId,
    draftWorkspace: WritableDraft<Workspace>,
  ): void {
    if (!isDraft(draftWorkspace)) {
      throw new Error("Workspace is not an immer draft")
    }

    const board = getBoardByNodeId(draftWorkspace, nodeId)
    const treeRef = board ? findTreeRef(board, nodeId) : null
    const idsToDelete = treeRef ? collectTreeRefIds(treeRef) : [nodeId]

    if (board && treeRef) {
      const isTopLevelRoot = board.variants.some((ref) => ref.id === nodeId)
      if (!isTopLevelRoot) {
        removeComponentTreeChild(board, nodeId)
      }
    }

    // Schema instantiation shares one node across sibling trees when their slot
    // fingerprints match, so a descendant may still be referenced by a tree
    // outside the subtree being deleted. Keep those rows to avoid dangling refs.
    const referencedElsewhere = collectReferencedTreeIdsExcludingSubtree(
      getCompositionContainers(draftWorkspace),
      nodeId,
    )

    for (const id of idsToDelete) {
      if (referencedElsewhere.has(id)) continue
      if (draftWorkspace.nodes[id]) {
        delete draftWorkspace.nodes[id]
      }
    }
  }

  public duplicateNode(
    nodeId: VariantId | InstanceId,
    workspace: Workspace,
  ): Workspace {
    debugLog("Workspace", "duplicateNode", "Duplicating node", { nodeId })

    return withNodeMutation(nodeId, workspace, (node, draft) => {
      invariant(
        isEntryNodeForRules(node),
        `duplicateNode: expected EntryNode ${nodeId}`,
      )

      if (typeCheckingService.isVariant(node)) {
        const located = findBoardContainingTreeNodeId(draft, node.id)
        invariant(located, ErrorMessages.componentNotFoundForVariant(node.id))
        invariant(
          isComponentBoard(located.board) ||
            isAuthoredBoard(located.board) ||
            isPlaygroundBoard(located.board),
          `duplicateNode: unsupported board type for ${node.id}`,
        )

        const defaultVariantRow =
          getWorkspaceNodes(draft)[located.board.variants[0]?.id as string]
        const componentId =
          nodeCatalogComponentId(node) ??
          nodeCatalogComponentId(defaultVariantRow)
        invariant(
          componentId,
          `duplicateNode: missing catalog template for variant ${node.id}`,
        )

        // Use the board key, not the catalog template id, so uniqueness is
        // scoped to this board's own variants. For catalog component boards the
        // key equals the catalog id, so this is identical to before; for
        // authored boards it fixes label collisions like duplicate "Frame 01".
        const label = workspaceMutationService.getInitialVariantLabel(
          located.boardKey as ComponentId,
          draft,
        )
        const plan = buildDuplicateEntryVariantSubtreePlan(
          draft,
          located.board,
          located.boardKey,
          node.id,
          label,
        )
        invariant(
          plan,
          `duplicateNode: could not plan variant duplicate ${node.id}`,
        )

        const board = getContainerByKey(draft, located.boardKey as BoardKey)!
        Object.assign(draft.nodes, plan.newNodes)

        // A duplicated Sandbox keeps the source overrides, including position, so
        // offset the copy below every existing sandbox to avoid overlap.
        if (isSandboxNode(node)) {
          const newRoot = draft.nodes[plan.newRootTreeRef.id]
          if (newRoot) {
            setSandboxTop(
              newRoot as EntryNode,
              getNextSandboxTop(board.variants, draft.nodes),
            )
          }
        }

        if (plan.sourceWasDefault) {
          board.variants = [...board.variants, plan.newRootTreeRef]
        } else {
          const idx = board.variants.findIndex((v) => v.id === node.id)
          if (idx !== -1) {
            board.variants.splice(idx + 1, 0, plan.newRootTreeRef)
          } else {
            board.variants.push(plan.newRootTreeRef)
          }
        }
        return
      }

      const located = findBoardContainingTreeNodeId(draft, node.id)
      invariant(located, ErrorMessages.parentNotFound(nodeId))

      const liveNodes = getWorkspaceNodes(draft)
      const nodes = isDraft(liveNodes) ? current(liveNodes) : liveNodes
      const sourceRow = nodes[node.id]
      invariant(sourceRow, ErrorMessages.nodeNotFound(node.id))

      const board = getContainerByKey(draft, located.boardKey as BoardKey)!
      const tree = getVariantTree(board, node.id)

      const newRootId = componentBoardUniqueNodeId(located.boardKey)
      const idMap = new Map<string, string>()
      idMap.set(node.id, newRootId)

      let newTreeRef: ComponentTreeRef = { id: newRootId }
      if (tree) {
        for (const id of collectTreeRefIds(tree)) {
          if (id === node.id) continue
          idMap.set(id, componentBoardUniqueNodeId(located.boardKey))
        }
        newTreeRef = remapTreeRef(tree, node.id, newRootId, idMap)
      }

      for (const [oldId, newId] of idMap) {
        const row = nodes[oldId]
        if (!row) continue
        const clone = structuredClone(row)
        clone.id = newId
        delete clone.ref
        const link = parseNodeLink(clone.template)
        if (link?.kind === "node" && idMap.has(link.nodeId)) {
          clone.template = formatNodeLink(idMap.get(link.nodeId)!)
        }
        draft.nodes[newId] = clone
      }

      const inserted = insertComponentTreeInstanceAfterSibling(
        board,
        node.id,
        newTreeRef,
      )
      invariant(
        inserted,
        `duplicateNode: could not insert instance ${newRootId} after ${node.id}`,
      )
    })
  }

  public moveInstanceToIndex(
    node: Variant | Instance,
    index: number,
    workspace: Workspace,
  ): Workspace {
    if (!typeCheckingService.isInstance(node)) return workspace

    return withInstanceAndParentMutation(
      node.id,
      workspace,
      (instance, parent, draft) => {
        const board = getBoardByNodeId(draft, parent.id)
        invariant(board, `Board not found for parent ${parent.id}`)

        const currentIndex = nodeRelationshipService.getInstanceIndex(
          instance,
          draft,
        )
        if (currentIndex === -1 || currentIndex === index) return

        const treeRef = findTreeRef(board, instance.id)
        invariant(treeRef, `Tree ref not found for instance ${instance.id}`)

        removeComponentTreeChild(board, instance.id)
        insertComponentTreeChild(board, parent.id, treeRef, index)
      },
    )
  }

  public reorderVariantIndex(
    node: Variant | Instance,
    index: number,
    workspace: Workspace,
  ): Workspace {
    if (!typeCheckingService.isVariant(node)) return workspace

    return withVariantAndBoardMutation(
      node.id,
      workspace,
      (variant, board, draft) => {
        const currentIndex = nodeRelationshipService.getVariantIndex(
          variant,
          draft,
        )
        if (currentIndex === -1) return

        // Clamp the target into the valid range so an out-of-bounds index
        // settles at the last slot instead of overshooting the array.
        const clampedIndex = Math.max(
          0,
          Math.min(index, board.variants.length - 1),
        )
        if (currentIndex === clampedIndex) return

        const ref = board.variants[currentIndex]
        if (!ref) return
        moveItemInArray(board.variants, ref, clampedIndex)
      },
    )
  }

  private _instantiateNode(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
  ): {
    newId: InstanceId
    newTreeRef: ComponentTreeRef
    newNodes: Record<string, EntryNode>
  } {
    const node = nodeRetrievalService.getNode(nodeId, workspace)
    if (typeCheckingService.isInstance(node)) {
      return this._instantiateInstance(nodeId as InstanceId, workspace)
    }
    return this._instantiateVariant(nodeId as VariantId, workspace)
  }

  private _instantiateVariant(
    nodeId: VariantId,
    workspace: Workspace,
  ): {
    newId: InstanceId
    newTreeRef: ComponentTreeRef
    newNodes: Record<string, EntryNode>
  } {
    const source = nodeRetrievalService.getVariant(nodeId, workspace)
    const located = findBoardContainingTreeNodeId(workspace, nodeId)
    invariant(located, `instantiate: board not found for variant ${nodeId}`)

    const tree = getVariantTree(located.board, nodeId)
    invariant(tree, `instantiate: tree not found for variant ${nodeId}`)

    const boardKey = located.boardKey
    const nodes = getWorkspaceNodes(workspace)
    const idMap = new Map<string, string>()
    const newRootId = componentBoardUniqueNodeId(boardKey)

    for (const id of collectTreeRefIds(tree)) {
      if (id === nodeId) continue
      idMap.set(id, componentBoardUniqueNodeId(boardKey))
    }

    const newNodes: Record<string, EntryNode> = {}
    newNodes[newRootId] = {
      id: newRootId,
      type: "instance",
      level: source.level,
      label: source.label,
      theme: source.theme,
      template: formatNodeLink(nodeId),
      // Born linked: inherit the source variant through the template link rather
      // than baking a copy of its overrides, so later source edits stay live.
      overrides: {},
      origin: "user",
    }

    for (const [oldId, mappedId] of idMap) {
      const row = nodes[oldId]
      if (!row) continue
      newNodes[mappedId] = cloneEntryNodeAsInstance(row, mappedId, oldId, idMap)
    }

    const newTreeRef = remapTreeRef(tree, nodeId, newRootId, idMap)

    return { newId: newRootId as InstanceId, newTreeRef, newNodes }
  }

  private _instantiateInstance(
    nodeId: InstanceId,
    workspace: Workspace,
  ): {
    newId: InstanceId
    newTreeRef: ComponentTreeRef
    newNodes: Record<string, EntryNode>
  } {
    const source = nodeRetrievalService.getInstance(nodeId, workspace)
    const located = findBoardContainingTreeNodeId(workspace, nodeId)
    invariant(located, `instantiate: board not found for instance ${nodeId}`)

    const tree = getVariantTree(located.board, nodeId)
    const boardKey = located.boardKey
    const newRootId = componentBoardUniqueNodeId(boardKey)
    const newNodes: Record<string, EntryNode> = {}

    newNodes[newRootId] = {
      ...structuredClone(source),
      id: newRootId,
      type: "instance",
      template: formatNodeLink(nodeId),
      // Born linked: inherit the source instance through the template link, so
      // the copy tracks it live instead of freezing its current values.
      overrides: {},
      origin: "user",
    }
    delete newNodes[newRootId].ref
    delete newNodes[newRootId].states

    let newTreeRef: ComponentTreeRef = { id: newRootId }

    if (tree) {
      const nodes = getWorkspaceNodes(workspace)
      const idMap = new Map<string, string>()
      for (const id of collectTreeRefIds(tree)) {
        if (id === nodeId) continue
        idMap.set(id, componentBoardUniqueNodeId(boardKey))
      }
      for (const [oldId, mappedId] of idMap) {
        const row = nodes[oldId]
        if (!row) continue
        newNodes[mappedId] = cloneEntryNodeAsInstance(
          row,
          mappedId,
          oldId,
          idMap,
        )
      }
      newTreeRef = remapTreeRef(tree, nodeId, newRootId, idMap)
    }

    return { newId: newRootId as InstanceId, newTreeRef, newNodes }
  }
}

function walkRemoveVariantRefs(
  refs: ComponentTreeRef[],
  variantId: string,
): void {
  for (const ref of refs) {
    if (ref.children) {
      ref.children = ref.children.filter((c) => c.id !== variantId)
      for (const child of ref.children) {
        if (child.children) walkRemoveVariantRefs([child], variantId)
      }
    }
  }
}

export const nodeOperationsService = new NodeOperationsService()
