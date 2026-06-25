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
 * Rebuilds one catalog schema variant against the reset default tree's canonical
 * instances, writing its nodes into `newNodes` and returning its tree ref. Forks
 * the default tree for complex schemas; emits a single leaf for primitives.
 */
export function rebuildSchemaVariant(params: {
  catalogId: ComponentId
  defaultVariantRootId: string
  schema: ReturnType<typeof getComponentSchema>
  catalogVariant: CatalogSchemaVariant
  workspace: Workspace
  newNodes: Record<string, EntryNode>
  canonicalMap: Map<string, string>
}): ComponentTreeRef {
  const {
    catalogId,
    defaultVariantRootId,
    schema,
    catalogVariant,
    workspace,
    newNodes,
    canonicalMap,
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
    canonicalMap,
    variantRefs,
  )
  return variantRefs[0]
}
