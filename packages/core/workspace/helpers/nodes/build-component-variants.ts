/**
 * Shared builders for component catalog variant trees. Both `addComponent` and
 * the catalog reset use these so a board's default and schema variant trees are
 * materialized the same way from either entry point.
 *
 * Composition rule: a composed child and every descendant it pulls in template
 * from the source board it comes from, not from a bare catalog default. Editing
 * a source board child therefore cascades into every board that composes it,
 * while a composing schema's own authored overrides still win locally because
 * they are stored as the node's own overrides on top of that source chain.
 */
import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { SchemaChild } from "../../../components/types"
import { Properties, invariant } from "../../../index"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { isComponentBoard } from "../../model/components"
import { formatNodeLink } from "../../model/template-ref"
import type {
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "../../types"
import { getVariantTree } from "../components/get-variant-tree"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
  componentBoardUniqueNodeId,
} from "../components/entry-node-ids"
import { getNodeCatalogId } from "./get-node-catalog-id"
import { resolveSchemaChild } from "./resolve-schema-child"
import {
  applyVariantFallbackToSlot,
  mergeInlineSlotOverrides,
} from "./schema-composition-children"
import { getSchemaSlotFingerprint } from "./schema-slot-fingerprint"

export type InstantiateComponentOptions = {
  restrictedVariantIds?: string[]
  variantFallbacks?: ReadonlySet<string>
}

export type CatalogSchemaVariant = NonNullable<
  ReturnType<typeof getComponentSchema>["variants"]
>[number]

/**
 * Shared state for one composition build. `workspace` is the draft the builder
 * reads already-built source boards from; `newNodes` collects the nodes this
 * build creates before the caller commits them.
 */
export type BuildContext = {
  workspace: Workspace
  newNodes: Record<string, EntryNode>
  variantFallbacks?: ReadonlySet<string>
}

/** Builds a workspace entry node, attaching editor metadata when requested. */
export function makeEntryNode(params: {
  id: string
  type: EntryNode["type"]
  level: EntryNode["level"]
  label: string
  template: string
  overrides: Properties
  origin?: EntryNode["origin"]
  withInitialOverrides?: boolean
}): EntryNode {
  const node: EntryNode = {
    id: params.id,
    type: params.type,
    level: params.level,
    label: params.label,
    theme: null,
    template: params.template,
    overrides: params.overrides as EntryNode["overrides"],
  }
  if (params.origin) {
    node.origin = params.origin
  }
  if (params.withInitialOverrides) {
    node.__editor = { initialOverrides: structuredClone(params.overrides) }
  }
  return node
}

/** Builds a primitive board's catalog variant node, a leaf carrying only overrides. */
export function makePrimitiveVariantNode(
  componentId: ComponentId,
  schema: ReturnType<typeof getComponentSchema>,
  catalogVariant: CatalogSchemaVariant,
): { id: string; node: EntryNode } {
  const id = componentBoardSchemaVariantNodeId(componentId, catalogVariant.id)
  const overrides = mergeProperties({}, catalogVariant.overrides ?? {})
  return {
    id,
    node: makeEntryNode({
      id,
      type: "variant",
      level: schema.level as EntryNode["level"],
      label: catalogVariant.label,
      template: formatNodeLink(componentBoardDefaultNodeId(componentId)),
      overrides,
      withInitialOverrides: true,
    }),
  }
}

/** Looks up a catalog variant by id and asserts it exists on the schema. */
export function requireCatalogVariant(
  schema: ReturnType<typeof getComponentSchema>,
  componentId: ComponentId,
  variantId: string,
): CatalogSchemaVariant {
  const catalogVariant = schema.variants?.find(
    (candidate) => candidate.id === variantId,
  )
  invariant(
    catalogVariant,
    `Schema child ${componentId} references missing variant "${variantId}"`,
  )
  return catalogVariant
}

/** Finds the tree ref rooted at `sourceRootId` across the draft's component boards. */
function getSourceTreeRef(
  workspace: Workspace,
  sourceRootId: string,
): ComponentTreeRef | null {
  for (const board of Object.values(workspace.boards)) {
    if (!isComponentBoard(board)) continue
    const tree = getVariantTree(board, sourceRootId as EntryNodeId)
    if (tree) return tree
  }
  return null
}

/** Catalog component id of a node, used to mint ids and match by component. */
function nodeComponentId(workspace: Workspace, nodeId: string): ComponentId {
  const node = workspace.nodes[nodeId]
  invariant(node, `Missing source node ${nodeId} during composition`)
  const catalogId = getNodeCatalogId(node, workspace)
  invariant(catalogId, `Could not resolve component id for node ${nodeId}`)
  return catalogId as ComponentId
}

/**
 * Finds the first unused ref of `componentId` among `refs` and marks it used, so
 * its node id can be reused or matched. Returns null when no match remains.
 */
function takeRefOfComponent(
  refs: ComponentTreeRef[] | undefined,
  used: Set<number>,
  workspace: Workspace,
  componentId: string,
): ComponentTreeRef | null {
  if (!refs) return null
  const matchIdx = refs.findIndex((ref, index) => {
    if (used.has(index)) return false
    const node = workspace.nodes[ref.id]
    return !!node && getNodeCatalogId(node, workspace) === componentId
  })
  if (matchIdx < 0) return null
  used.add(matchIdx)
  return refs[matchIdx]
}

/**
 * Clones the subtree rooted at `sourceRef` into fresh instance nodes, each
 * chaining to its source counterpart with empty overrides (pure inheritance).
 * When `existingRef` is given, its ids are reused so cross-board references to
 * those ids stay linked through a reset.
 */
function cloneSubtreeChainingToSource(
  sourceRef: ComponentTreeRef,
  ctx: BuildContext,
  existingRef?: ComponentTreeRef,
): ComponentTreeRef {
  const sourceNode = ctx.workspace.nodes[sourceRef.id]
  invariant(sourceNode, `Missing source node ${sourceRef.id} during clone`)

  const componentId = nodeComponentId(ctx.workspace, sourceRef.id)
  const id = existingRef?.id ?? componentBoardUniqueNodeId(componentId)

  ctx.newNodes[id] = makeEntryNode({
    id,
    type: "instance",
    level: sourceNode.level,
    label: sourceNode.label,
    template: formatNodeLink(sourceRef.id),
    overrides: {},
    origin: "schema",
    withInitialOverrides: true,
  })

  const used = new Set<number>()
  const children = (sourceRef.children ?? []).map((childSource) => {
    const childComponent = nodeComponentId(ctx.workspace, childSource.id)
    const reuse =
      takeRefOfComponent(
        existingRef?.children,
        used,
        ctx.workspace,
        childComponent,
      ) ?? undefined
    return cloneSubtreeChainingToSource(childSource, ctx, reuse)
  })

  return children.length ? { id, children } : { id }
}

/**
 * Builds an instance subtree for one merged composition slot. The node templates
 * from its own component or variant board root and stores the slot's merged
 * overrides, matching the catalog's effective values exactly. Authored inline
 * children recurse the same way. A slot with no inline children inherits its
 * membership by cloning the source board subtree, so inherited descendants chain
 * to that source rather than re-rooting to a bare catalog default.
 *
 * `mergedSlot` must already be merged through `mergeInlineSlotOverrides`.
 */
function buildComposedChild(
  mergedSlot: SchemaChild,
  ctx: BuildContext,
  existingRef?: ComponentTreeRef,
): ComponentTreeRef {
  const resolved = resolveSchemaChild(
    applyVariantFallbackToSlot(mergedSlot, ctx.variantFallbacks),
  )
  const id = existingRef?.id ?? componentBoardUniqueNodeId(resolved.schema.id)
  const overrides = mergeProperties({}, mergedSlot.overrides ?? {})

  ctx.newNodes[id] = makeEntryNode({
    id,
    type: "instance",
    level: resolved.schema.level as EntryNode["level"],
    label: resolved.label,
    template: formatNodeLink(resolved.templateNodeId),
    overrides,
    origin: "schema",
    withInitialOverrides: true,
  })

  let childRefs: ComponentTreeRef[]
  if (mergedSlot.children?.length) {
    const usedExisting = new Set<number>()
    childRefs = mergedSlot.children.map((child) => {
      const childComponent = resolveSchemaChild(
        applyVariantFallbackToSlot(child, ctx.variantFallbacks),
      ).componentId
      const existingChild =
        takeRefOfComponent(
          existingRef?.children,
          usedExisting,
          ctx.workspace,
          childComponent,
        ) ?? undefined
      return buildComposedChild(child, ctx, existingChild)
    })
  } else {
    const sourceRef = getSourceTreeRef(ctx.workspace, resolved.templateNodeId)
    invariant(
      sourceRef,
      `Composition source ${resolved.templateNodeId} not found while building ${resolved.componentId}`,
    )
    const usedExisting = new Set<number>()
    childRefs = (sourceRef.children ?? []).map((childSource) => {
      const childComponent = nodeComponentId(ctx.workspace, childSource.id)
      const existingChild =
        takeRefOfComponent(
          existingRef?.children,
          usedExisting,
          ctx.workspace,
          childComponent,
        ) ?? undefined
      return cloneSubtreeChainingToSource(childSource, ctx, existingChild)
    })
  }

  return childRefs.length ? { id, children: childRefs } : { id }
}

/**
 * Maps each top-level default-tree child to the slot fingerprint that produced
 * it. A variant slot whose fingerprint matches shares that default child by
 * chaining to it, so default-tree edits cascade into the variant tree.
 */
export function mapTopLevelCanonicals(
  defaultChildSlots: SchemaChild[] | undefined,
  defaultRef: ComponentTreeRef,
  variantFallbacks?: ReadonlySet<string>,
): Map<string, string> {
  const map = new Map<string, string>()
  const children = defaultRef.children ?? []
  ;(defaultChildSlots ?? []).forEach((rawSlot, index) => {
    const child = children[index]
    if (!child) return
    const mergedSlot = mergeInlineSlotOverrides(rawSlot, variantFallbacks)
    map.set(getSchemaSlotFingerprint(mergedSlot, { variantFallbacks }), child.id)
  })
  return map
}

/**
 * Builds one variant root node and its child tree. Top-level child slots that
 * match a canonical default child are cloned from it; the rest are composed from
 * their own component boards. The default tree passes an empty `canonicalMap`.
 */
export function buildVariantTree(
  componentId: ComponentId,
  variantRootId: string,
  treeOptions: {
    nodeType: "default" | "variant"
    label: string
    template: string
    overrides: Properties
    children: SchemaChild[] | undefined
  },
  ctx: BuildContext,
  canonicalMap: Map<string, string>,
  existingRef?: ComponentTreeRef,
): ComponentTreeRef {
  ctx.newNodes[variantRootId] = makeEntryNode({
    id: variantRootId,
    type: treeOptions.nodeType,
    level: getComponentSchema(componentId).level as EntryNode["level"],
    label: treeOptions.label,
    template: treeOptions.template,
    overrides: treeOptions.overrides,
    withInitialOverrides: true,
  })

  const usedExisting = new Set<number>()
  const childRefs: ComponentTreeRef[] = []
  for (const rawSlot of treeOptions.children ?? []) {
    const mergedSlot = mergeInlineSlotOverrides(rawSlot, ctx.variantFallbacks)
    const resolved = resolveSchemaChild(
      applyVariantFallbackToSlot(mergedSlot, ctx.variantFallbacks),
    )
    const existingChild =
      takeRefOfComponent(
        existingRef?.children,
        usedExisting,
        ctx.workspace,
        resolved.componentId,
      ) ?? undefined

    const fingerprint = getSchemaSlotFingerprint(mergedSlot, {
      variantFallbacks: ctx.variantFallbacks,
    })
    const canonicalId = canonicalMap.get(fingerprint)
    if (canonicalId) {
      const canonicalRef = getSourceTreeRef(ctx.workspace, canonicalId)
      invariant(
        canonicalRef,
        `Canonical default child ${canonicalId} not found for ${componentId}`,
      )
      childRefs.push(
        cloneSubtreeChainingToSource(canonicalRef, ctx, existingChild),
      )
      continue
    }

    childRefs.push(buildComposedChild(mergedSlot, ctx, existingChild))
  }

  return childRefs.length
    ? { id: variantRootId, children: childRefs }
    : { id: variantRootId }
}

/**
 * Rebuilds the default variant's child tree from `slots`. Reuses an existing
 * child node id when a child of the same component sits at the same position so
 * canonical ids that schema variants and instances reference stay stable, while
 * still chaining composed descendants to their source boards.
 */
export function rebuildDefaultChildren(
  slots: SchemaChild[],
  existingRefs: ComponentTreeRef[] | undefined,
  ctx: BuildContext,
): ComponentTreeRef[] {
  const usedExisting = new Set<number>()
  return slots.map((rawSlot) => {
    const mergedSlot = mergeInlineSlotOverrides(rawSlot, ctx.variantFallbacks)
    const resolved = resolveSchemaChild(
      applyVariantFallbackToSlot(mergedSlot, ctx.variantFallbacks),
    )
    const existingChild =
      takeRefOfComponent(
        existingRefs,
        usedExisting,
        ctx.workspace,
        resolved.componentId,
      ) ?? undefined
    return buildComposedChild(mergedSlot, ctx, existingChild)
  })
}

/**
 * Builds one catalog schema variant and appends its tree ref. The variant uses
 * its own child slots when present, otherwise `fallbackChildSlots`.
 */
export function appendComplexSchemaVariant(
  componentId: ComponentId,
  defaultVariantRootId: string,
  catalogVariant: CatalogSchemaVariant,
  fallbackChildSlots: SchemaChild[] | undefined,
  ctx: BuildContext,
  canonicalMap: Map<string, string>,
  variantTreeRefs: ComponentTreeRef[],
): void {
  const variantRootId = componentBoardSchemaVariantNodeId(
    componentId,
    catalogVariant.id,
  )
  const variantChildSlots = catalogVariant.children?.length
    ? catalogVariant.children
    : fallbackChildSlots
  const variantRef = buildVariantTree(
    componentId,
    variantRootId,
    {
      nodeType: "variant",
      label: catalogVariant.label,
      template: formatNodeLink(defaultVariantRootId),
      overrides: mergeProperties({}, catalogVariant.overrides ?? {}),
      children: variantChildSlots,
    },
    ctx,
    canonicalMap,
  )
  variantTreeRefs.push(variantRef)
}
