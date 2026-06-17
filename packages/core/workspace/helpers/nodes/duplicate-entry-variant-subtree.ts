import { current, isDraft } from "immer"

import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { isEntryNodeDefault, isEntryNodeVariant } from "../../model/entry-node"
import { formatNodeLink, parseNodeLink } from "../../model/template-ref"
import type { Board, ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { componentBoardUniqueNodeId } from "../components/entry-node-ids"
import { getVariantTree } from "../components/get-variant-tree"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"
import { getCompositionContainerEntries } from "../general/get-composition-containers"
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

export function findBoardContainingTreeNodeId(
  workspace: Workspace,
  nodeId: string,
): { board: Board; boardKey: string } | null {
  for (const [boardKey, board] of getCompositionContainerEntries(workspace)) {
    if (!board.variants?.length) continue
    let found = false
    walkBoardTreeRefs(board.variants, (ref) => {
      if (ref.id === nodeId) {
        found = true
        return true
      }
    })
    if (found) return { board, boardKey }
  }
  return null
}

/**
 * Inserts a new instance ref immediately after an existing sibling in the board tree.
 * Accepts either an instance id (inserted as a leaf ref) or a full `ComponentTreeRef`
 * so duplicated instance subtrees keep their children.
 */
export function insertComponentTreeInstanceAfterSibling(
  board: Board,
  afterInstanceId: string,
  newInstance: string | ComponentTreeRef,
): boolean {
  const newRef: ComponentTreeRef =
    typeof newInstance === "string" ? { id: newInstance } : newInstance
  let inserted = false
  walkBoardTreeRefs(board.variants, (ref) => {
    const children = ref.children
    if (!children?.length) return
    const idx = children.findIndex((c) => c.id === afterInstanceId)
    if (idx < 0) return
    children.splice(idx + 1, 0, newRef)
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
  board: Board,
  boardKey: string,
  sourceRootId: string,
  newVariantLabel: string,
): DuplicateEntryVariantPlan | null {
  if (!isComponentBoard(board) && !isPlaygroundBoard(board)) return null

  const liveNodes = getWorkspaceNodes(workspace)
  const nodes = isDraft(liveNodes) ? current(liveNodes) : liveNodes
  const sourceNode = nodes[sourceRootId]
  if (!sourceNode) return null

  const tree = getVariantTree(board, sourceRootId)
  if (!tree) return null

  const subtreeIds = collectTreeRefIds(tree)
  const idMap = new Map<string, string>()
  const newRootId = componentBoardUniqueNodeId(boardKey)

  if (isEntryNodeDefault(sourceNode)) {
    for (const id of subtreeIds) {
      if (id === sourceRootId) continue
      idMap.set(id, componentBoardUniqueNodeId(boardKey))
    }
  } else if (isEntryNodeVariant(sourceNode)) {
    for (const id of subtreeIds) {
      idMap.set(
        id,
        id === sourceRootId ? newRootId : componentBoardUniqueNodeId(boardKey),
      )
    }
  } else {
    return null
  }

  function remapTreeRef(ref: ComponentTreeRef): ComponentTreeRef {
    const mapped = ref.id === sourceRootId ? newRootId : idMap.get(ref.id)
    if (!mapped) {
      throw new Error(
        `duplicate variant: missing id remap for tree ref ${ref.id}`,
      )
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
      // Chain the new child from the default variant's matching child so edits
      // to the default child propagate into the user variant. Start with empty
      // overrides so inherited values are not shadowed by a copy.
      let template = formatNodeLink(oldId)
      const link = parseNodeLink(row.template)
      if (link?.kind === "node" && idMap.has(link.nodeId)) {
        template = formatNodeLink(idMap.get(link.nodeId)!)
      }
      newNodes[newId] = {
        ...structuredClone(row),
        id: newId,
        type: "instance",
        template,
        overrides: {},
        origin: "schema",
        __editor: { initialOverrides: {} },
      }
    }
  } else {
    const defaultVariantId = board.variants[0]?.id
    // A playground has no default variant; its Sandbox roots are independent
    // entities. Keep the duplicated Sandbox templating from its own source
    // (`catalog:sandbox`) instead of chaining it to another sandbox.
    const rootTemplate = isPlaygroundBoard(board)
      ? nodes[sourceRootId]?.template ?? formatNodeLink(sourceRootId)
      : formatNodeLink(defaultVariantId ?? sourceRootId)
    for (const [oldId, newId] of idMap) {
      const row = nodes[oldId]
      if (!row) continue
      if (oldId === sourceRootId) {
        newNodes[newId] = {
          ...structuredClone(row),
          id: newId,
          type: "variant",
          label: newVariantLabel,
          template: rootTemplate,
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
