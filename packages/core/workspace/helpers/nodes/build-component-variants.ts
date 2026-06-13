/**
 * Shared builders for component catalog variant trees. Both `addComponent` and
 * the catalog reset use these so a board's default and schema variant trees are
 * materialized the same way from either entry point.
 */
import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { SchemaChild } from "../../../components/types"
import { Properties, invariant } from "../../../index"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { formatNodeLink } from "../../model/template-ref"
import type { ComponentTreeRef, EntryNode } from "../../types"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
  componentBoardUniqueNodeId,
} from "../components/entry-node-ids"
import { resolveSchemaChild } from "./resolve-schema-child"
import {
  applyVariantFallbackToSlot,
  mergeInlineSlotOverrides,
} from "./schema-composition-children"
import { getSchemaSlotFingerprint } from "./schema-slot-fingerprint"

/** Tracks which component boards already exist so instances can reference them. */
export type NodeRegistry = Set<ComponentId>

export type NodeRegister = {
  id: string
  component: ComponentId
  children?: NodeRegister[]
}

export type InstantiateComponentOptions = {
  restrictedVariantIds?: string[]
  variantFallbacks?: ReadonlySet<string>
}

export type CatalogSchemaVariant = NonNullable<
  ReturnType<typeof getComponentSchema>["variants"]
>[number]

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

/** Builds the nested variant tree ref for a register subtree. */
export function variantTreeRefFromRegister(
  reg: NodeRegister,
): ComponentTreeRef {
  if (!reg.children?.length) return { id: reg.id }
  return {
    id: reg.id,
    children: reg.children.map(variantTreeRefFromRegister),
  }
}

/**
 * Instantiates schema children under a variant register and recurses into
 * nested schema children.
 */
export function instantiateSchemaChildrenFromSlots(
  componentId: ComponentId,
  register: NodeRegister,
  slots: SchemaChild[],
  registry: NodeRegistry,
  newInstancesById: Record<string, EntryNode>,
  options: InstantiateComponentOptions,
  canonicalInstanceByFingerprint: Map<string, string>,
  writeCanonical: boolean,
): void {
  register.children = []

  function instantiateFromSlot(
    registerToWriteTo: NodeRegister,
    slot: SchemaChild,
  ): void {
    const resolvedSlot = applyVariantFallbackToSlot(
      slot,
      options.variantFallbacks,
    )
    const resolvedChild = resolveSchemaChild(resolvedSlot)

    invariant(
      registry.has(resolvedChild.componentId),
      `Register for ${resolvedChild.componentId} not found`,
    )
    const childSchema = resolvedChild.schema
    const fingerprint = getSchemaSlotFingerprint(resolvedSlot, {
      variantFallbacks: options.variantFallbacks,
    })
    const canonicalId = !writeCanonical
      ? canonicalInstanceByFingerprint.get(fingerprint)
      : undefined
    const id = componentBoardUniqueNodeId(childSchema.id)

    if (canonicalId) {
      invariant(
        newInstancesById[canonicalId],
        `Missing canonical instance ${canonicalId} for fingerprint on ${componentId}`,
      )
      // Fork the matching default-tree slot into a linked copy: properties set
      // on the canonical instance flow down through the template chain, while
      // this copy's own overrides win for its variant tree only.
      newInstancesById[id] = makeEntryNode({
        id,
        type: "instance",
        level: childSchema.level as EntryNode["level"],
        label: resolvedChild.label,
        template: formatNodeLink(canonicalId),
        overrides: {},
        origin: "schema",
        withInitialOverrides: true,
      })
    } else {
      const processedOverrides = mergeProperties(
        {},
        resolvedSlot.overrides ?? {},
      )

      if (writeCanonical) {
        canonicalInstanceByFingerprint.set(fingerprint, id)
      }

      newInstancesById[id] = makeEntryNode({
        id,
        type: "instance",
        level: childSchema.level as EntryNode["level"],
        label: resolvedChild.label,
        template: formatNodeLink(resolvedChild.templateNodeId),
        overrides: processedOverrides,
        origin: "schema",
        withInitialOverrides: true,
      })
    }

    const newChild: NodeRegister = {
      id,
      component: childSchema.id,
      children: [],
    }
    if (!registerToWriteTo.children) registerToWriteTo.children = []
    registerToWriteTo.children.push(newChild)

    // Effective slots arrive pre-merged; only the raw schema fallback slots
    // taken for a childless slot still need their own merge pass.
    const childSlots: SchemaChild[] = resolvedSlot.children?.length
      ? resolvedSlot.children
      : resolvedChild.fallbackChildren.map((fallbackSlot) =>
          mergeInlineSlotOverrides(fallbackSlot, options.variantFallbacks),
        )

    childSlots.forEach((childSlot) => instantiateFromSlot(newChild, childSlot))
  }

  slots.forEach((slot) =>
    instantiateFromSlot(
      register,
      mergeInlineSlotOverrides(slot, options.variantFallbacks),
    ),
  )
}

export function instantiateVariantTree(
  componentId: ComponentId,
  variantRootId: string,
  treeOptions: {
    nodeType: "default" | "variant"
    label: string
    template: string
    overrides: Properties
    children: SchemaChild[] | undefined
  },
  registry: NodeRegistry,
  newInstancesById: Record<string, EntryNode>,
  options: InstantiateComponentOptions,
  canonicalInstanceByFingerprint: Map<string, string>,
  writeCanonical: boolean,
): NodeRegister {
  const register: NodeRegister = {
    id: variantRootId,
    component: componentId,
  }

  if (treeOptions.children?.length) {
    for (const slot of treeOptions.children) {
      const resolvedSlot = applyVariantFallbackToSlot(
        slot,
        options.variantFallbacks,
      )
      registry.add(resolvedSlot.component)
    }
    instantiateSchemaChildrenFromSlots(
      componentId,
      register,
      treeOptions.children,
      registry,
      newInstancesById,
      options,
      canonicalInstanceByFingerprint,
      writeCanonical,
    )
  }

  newInstancesById[variantRootId] = makeEntryNode({
    id: variantRootId,
    type: treeOptions.nodeType,
    level: getComponentSchema(componentId).level as EntryNode["level"],
    label: treeOptions.label,
    template: treeOptions.template,
    overrides: treeOptions.overrides,
    withInitialOverrides: true,
  })

  return register
}

/**
 * Builds one catalog schema variant register and appends its tree ref. The
 * variant uses its own child slots when present, otherwise `fallbackChildSlots`.
 */
export function appendComplexSchemaVariant(
  componentId: ComponentId,
  defaultVariantRootId: string,
  catalogVariant: CatalogSchemaVariant,
  fallbackChildSlots: SchemaChild[] | undefined,
  registry: NodeRegistry,
  newInstancesById: Record<string, EntryNode>,
  options: InstantiateComponentOptions,
  canonicalInstanceByFingerprint: Map<string, string>,
  variantTreeRefs: ComponentTreeRef[],
): void {
  const variantRootId = componentBoardSchemaVariantNodeId(
    componentId,
    catalogVariant.id,
  )
  const variantChildSlots = catalogVariant.children?.length
    ? catalogVariant.children
    : fallbackChildSlots
  const variantRegister = instantiateVariantTree(
    componentId,
    variantRootId,
    {
      nodeType: "variant",
      label: catalogVariant.label,
      template: formatNodeLink(defaultVariantRootId),
      overrides: mergeProperties({}, catalogVariant.overrides ?? {}),
      children: variantChildSlots,
    },
    registry,
    newInstancesById,
    options,
    canonicalInstanceByFingerprint,
    false,
  )
  variantTreeRefs.push(variantTreeRefFromRegister(variantRegister))
}
