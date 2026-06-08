/**
 * Ensures component catalog boards exist for a root component and its schema
 * descendants. Creates missing boards, default nodes, catalog schema variant
 * nodes, and instance trees, then normalizes board sort order.
 */
import { produce } from "immer"

import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import { SchemaChild, isComplexSchema } from "../../../../components/types"
import {
  ExtractPayload,
  Properties,
  Workspace,
  invariant,
} from "../../../../index"
import { mergeProperties } from "../../../../properties/helpers/merge-properties"
import { rules } from "../../../../rules/config/rules.config"
import { setBoardOrder } from "../../../helpers/components/board-sort-order"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
  componentBoardUniqueNodeId,
} from "../../../helpers/components/entry-node-ids"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { isComponentBoard } from "../../../model/components"
import { getInstantiationOptionsForComponent } from "../../../helpers/nodes/collect-component-instantiation-plans"
import { buildComponentAddPlan } from "../../../helpers/nodes/component-add-plan"
import { resolveSchemaChild } from "../../../helpers/nodes/resolve-schema-child"
import { applyVariantFallbackToSlot } from "../../../helpers/nodes/schema-composition-children"
import { getSchemaSlotFingerprint } from "../../../helpers/nodes/schema-slot-fingerprint"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatNodeCatalog, formatNodeLink } from "../../../model/template-ref"
import {
  workspaceMutationService,
  boardOrderService,
} from "../../../services"
import type {
  ComponentBoard,
  ComponentTreeRef,
  EntryNode,
} from "../../../types"

/** Tracks which component boards already exist so instances can reference them. */
type NodeRegistry = Set<ComponentId>

type NodeRegister = {
  id: string
  component: ComponentId
  children?: NodeRegister[]
}

type InstantiateComponentOptions = {
  restrictedVariantIds?: string[]
  variantFallbacks?: ReadonlySet<string>
}

type CatalogSchemaVariant = NonNullable<
  ReturnType<typeof getComponentSchema>["variants"]
>[number]

function toVariantFallbackSet(
  variantFallbacks: string[] | undefined,
): ReadonlySet<string> | undefined {
  if (!variantFallbacks?.length) {
    return undefined
  }
  return new Set(variantFallbacks)
}

/** Builds a workspace entry node, attaching editor metadata when requested. */
function makeEntryNode(params: {
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
function makePrimitiveVariantNode(
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
function requireCatalogVariant(
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
function variantTreeRefFromRegister(reg: NodeRegister): ComponentTreeRef {
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
function instantiateSchemaChildrenFromSlots(
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
    const reused =
      !writeCanonical && canonicalInstanceByFingerprint.has(fingerprint)
    const id = reused
      ? canonicalInstanceByFingerprint.get(fingerprint)!
      : componentBoardUniqueNodeId(childSchema.id)

    if (!reused) {
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
    } else {
      invariant(
        newInstancesById[id],
        `Missing canonical instance ${id} for fingerprint on ${componentId}`,
      )
    }

    const newChild: NodeRegister = {
      id,
      component: childSchema.id,
      children: [],
    }
    if (!registerToWriteTo.children) registerToWriteTo.children = []
    registerToWriteTo.children.push(newChild)

    const childSlots: SchemaChild[] = resolvedSlot.children?.length
      ? resolvedSlot.children
      : resolvedChild.fallbackChildren

    childSlots.forEach((childSlot) => instantiateFromSlot(newChild, childSlot))
  }

  slots.forEach((slot) => instantiateFromSlot(register, slot))
}

function instantiateVariantTree(
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
function appendComplexSchemaVariant(
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

/**
 * Creates the default variant and every catalog schema variant for one
 * component, recursively ensuring registers exist for schema child components.
 */
function instantiateComponent(
  componentId: ComponentId,
  registry: NodeRegistry,
  options: InstantiateComponentOptions = {},
): {
  nodesById: Record<string, EntryNode>
  variantTreeRefs: ComponentTreeRef[]
} {
  const schema = getComponentSchema(componentId)
  const defaultVariantRootId = componentBoardDefaultNodeId(componentId)
  const newInstancesById: Record<string, EntryNode> = {}

  registry.add(componentId)

  if (!isComplexSchema(schema)) {
    const variantTreeRefs: ComponentTreeRef[] = []

    newInstancesById[defaultVariantRootId] = makeEntryNode({
      id: defaultVariantRootId,
      type: "default",
      level: schema.level as EntryNode["level"],
      label: schema.name,
      template: formatNodeCatalog(componentId),
      overrides: {},
    })
    variantTreeRefs.push({ id: defaultVariantRootId })

    const primitiveVariantIds =
      options.restrictedVariantIds ??
      (schema.variants ?? []).map((variant) => variant.id)

    for (const variantId of primitiveVariantIds) {
      const catalogVariant = requireCatalogVariant(
        schema,
        componentId,
        variantId,
      )
      const { id, node } = makePrimitiveVariantNode(
        componentId,
        schema,
        catalogVariant,
      )
      newInstancesById[id] = node
      variantTreeRefs.push({ id })
    }

    return {
      nodesById: newInstancesById,
      variantTreeRefs,
    }
  }

  const canonicalInstanceByFingerprint = new Map<string, string>()

  // Which child slots each tree materializes must stay in sync with
  // `materializedChildSlots` in component-add-plan.ts, which plans the boards
  // these instances reference. A restricted build keeps only the named catalog
  // variants and gives the default tree no children. A full build keeps the
  // default tree plus every catalog variant, with an empty variant falling back
  // to the default children.
  const restrictedVariantIds = options.restrictedVariantIds
  const isRestricted = !!restrictedVariantIds?.length
  const defaultChildSlots = isRestricted ? [] : schema.default.children
  const catalogVariants = isRestricted
    ? restrictedVariantIds!.map((variantId) =>
        requireCatalogVariant(schema, componentId, variantId),
      )
    : (schema.variants ?? [])

  const variantTreeRefs: ComponentTreeRef[] = []
  const defaultRegister = instantiateVariantTree(
    componentId,
    defaultVariantRootId,
    {
      nodeType: "default",
      label: schema.name,
      template: formatNodeCatalog(componentId),
      overrides: {},
      children: defaultChildSlots,
    },
    registry,
    newInstancesById,
    options,
    canonicalInstanceByFingerprint,
    true,
  )
  variantTreeRefs.push(variantTreeRefFromRegister(defaultRegister))

  for (const catalogVariant of catalogVariants) {
    appendComplexSchemaVariant(
      componentId,
      defaultVariantRootId,
      catalogVariant,
      defaultChildSlots,
      registry,
      newInstancesById,
      options,
      canonicalInstanceByFingerprint,
      variantTreeRefs,
    )
  }

  return { nodesById: newInstancesById, variantTreeRefs }
}

/**
 * Tops up an already-existing board with the catalog variants this add requires
 * but that the board never materialized, because it was first created under a
 * restricted plan. Without this, instances created by the add would reference
 * variant nodes that do not exist.
 */
function reconcileComponentBoard(
  componentId: ComponentId,
  draft: Workspace,
  registry: NodeRegistry,
  options: InstantiateComponentOptions,
): void {
  const board = draft.boards[componentId]
  if (!board || !isComponentBoard(board)) {
    return
  }

  const schema = getComponentSchema(componentId)
  const requiredVariantIds =
    options.restrictedVariantIds ??
    (schema.variants ?? []).map((variant) => variant.id)

  const existingNodeIds = new Set(board.variants.map((ref) => ref.id))
  const missingVariantIds = requiredVariantIds.filter(
    (variantId) =>
      !existingNodeIds.has(
        componentBoardSchemaVariantNodeId(componentId, variantId),
      ),
  )
  if (!missingVariantIds.length) {
    return
  }

  const newNodes: Record<string, EntryNode> = {}
  const newRefs: ComponentTreeRef[] = []

  if (!isComplexSchema(schema)) {
    for (const variantId of missingVariantIds) {
      const catalogVariant = requireCatalogVariant(
        schema,
        componentId,
        variantId,
      )
      const { id, node } = makePrimitiveVariantNode(
        componentId,
        schema,
        catalogVariant,
      )
      newNodes[id] = node
      newRefs.push({ id })
    }
  } else {
    const defaultVariantRootId = componentBoardDefaultNodeId(componentId)
    // Restricted boards have empty default trees, so there are no canonical
    // instances to share. A fresh empty map mirrors the original restricted build.
    const fallbackChildSlots = options.restrictedVariantIds?.length
      ? []
      : schema.default.children
    const canonicalInstanceByFingerprint = new Map<string, string>()
    for (const variantId of missingVariantIds) {
      appendComplexSchemaVariant(
        componentId,
        defaultVariantRootId,
        requireCatalogVariant(schema, componentId, variantId),
        fallbackChildSlots,
        registry,
        newNodes,
        options,
        canonicalInstanceByFingerprint,
        newRefs,
      )
    }
  }

  draft.nodes = { ...draft.nodes, ...newNodes }
  board.variants = [...board.variants, ...newRefs]
}

/**
 * Adds the component board for `componentId` when missing, including any
 * descendant component boards required by the catalog, then realigns board
 * order across the workspace.
 */
export function addComponent(
  payload: ExtractPayload<"add_component">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    if (draft.boards[payload.boardKey]) {
      return
    }

    const rootId = payload.boardKey as ComponentId
    const variantFallbacks = toVariantFallbackSet(payload.variantFallbacks)
    const { orderedComponentIds: components, plans: instantiationPlans } =
      buildComponentAddPlan(rootId, variantFallbacks)
    const registry: NodeRegistry = new Set()

    let order = -1

    for (const componentId of components.reverse()) {
      if (draft.boards[componentId]) {
        registry.add(componentId)
        reconcileComponentBoard(componentId, draft, registry, {
          variantFallbacks,
          ...getInstantiationOptionsForComponent(
            componentId,
            instantiationPlans,
          ),
        })
      } else {
        const { nodesById, variantTreeRefs } = instantiateComponent(
          componentId,
          registry,
          {
            variantFallbacks,
            ...getInstantiationOptionsForComponent(
              componentId,
              instantiationPlans,
            ),
          },
        )

        draft.nodes = { ...draft.nodes, ...nodesById }

        const schema = getComponentSchema(componentId)

        const board: ComponentBoard = {
          type: "component",
          level: schema.level as ComponentBoard["level"],
          catalogId: componentId,
          label: workspaceMutationService.getInitialComponentLabel(componentId),
          author: "Seldon Digital",
          componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
          componentProperties: getInitialBoardComponentProperties("component"),
          variants: variantTreeRefs,
        }
        setBoardOrder(board, order)
        draft.boards[componentId] = board

        order--
      }
    }

    const updatedWorkspace =
      boardOrderService.realignBoardOrder(draft)
    Object.assign(draft.boards, updatedWorkspace.boards)
  })
}
