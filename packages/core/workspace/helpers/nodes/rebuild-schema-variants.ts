/**
 * Shared building blocks for rebuilding catalog schema variants to their schema
 * definition. Both the whole-board reset and the single-variant reset use these
 * so a variant is rematerialized the same way from either entry point.
 */
import { getComponentSchema } from "../../../components/catalog"
import { type ComponentId } from "../../../components/constants"
import { isComplexSchema } from "../../../components/types"
import type { ComponentTreeRef, EntryNode, Workspace } from "../../types"
import {
  type BuildContext,
  type CatalogSchemaVariant,
  appendComplexSchemaVariant,
  makePrimitiveVariantNode,
} from "./build-component-variants"

/**
 * Rebuilds one catalog schema variant against the reset default tree, writing its
 * nodes into `newNodes` and returning its tree ref. Chains the variant's children
 * to the matching default-tree children for complex schemas; emits a single leaf
 * for primitives.
 */
export function rebuildSchemaVariant(params: {
  catalogId: ComponentId
  defaultVariantRootId: string
  schema: ReturnType<typeof getComponentSchema>
  catalogVariant: CatalogSchemaVariant
  workspace: Workspace
  newNodes: Record<string, EntryNode>
  defaultRef: ComponentTreeRef | undefined
}): ComponentTreeRef {
  const {
    catalogId,
    defaultVariantRootId,
    schema,
    catalogVariant,
    workspace,
    newNodes,
    defaultRef,
  } = params

  if (!isComplexSchema(schema)) {
    const { id, node } = makePrimitiveVariantNode(
      catalogId,
      schema,
      catalogVariant,
    )
    newNodes[id] = node
    return { id }
  }

  const ctx: BuildContext = { workspace, newNodes }
  const variantRefs: ComponentTreeRef[] = []
  appendComplexSchemaVariant(
    catalogId,
    defaultVariantRootId,
    catalogVariant,
    schema.default.children,
    ctx,
    defaultRef,
    variantRefs,
  )
  return variantRefs[0]
}
