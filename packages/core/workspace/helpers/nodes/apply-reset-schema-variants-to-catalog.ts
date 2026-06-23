import { produce } from "immer"

import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId } from "../../../components/constants"
import { isComponentBoard } from "../../model/components"
import { parseNodeLink } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { componentBoardDefaultNodeId } from "../components/entry-node-ids"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"
import {
  buildCanonicalInstanceMap,
  buildComponentRegistry,
  rebuildSchemaVariant,
  seedCanonicalNodes,
} from "./rebuild-schema-variants"

/**
 * Rebuilds every catalog schema variant of a component board to its catalog
 * definition, after the default variant has been reset. Keeps deterministic
 * variant root ids so other boards that reference them stay linked, rebuilds
 * fork child trees against the reset default tree's canonical instances, drops
 * user variants, normalizes variant order, and prunes orphaned nodes without
 * the cross-board cascade that variant deletion would trigger.
 */
export function applyResetSchemaVariantsToCatalog(
  workspace: Workspace,
  boardKey: string,
): Workspace {
  return produce(workspace, (draft) => {
    const board = draft.boards[boardKey]
    if (!board || !isComponentBoard(board)) return

    const catalogId = board.catalogId as ComponentId
    const schema = getComponentSchema(catalogId)
    const defaultVariantRootId = componentBoardDefaultNodeId(boardKey)

    const oldIds = new Set<string>()
    walkBoardTreeRefs(board.variants, (ref) => {
      oldIds.add(ref.id)
    })

    const defaultRef = board.variants.find(
      (ref) => ref.id === defaultVariantRootId,
    ) ?? { id: defaultVariantRootId }

    const registry = buildComponentRegistry(draft)
    const canonicalInstanceByFingerprint = buildCanonicalInstanceMap(
      schema,
      defaultRef,
    )
    const { newNodes, seededIds } = seedCanonicalNodes(
      draft.nodes,
      canonicalInstanceByFingerprint,
    )

    const schemaVariantRefs: ComponentTreeRef[] = (schema.variants ?? []).map(
      (catalogVariant) =>
        rebuildSchemaVariant({
          catalogId,
          defaultVariantRootId,
          schema,
          catalogVariant,
          registry,
          newNodes,
          canonicalInstanceByFingerprint,
        }),
    )

    for (const [id, node] of Object.entries(newNodes)) {
      if (seededIds.has(id)) continue
      draft.nodes[id] = node
    }

    board.variants = [defaultRef, ...schemaVariantRefs]

    // Prune nodes that the board no longer lists. Use direct deletion rather
    // than variant removal so references in other boards are never cascaded.
    const newIds = new Set<string>()
    for (const candidate of Object.values(draft.boards)) {
      walkBoardTreeRefs(candidate.variants, (ref) => {
        newIds.add(ref.id)
      })
    }
    const removalCandidates = new Set(
      [...oldIds].filter((id) => !newIds.has(id)),
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
