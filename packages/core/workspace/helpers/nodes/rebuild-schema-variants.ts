/**
 * Shared building blocks for rebuilding catalog schema variants to their schema
 * definition. Both the whole-board reset and the single-variant reset use these
 * so a variant is rematerialized the same way from either entry point.
 */
import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId } from "../../../components/constants"
import { type SchemaChild, isComplexSchema } from "../../../components/types"
import { isComponentBoard } from "../../model/components"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import {
  type CatalogSchemaVariant,
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
 * Rebuilds the `fingerprint -> canonical instance id` map from a default tree.
 * The default tree is positionally aligned with `schema.default.children`, so the
 * same slot walk that add uses reproduces the fingerprints, mapped here to the
 * existing default-tree instance ids.
 */
export function mapDefaultTreeCanonicals(
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

/** Collects every component board's catalog id so instances can reference them. */
export function buildComponentRegistry(workspace: Workspace): NodeRegistry {
  const registry: NodeRegistry = new Set()
  for (const candidate of Object.values(workspace.boards)) {
    if (isComponentBoard(candidate)) {
      registry.add(candidate.catalogId as ComponentId)
    }
  }
  return registry
}

/**
 * Builds the canonical fingerprint map for a complex schema from its already
 * catalog-aligned default tree. Returns an empty map for primitive schemas.
 */
export function buildCanonicalInstanceMap(
  schema: ReturnType<typeof getComponentSchema>,
  defaultRef: ComponentTreeRef,
): Map<string, string> {
  const canonicalInstanceByFingerprint = new Map<string, string>()
  if (isComplexSchema(schema)) {
    mapDefaultTreeCanonicals(
      (schema.default.children ?? []).map((slot) =>
        mergeInlineSlotOverrides(slot),
      ),
      defaultRef.children ?? [],
      canonicalInstanceByFingerprint,
    )
  }
  return canonicalInstanceByFingerprint
}

/**
 * Seeds the new-node map with the existing canonical default-tree instances a
 * variant fork references. The builder asserts those exist in the node map it
 * writes to. Seeded ids belong to the default tree, so callers skip them when
 * committing new nodes.
 */
export function seedCanonicalNodes(
  nodes: Record<string, EntryNode>,
  canonicalInstanceByFingerprint: Map<string, string>,
): { newNodes: Record<string, EntryNode>; seededIds: Set<string> } {
  const newNodes: Record<string, EntryNode> = {}
  const seededIds = new Set<string>()
  for (const canonicalId of canonicalInstanceByFingerprint.values()) {
    const existing = nodes[canonicalId]
    if (existing) {
      seededIds.add(canonicalId)
      newNodes[canonicalId] = existing
    }
  }
  return { newNodes, seededIds }
}

/**
 * Rebuilds one catalog schema variant against the reset default tree's canonical
 * instances, writing its nodes into `newNodes` and returning its tree ref. Forks
 * the default tree for complex schemas; emits a single leaf for primitives.
 */
export function rebuildSchemaVariant(params: {
  catalogId: ComponentId
  defaultVariantRootId: string
  schema: ReturnType<typeof getComponentSchema>
  catalogVariant: CatalogSchemaVariant
  registry: NodeRegistry
  newNodes: Record<string, EntryNode>
  canonicalInstanceByFingerprint: Map<string, string>
}): ComponentTreeRef {
  const {
    catalogId,
    defaultVariantRootId,
    schema,
    catalogVariant,
    registry,
    newNodes,
    canonicalInstanceByFingerprint,
  } = params

  if (!isComplexSchema(schema)) {
    const { id, node } = makePrimitiveVariantNode(catalogId, schema, catalogVariant)
    newNodes[id] = node
    return { id }
  }

  const variantRefs: ComponentTreeRef[] = []
  appendComplexSchemaVariant(
    catalogId,
    defaultVariantRootId,
    catalogVariant,
    schema.default.children,
    registry,
    newNodes,
    {},
    canonicalInstanceByFingerprint,
    variantRefs,
  )
  return variantRefs[0]
}
