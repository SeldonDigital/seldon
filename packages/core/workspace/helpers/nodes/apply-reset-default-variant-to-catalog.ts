import { produce } from "immer"

import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId, isComponentId } from "../../../components/constants"
import { isComplexSchema } from "../../../components/types"
import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { parseNodeLink } from "../../model/template-ref"
import type { EntryNode, Workspace } from "../../types"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"
import { rebuildDefaultChildren } from "./build-component-variants"
import { collectTreeRefIds } from "./collect-tree-ref-ids"
import { findBoardContainingTreeNodeId } from "./duplicate-entry-variant-subtree"
import { getNodeCatalogId } from "./get-node-catalog-id"

function collectAllComponentTreeNodeIds(workspace: Workspace): Set<string> {
  const out = new Set<string>()
  for (const board of Object.values(workspace.boards)) {
    walkBoardTreeRefs(board.variants ?? [], (ref) => {
      out.add(ref.id)
    })
  }
  return out
}

/**
 * Resets a default variant to its catalog schema default composition. Rebuilds
 * `board.variants[0]` to match `getComponentSchema(id).default`: re-adds removed
 * children, drops added ones, fixes order, and restores child overrides, while
 * preserving canonical child ids that schema variants and instances reference.
 * Schema-variant and user-variant entries are left untouched. Orphaned nodes
 * that nothing else references are removed.
 */
export function applyResetDefaultVariantToCatalog(
  workspace: Workspace,
  defaultVariantRootId: string,
): Workspace {
  return produce(workspace, (draft) => {
    const located = findBoardContainingTreeNodeId(draft, defaultVariantRootId)
    if (
      !located ||
      !(isComponentBoard(located.board) || isPlaygroundBoard(located.board))
    ) {
      return
    }

    const { board } = located
    const defaultRef = board.variants[0]
    if (!defaultRef || defaultRef.id !== defaultVariantRootId) return

    const rootNode = draft.nodes[defaultVariantRootId]
    if (!rootNode || rootNode.type !== "default") return

    const catalogId = getNodeCatalogId(rootNode, draft)
    if (!catalogId || !isComponentId(catalogId)) return
    const schema = getComponentSchema(catalogId as ComponentId)

    const oldIds = new Set(collectTreeRefIds(defaultRef))

    rootNode.overrides = {}
    rootNode.theme = null
    rootNode.__editor = { initialOverrides: {} }

    if (!isComplexSchema(schema)) {
      board.variants[0] = { id: defaultVariantRootId }
    } else {
      const newNodes: Record<string, EntryNode> = {}
      const childRefs = rebuildDefaultChildren(
        schema.default.children ?? [],
        defaultRef.children,
        {
          workspace: draft,
          newNodes,
        },
      )
      board.variants[0] = childRefs.length
        ? { id: defaultVariantRootId, children: childRefs }
        : { id: defaultVariantRootId }
      for (const [id, node] of Object.entries(newNodes)) {
        draft.nodes[id] = node
      }
    }

    const newIds = new Set(collectTreeRefIds(board.variants[0]))
    const referenced = collectAllComponentTreeNodeIds(draft)

    // Schema-variant trees hold forked copies whose `node:` templates point at
    // the default tree's canonical instances. Protect those targets so a reset
    // never leaves a surviving fork with a dangling template.
    const removalCandidates = new Set(
      [...oldIds].filter((id) => !newIds.has(id) && !referenced.has(id)),
    )
    const templateTargetsOfSurvivors = new Set<string>()
    for (const [nodeId, node] of Object.entries(draft.nodes)) {
      if (removalCandidates.has(nodeId)) continue
      const link = parseNodeLink(node.template)
      if (link?.kind === "node") {
        templateTargetsOfSurvivors.add(link.nodeId)
      }
    }

    for (const id of removalCandidates) {
      if (templateTargetsOfSurvivors.has(id)) continue
      delete draft.nodes[id]
    }
  })
}
