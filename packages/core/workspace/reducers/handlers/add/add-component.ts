/**
 * Ensures component catalog boards exist for a root component and its schema
 * descendants. Creates missing boards, default nodes, catalog schema variant
 * nodes, and instance trees, then normalizes board sort order.
 */
import { produce } from "immer"

import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import { isComplexSchema } from "../../../../components/types"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { setBoardOrder } from "../../../helpers/components/board-sort-order"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "../../../helpers/components/entry-node-ids"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import {
  type InstantiateComponentOptions,
  type NodeRegistry,
  appendComplexSchemaVariant,
  instantiateVariantTree,
  makeEntryNode,
  makePrimitiveVariantNode,
  requireCatalogVariant,
  variantTreeRefFromRegister,
} from "../../../helpers/nodes/build-component-variants"
import { getInstantiationOptionsForComponent } from "../../../helpers/nodes/collect-component-instantiation-plans"
import { buildComponentAddPlan } from "../../../helpers/nodes/component-add-plan"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { isComponentBoard } from "../../../model/components"
import { formatNodeCatalog } from "../../../model/template-ref"
import { boardOrderService, workspaceMutationService } from "../../../services"
import type {
  ComponentBoard,
  ComponentTreeRef,
  EntryNode,
} from "../../../types"

function toVariantFallbackSet(
  variantFallbacks: string[] | undefined,
): ReadonlySet<string> | undefined {
  if (!variantFallbacks?.length) {
    return undefined
  }
  return new Set(variantFallbacks)
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
  // these instances reference. The default tree is always built in full so the
  // board's default variant is never empty. A restricted build keeps only the
  // named catalog variants on top; a full build keeps every catalog variant,
  // with an empty variant falling back to the default children.
  const restrictedVariantIds = options.restrictedVariantIds
  const isRestricted = !!restrictedVariantIds?.length
  const defaultChildSlots = schema.default.children
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
    // instances to link to. A fresh empty map mirrors the original restricted build.
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
 * Ensures the board for `rootId` and every descendant board its catalog
 * requires exists on the draft, creating missing boards and topping up existing
 * ones, then realigns board order. Unlike `addComponent`, it does not bail when
 * the root board already exists, so reset flows can backfill descendant boards a
 * prior restricted build skipped.
 */
export function ensureComponentBoards(
  draft: Workspace,
  rootId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): void {
  const { orderedComponentIds: components, plans: instantiationPlans } =
    buildComponentAddPlan(rootId, variantFallbacks)
  const registry: NodeRegistry = new Set()

  let order = -1

  for (const componentId of components.reverse()) {
    if (draft.boards[componentId]) {
      registry.add(componentId)
      reconcileComponentBoard(componentId, draft, registry, {
        variantFallbacks,
        ...getInstantiationOptionsForComponent(componentId, instantiationPlans),
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

  const updatedWorkspace = boardOrderService.realignBoardOrder(draft)
  Object.assign(draft.boards, updatedWorkspace.boards)
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

    ensureComponentBoards(
      draft,
      payload.boardKey as ComponentId,
      toVariantFallbackSet(payload.variantFallbacks),
    )
  })
}
