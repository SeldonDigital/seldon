import { WritableDraft, current, isDraft, produce } from "immer"
import { ComponentId } from "../../../components/constants"
import { invariant } from "../../../index"
import { debugLog } from "../../../utils/debug-logger"
import { ErrorMessages } from "../../constants"
import { getComponentVariantRootIds } from "../../helpers/components/get-component-variant-root-ids"
import { getComponentByNodeId } from "../../helpers/components/get-component-by-node-id"
import { getVariantTree } from "../../helpers/components/get-variant-tree"
import { componentBoardUniqueNodeId } from "../../helpers/components/entry-node-ids"
import { moveItemInArray } from "../../helpers/nodes/move-utils"
import {
  buildDuplicateEntryVariantSubtreePlan,
  findComponentContainingTreeNodeId,
  insertComponentTreeInstanceAfterSibling,
} from "../../helpers/nodes/duplicate-entry-variant-subtree"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import type { EntryNode } from "../../model/entry-node"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
} from "../../model/components"
import type { ComponentKey } from "../../model/components"
import type { ComponentTreeRef } from "../../model/component-tree"
import {
  formatNodeLink,
  parseNodeCatalog,
  parseNodeLink,
} from "../../model/template-ref"
import { Instance, InstanceId, Variant, VariantId, Workspace } from "../../types"
import { workspacePropagationService } from "../propagation/workspace-propagation.service"
import { workspaceMutationService } from "../mutation/workspace-mutation.service"
import {
  collectDescendantTreeIds,
  insertComponentTreeChild,
  removeComponentTreeChild,
  findTreeRef,
} from "../shared/component-tree-helpers"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import {
  withInstanceAndParentMutation,
  withNodeMutation,
  withVariantAndComponentMutation,
} from "../shared/workspace-operation-helpers"
import { nodeRelationshipService } from "./node-relationship.service"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"
import { typeCheckingService } from "../type-checking/type-checking.service"

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
    const updatedWorkspace = produce(workspace, (draft) => {
      const parentBoard = getComponentByNodeId(draft, parentId)
      invariant(parentBoard, `Board not found for parent ${parentId}`)

      const { newId: newNodeId, newTreeRef, newNodes } = this._instantiateNode(
        nodeId,
        draft as unknown as Workspace,
        parentBoard,
      )

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

  public deleteComponent(
    componentId: ComponentId,
    workspace: Workspace,
  ): Workspace {
    const workspaceAfterDeletion = mutateWorkspace(workspace, (draft) => {
      const board = draft.components[componentId]
      if (!board) return

      for (const rootId of getComponentVariantRootIds(board)) {
        const workspaceWithoutVariant = this.deleteVariant(
          rootId as VariantId,
          draft,
        )
        Object.assign(draft.nodes, workspaceWithoutVariant.nodes)
      }

      delete draft.components[componentId]
    })

    return workspacePropagationService.realignComponentOrder(
      workspaceAfterDeletion,
    )
  }

  public deleteComponentByKey(
    componentKey: ComponentKey,
    workspace: Workspace,
  ): Workspace {
    const board = workspace.components[componentKey]
    if (!board) return workspace

    if (isComponentBoard(board)) {
      return this.deleteComponent(componentKey as ComponentId, workspace)
    }

    if (isPlaygroundBoard(board)) {
      const workspaceAfterDeletion = mutateWorkspace(workspace, (draft) => {
        const b = draft.components[componentKey]
        if (!b || !isPlaygroundBoard(b)) return

        for (const rootId of getComponentVariantRootIds(b)) {
          const workspaceWithoutVariant = this.deleteVariant(
            rootId as VariantId,
            draft,
          )
          Object.assign(draft.nodes, workspaceWithoutVariant.nodes)
        }

        delete draft.components[componentKey]
      })

      return workspacePropagationService.realignComponentOrder(
        workspaceAfterDeletion,
      )
    }

    if (isFontCollectionBoard(board)) {
      const next = mutateWorkspace(workspace, (draft) => {
        const b = draft.components[componentKey]
        if (!b || !isFontCollectionBoard(b)) return
        for (const ref of b.variants) {
          delete draft["font-collections"][ref.id]
        }
        delete draft.components[componentKey]
      })
      return workspacePropagationService.realignComponentOrder(next)
    }

    if (isMediaBoard(board)) {
      const next = mutateWorkspace(workspace, (draft) => {
        const b = draft.components[componentKey]
        if (!b || !isMediaBoard(b)) return
        for (const ref of b.variants) {
          delete draft.media[ref.id]
        }
        delete draft.components[componentKey]
      })
      return workspacePropagationService.realignComponentOrder(next)
    }

    if (isIconSetBoard(board)) {
      const next = mutateWorkspace(workspace, (draft) => {
        const b = draft.components[componentKey]
        if (!b || !isIconSetBoard(b)) return
        for (const ref of b.variants) {
          delete draft["icon-sets"][ref.id]
        }
        delete draft.components[componentKey]
      })
      return workspacePropagationService.realignComponentOrder(next)
    }

    return workspace
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

      const oldBoard = getComponentByNodeId(draft, currentParent.id)
      invariant(oldBoard, `Board not found for parent ${currentParent.id}`)

      // Capture the full tree ref before removing it so the instance keeps its
      // child subtree. Inserting a bare { id } ref would orphan every child node.
      const treeRef = findTreeRef(oldBoard, instanceId)
      invariant(treeRef, `Tree ref not found for instance ${instanceId}`)
      removeComponentTreeChild(oldBoard, instanceId)

      const newBoard = getComponentByNodeId(draft, newPosition.parentId)
      invariant(
        newBoard,
        `Board not found for parent ${newPosition.parentId}`,
      )

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

      for (const board of Object.values(draft.components)) {
        if (!board) continue
        board.variants = board.variants.filter((ref) => ref.id !== variantId)
        walkRemoveVariantRefs(board.variants, variantId)
      }
    })
  }

  private _deleteSubtreeFromDraft(
    nodeId: VariantId | InstanceId,
    draftWorkspace: WritableDraft<Workspace>,
  ): void {
    if (!isDraft(draftWorkspace)) {
      throw new Error("Workspace is not an immer draft")
    }

    const board = getComponentByNodeId(
      draftWorkspace as unknown as Workspace,
      nodeId,
    )
    const treeRef = board ? findTreeRef(board, nodeId) : null
    const idsToDelete = treeRef
      ? collectDescendantTreeIds(treeRef)
      : [nodeId]

    if (board && treeRef) {
      const isTopLevelRoot = board.variants.some((ref) => ref.id === nodeId)
      if (!isTopLevelRoot) {
        removeComponentTreeChild(board, nodeId)
      }
    }

    for (const id of idsToDelete) {
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
        const located = findComponentContainingTreeNodeId(
          draft as unknown as Workspace,
          node.id,
        )
        invariant(located, ErrorMessages.componentNotFoundForVariant(node.id))
        invariant(
          isComponentBoard(located.board) ||
            isPlaygroundBoard(located.board),
          `duplicateNode: unsupported board type for ${node.id}`,
        )

        const defaultVariantRow = getWorkspaceNodes(
          draft as unknown as Workspace,
        )[located.board.variants[0]?.id as string]
        const componentId =
          nodeCatalogComponentId(node) ??
          nodeCatalogComponentId(defaultVariantRow)
        invariant(
          componentId,
          `duplicateNode: missing catalog template for variant ${node.id}`,
        )

        const label = workspaceMutationService.getInitialVariantLabel(
          componentId,
          draft as unknown as Workspace,
        )
        const plan = buildDuplicateEntryVariantSubtreePlan(
          draft as unknown as Workspace,
          located.board,
          located.componentKey,
          node.id,
          label,
        )
        invariant(plan, `duplicateNode: could not plan variant duplicate ${node.id}`)

        const board = draft.components[located.componentKey as ComponentKey]
        Object.assign(draft.nodes, plan.newNodes)

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

      const located = findComponentContainingTreeNodeId(
        draft as unknown as Workspace,
        node.id,
      )
      invariant(located, ErrorMessages.parentNotFound(nodeId))

      const liveNodes = getWorkspaceNodes(draft as unknown as Workspace)
      const nodes = isDraft(liveNodes) ? current(liveNodes) : liveNodes
      const sourceRow = nodes[node.id]
      invariant(sourceRow, ErrorMessages.nodeNotFound(node.id))

      const board = draft.components[located.componentKey as ComponentKey]
      const tree = getVariantTree(board, node.id)

      const newRootId = componentBoardUniqueNodeId(located.componentKey)
      const idMap = new Map<string, string>()
      idMap.set(node.id, newRootId)

      let newTreeRef: ComponentTreeRef = { id: newRootId }
      if (tree) {
        for (const id of collectDescendantTreeIds(tree)) {
          if (id === node.id) continue
          idMap.set(id, componentBoardUniqueNodeId(located.componentKey))
        }
        newTreeRef = remapTreeRef(tree, node.id, newRootId, idMap)
      }

      for (const [oldId, newId] of idMap) {
        const row = nodes[oldId]
        if (!row) continue
        const clone = structuredClone(row)
        clone.id = newId
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
        const board = getComponentByNodeId(draft, parent.id)
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

    return withVariantAndComponentMutation(
      node.id,
      workspace,
      (variant, board, draft) => {
        const currentIndex = nodeRelationshipService.getVariantIndex(
          variant,
          draft,
        )
        if (currentIndex === -1 || currentIndex === index) return

        const ref = board.variants[currentIndex]
        if (!ref) return
        moveItemInArray(board.variants, ref, index)
      },
    )
  }

  private _instantiateNode(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
    _parentBoard: import("../../types").ComponentEntry,
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
    const located = findComponentContainingTreeNodeId(workspace, nodeId)
    invariant(located, `instantiate: board not found for variant ${nodeId}`)

    const tree = getVariantTree(located.board, nodeId)
    invariant(tree, `instantiate: tree not found for variant ${nodeId}`)

    const componentKey = located.componentKey
    const nodes = getWorkspaceNodes(workspace)
    const idMap = new Map<string, string>()
    const newRootId = componentBoardUniqueNodeId(componentKey)

    for (const id of collectDescendantTreeIds(tree)) {
      if (id === nodeId) continue
      idMap.set(id, componentBoardUniqueNodeId(componentKey))
    }

    const newNodes: Record<string, EntryNode> = {}
    newNodes[newRootId] = {
      id: newRootId,
      type: "instance",
      level: source.level,
      label: source.label,
      theme: source.theme,
      template: formatNodeLink(nodeId),
      overrides: structuredClone(
        (source as import("../../model/entry-node").EntryNode).overrides,
      ),
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
    const located = findComponentContainingTreeNodeId(workspace, nodeId)
    invariant(located, `instantiate: board not found for instance ${nodeId}`)

    const tree = getVariantTree(located.board, nodeId)
    const componentKey = located.componentKey
    const newRootId = componentBoardUniqueNodeId(componentKey)
    const newNodes: Record<string, EntryNode> = {}

    newNodes[newRootId] = {
      ...structuredClone(source),
      id: newRootId,
      type: "instance",
      template: formatNodeLink(nodeId),
    }

    let newTreeRef: ComponentTreeRef = { id: newRootId }

    if (tree) {
      const nodes = getWorkspaceNodes(workspace)
      const idMap = new Map<string, string>()
      for (const id of collectDescendantTreeIds(tree)) {
        if (id === nodeId) continue
        idMap.set(id, componentBoardUniqueNodeId(componentKey))
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
