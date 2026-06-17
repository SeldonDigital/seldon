import { produce } from "immer"

import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId } from "../../../components/constants"
import { type SchemaChild, isComplexSchema } from "../../../components/types"
import { isComponentBoard } from "../../model/components"
import { parseNodeLink } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { componentBoardDefaultNodeId } from "../components/entry-node-ids"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"
import {
  type NodeRegistry,
  appendComplexSchemaVariant,
  makePrimitiveVariantNode,
} from "./build-component-variants"
import { resolveSchemaChild } from "./resolve-schema-child"
import {
  applyVariantFallbackToSlot,
  mergeInlineSlotOverrides,
} from "./schema-composition-children"
import { getSchemaSlotFingerprint } from "./schema-slot-fingerprint"

/**
 * Rebuilds the `fingerprint -> canonical instance id` map from a reset default
 * tree. The reset default tree is positionally aligned with
 * `schema.default.children`, so the same slot walk add uses reproduces the
 * fingerprints, mapped here to the existing default-tree instance ids.
 */
function mapDefaultTreeCanonicals(
  slots: SchemaChild[],
  refs: ComponentTreeRef[],
  canonicalInstanceByFingerprint: Map<string, string>,
): void {
  slots.forEach((rawSlot, index) => {
    const ref = refs[index]
    if (!ref) return
    const slot = applyVariantFallbackToSlot(rawSlot, undefined)
    const fingerprint = getSchemaSlotFingerprint(slot)
    canonicalInstanceByFingerprint.set(fingerprint, ref.id)

    const resolved = resolveSchemaChild(slot)
    const childSlots: SchemaChild[] = slot.children?.length
      ? slot.children
      : resolved.fallbackChildren.map((fallbackSlot) =>
          mergeInlineSlotOverrides(fallbackSlot),
        )
    mapDefaultTreeCanonicals(
      childSlots,
      ref.children ?? [],
      canonicalInstanceByFingerprint,
    )
  })
}

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

    const registry: NodeRegistry = new Set()
    for (const candidate of Object.values(draft.boards)) {
      if (isComponentBoard(candidate)) {
        registry.add(candidate.catalogId as ComponentId)
      }
    }

    const newNodes: Record<string, EntryNode> = {}
    const seededIds = new Set<string>()
    const schemaVariantRefs: ComponentTreeRef[] = []

    if (!isComplexSchema(schema)) {
      for (const catalogVariant of schema.variants ?? []) {
        const { id, node } = makePrimitiveVariantNode(
          catalogId,
          schema,
          catalogVariant,
        )
        newNodes[id] = node
        schemaVariantRefs.push({ id })
      }
    } else {
      const canonicalInstanceByFingerprint = new Map<string, string>()
      mapDefaultTreeCanonicals(
        (schema.default.children ?? []).map((slot) =>
          mergeInlineSlotOverrides(slot),
        ),
        defaultRef.children ?? [],
        canonicalInstanceByFingerprint,
      )

      // Variant forks template from the default tree's canonical instances. The
      // builder asserts those exist in the node map it writes to, so seed the
      // map with the existing canonical nodes. Seeded ids are written by the
      // default reset, not here, so they are skipped when committing new nodes.
      for (const canonicalId of canonicalInstanceByFingerprint.values()) {
        const existing = draft.nodes[canonicalId]
        if (existing) {
          seededIds.add(canonicalId)
          newNodes[canonicalId] = existing
        }
      }

      for (const catalogVariant of schema.variants ?? []) {
        appendComplexSchemaVariant(
          catalogId,
          defaultVariantRootId,
          catalogVariant,
          schema.default.children,
          registry,
          newNodes,
          {},
          canonicalInstanceByFingerprint,
          schemaVariantRefs,
        )
      }
    }

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
