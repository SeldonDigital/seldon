import type { ComponentEntry, ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { isEntryNodeDefault, isEntryNodeVariant } from "../../model/entry-node"
import { formatNodeLink, parseNodeLink } from "../../model/template-ref"
import { getVariantTree } from "../components/get-variant-tree"
import { walkComponentTreeRefs } from "../components/walk-component-tree-refs"
import { componentBoardUniqueNodeId } from "../components/entry-node-ids"
import { getWorkspaceNodes } from "../general/get-workspace-nodes"

function collectTreeRefIds(ref: ComponentTreeRef): string[] {
  const ids = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectTreeRefIds(child))
  }
  return ids
}

function cloneEntryNodeWithIdRemap(
  row: EntryNode,
  newId: string,
  idMap: Map<string, string>,
): EntryNode {
  const clone = structuredClone(row) as EntryNode
  clone.id = newId
  const link = parseNodeLink(clone.template)
  if (link && idMap.has(link.nodeId)) {
    clone.template = formatNodeLink(idMap.get(link.nodeId)!)
  }
  return clone
}

export function findComponentContainingTreeNodeId(
  workspace: Workspace,
  nodeId: string,
): { board: ComponentEntry; componentKey: string } | null {
  for (const [componentKey, board] of Object.entries(workspace.components)) {
    if (!board.variants?.length) continue
    let found = false
    walkComponentTreeRefs(board.variants, (ref) => {
      if (ref.id === nodeId) {
        found = true
        return true
      }
    })
    if (found) return { board, componentKey }
  }
  return null
}

/**
 * Inserts a new instance ref immediately after an existing sibling in the board tree.
 */
export function insertComponentTreeInstanceAfterSibling(
  board: ComponentEntry,
  afterInstanceId: string,
  newInstanceId: string,
): boolean {
  let inserted = false
  walkComponentTreeRefs(board.variants, (ref) => {
    const children = ref.children
    if (!children?.length) return
    const idx = children.findIndex((c) => c.id === afterInstanceId)
    if (idx < 0) return
    children.splice(idx + 1, 0, { id: newInstanceId })
    inserted = true
    return true
  })
  return inserted
}

export type DuplicateEntryVariantPlan = {
  newRootId: string
  newNodes: Record<string, EntryNode>
  newRootTreeRef: ComponentTreeRef
  sourceWasDefault: boolean
}

/**
 * Builds cloned `nodes` rows and a remapped `ComponentTreeRef` for duplicating a variant root
 * when the workspace uses `EntryNode` rows and board composition trees.
 */
export function buildDuplicateEntryVariantSubtreePlan(
  workspace: Workspace,
  board: ComponentEntry,
  componentKey: string,
  sourceRootId: string,
  newVariantLabel: string,
): DuplicateEntryVariantPlan | null {
  if (!isComponentBoard(board) && !isPlaygroundBoard(board)) return null

  const nodes = getWorkspaceNodes(workspace)
  const sourceNode = nodes[sourceRootId]
  if (!sourceNode) return null

  const tree = getVariantTree(board, sourceRootId)
  if (!tree) return null

  const subtreeIds = collectTreeRefIds(tree)
  const idMap = new Map<string, string>()
  const newRootId = componentBoardUniqueNodeId(componentKey)

  if (isEntryNodeDefault(sourceNode)) {
    for (const id of subtreeIds) {
      if (id === sourceRootId) continue
      idMap.set(id, componentBoardUniqueNodeId(componentKey))
    }
  } else if (isEntryNodeVariant(sourceNode)) {
    for (const id of subtreeIds) {
      idMap.set(
        id,
        id === sourceRootId ? newRootId : componentBoardUniqueNodeId(componentKey),
      )
    }
  } else {
    return null
  }

  function remapTreeRef(ref: ComponentTreeRef): ComponentTreeRef {
    const mapped =
      ref.id === sourceRootId ? newRootId : idMap.get(ref.id)
    if (!mapped) {
      throw new Error(`duplicate variant: missing id remap for tree ref ${ref.id}`)
    }
    return {
      id: mapped,
      children: ref.children?.map(remapTreeRef),
    }
  }

  const newRootTreeRef = remapTreeRef(tree)
  const newNodes: Record<string, EntryNode> = {}

  if (isEntryNodeDefault(sourceNode)) {
    newNodes[newRootId] = {
      ...structuredClone(sourceNode),
      id: newRootId,
      type: "variant",
      label: newVariantLabel,
      template: formatNodeLink(sourceRootId),
      overrides: structuredClone(sourceNode.overrides),
    }
    for (const [oldId, newId] of idMap) {
      const row = nodes[oldId]
      if (!row) continue
      newNodes[newId] = cloneEntryNodeWithIdRemap(row, newId, idMap)
    }
  } else {
    for (const [oldId, newId] of idMap) {
      const row = nodes[oldId]
      if (!row) continue
      if (oldId === sourceRootId) {
        newNodes[newId] = {
          ...structuredClone(row),
          id: newId,
          type: "variant",
          label: newVariantLabel,
          template: formatNodeLink(sourceRootId),
          overrides: structuredClone(row.overrides),
        }
      } else {
        newNodes[newId] = cloneEntryNodeWithIdRemap(row, newId, idMap)
      }
    }
  }

  return {
    newRootId,
    newNodes,
    newRootTreeRef,
    sourceWasDefault: isEntryNodeDefault(sourceNode),
  }
}
