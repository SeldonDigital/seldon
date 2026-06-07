import { produce } from "immer"
import { getComponentSchema } from "../../../../components/catalog"
import { isComponentId } from "../../../../components/constants"
import { componentBoardDefaultNodeId } from "../../../helpers/components/entry-node-ids"
import { componentBoardSchemaVariantNodeId } from "../../../helpers/components/entry-node-ids"
import { getVariantTree } from "../../../helpers/components/get-variant-tree"
import { getWorkspaceNodes } from "../../../helpers/general/get-workspace-nodes"
import { isComponentBoard } from "../../../model/components"
import { parseNodeLink } from "../../../model/template-ref"
import type {
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "../../../types"

function collectTreeRefIds(ref: ComponentTreeRef): EntryNodeId[] {
  const ids: EntryNodeId[] = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectTreeRefIds(child))
  }
  return ids
}

/**
 * Reports whether the node's template chain resolves into the default variant
 * tree. User-variant children that mirror the default chain from the default
 * variant's children, so they count as schema origin.
 */
function resolvesIntoDefault(
  node: EntryNode,
  defaultIds: Set<string>,
  nodes: Record<EntryNodeId, EntryNode>,
): boolean {
  const seen = new Set<string>()
  let current: EntryNode | undefined = node
  while (current) {
    const link = parseNodeLink(current.template)
    if (!link) return false
    if (defaultIds.has(link.nodeId)) return true
    if (seen.has(link.nodeId)) return false
    seen.add(link.nodeId)
    current = nodes[link.nodeId]
  }
  return false
}

/**
 * Seeds the `origin` classification on instance nodes for workspaces saved
 * before the field existed. Instances in the default variant tree or a catalog
 * schema variant tree are schema origin. User-variant children that mirror the
 * default tree through their template chain are schema origin. Everything else,
 * including playground and orphan instances, is user origin. The engine keeps
 * `origin` exact for instances created after this seed.
 */
export function backfillInstanceOrigin(workspace: Workspace): Workspace {
  return produce(workspace, (draft) => {
    const nodes = getWorkspaceNodes(draft)

    for (const board of Object.values(draft.components)) {
      if (!isComponentBoard(board)) continue
      const boardKey = board.catalogId
      if (!isComponentId(boardKey)) continue

      const schema = getComponentSchema(boardKey)
      const schemaVariantIds =
        (schema as { variants?: { id: string }[] }).variants ?? []
      const defaultRootId = componentBoardDefaultNodeId(boardKey)
      const catalogRootIds = new Set<string>([
        defaultRootId,
        ...schemaVariantIds.map((variant) =>
          componentBoardSchemaVariantNodeId(boardKey, variant.id),
        ),
      ])

      const defaultTree = getVariantTree(board, defaultRootId)
      const defaultIds = new Set<string>(
        defaultTree ? collectTreeRefIds(defaultTree) : [],
      )

      const schemaIds = new Set<string>()
      for (const rootId of catalogRootIds) {
        const tree = getVariantTree(board, rootId)
        if (!tree) continue
        for (const id of collectTreeRefIds(tree)) schemaIds.add(id)
      }

      const boardIds = new Set<string>()
      for (const variantRef of board.variants) {
        const ids = collectTreeRefIds(variantRef)
        for (const id of ids) boardIds.add(id)
        if (catalogRootIds.has(variantRef.id)) continue
        for (const id of ids) {
          if (id === variantRef.id) continue
          const node = nodes[id]
          if (node && resolvesIntoDefault(node, defaultIds, nodes)) {
            schemaIds.add(id)
          }
        }
      }

      for (const id of boardIds) {
        const node = nodes[id]
        if (node?.type === "instance") {
          node.origin = schemaIds.has(id) ? "schema" : "user"
        }
      }
    }

    for (const node of Object.values(nodes)) {
      if (node.type === "instance" && node.origin === undefined) {
        node.origin = "user"
      }
    }
  })
}
