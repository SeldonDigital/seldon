import { produce } from "immer"

import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId } from "../../../components/constants"
import { isComplexSchema } from "../../../components/types"
import { isComponentBoard } from "../../model/components"
import { parseNodeLink } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "../components/entry-node-ids"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"
import { mapTopLevelCanonicals } from "./build-component-variants"
import { findBoardContainingTreeNodeId } from "./duplicate-entry-variant-subtree"
import { rebuildSchemaVariant } from "./rebuild-schema-variants"

function collectTreeRefIds(ref: ComponentTreeRef): Set<string> {
  const ids = new Set<string>()
  walkBoardTreeRefs([ref], (current) => {
    ids.add(current.id)
  })
  return ids
}

function collectReferencedTreeNodeIds(workspace: Workspace): Set<string> {
  const ids = new Set<string>()
  for (const board of Object.values(workspace.boards)) {
    walkBoardTreeRefs(board.variants ?? [], (ref) => {
      ids.add(ref.id)
    })
  }
  return ids
}

/**
 * Rebuilds a single schema-backed variant to its catalog definition while
 * leaving the default variant and other variants untouched. Keeps the variant's
 * deterministic root id so cross-board references stay linked, forks the current
 * default tree's canonical instances so default overrides still cascade into the
 * variant, and prunes the variant's orphaned fork nodes. No-op when the target is
 * not a schema-backed variant.
 */
export function applyResetSchemaVariantToCatalog(
  workspace: Workspace,
  variantRootId: string,
): Workspace {
  return produce(workspace, (draft) => {
    const located = findBoardContainingTreeNodeId(draft, variantRootId)
    if (!located || !isComponentBoard(located.board)) return

    const { board, boardKey } = located
    const targetIdx = board.variants.findIndex((v) => v.id === variantRootId)
    if (targetIdx <= 0) return

    const catalogId = board.catalogId as ComponentId
    const schema = getComponentSchema(catalogId)
    const defaultVariantRootId = componentBoardDefaultNodeId(boardKey)

    const catalogVariant = (schema.variants ?? []).find(
      (candidate) =>
        componentBoardSchemaVariantNodeId(boardKey, candidate.id) ===
        variantRootId,
    )
    if (!catalogVariant) return

    const oldRef = board.variants[targetIdx]
    const oldIds = collectTreeRefIds(oldRef)

    const defaultRef = board.variants[0] ?? { id: defaultVariantRootId }

    const canonicalMap = mapTopLevelCanonicals(
      isComplexSchema(schema) ? schema.default.children : undefined,
      defaultRef,
    )
    const newNodes: Record<string, EntryNode> = {}

    const newRef = rebuildSchemaVariant({
      catalogId,
      defaultVariantRootId,
      schema,
      catalogVariant,
      workspace: draft,
      newNodes,
      canonicalMap,
    })

    for (const [id, node] of Object.entries(newNodes)) {
      draft.nodes[id] = node
    }

    board.variants[targetIdx] = newRef

    // Prune the old fork nodes the variant no longer lists, but keep any node
    // still referenced by another board or used as a template by a survivor.
    const newIds = collectTreeRefIds(newRef)
    const referenced = collectReferencedTreeNodeIds(draft)
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
