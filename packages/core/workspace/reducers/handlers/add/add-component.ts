/**
 * Ensures component catalog boards exist for a root component and its schema
 * descendants. Creates missing boards, default nodes, catalog schema variant
 * nodes, and instance trees, then normalizes board sort order.
 */
import { produce } from "immer"

import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import { isComplexSchema } from "../../../../components/types"
import { ExtractPayload, Workspace, invariant } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { setBoardOrder } from "../../../helpers/components/board-sort-order"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "../../../helpers/components/entry-node-ids"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import {
  type BuildContext,
  type InstantiateComponentOptions,
  appendComplexSchemaVariant,
  buildVariantTree,
  makeEntryNode,
  makePrimitiveVariantNode,
  requireCatalogVariant,
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
 * Materializes the default variant and every catalog schema variant for one
 * component into the draft. The board shell for `componentId` must already
 * exist on the draft so the builder can read it back as a composition source.
 * The default tree commits before the variant trees so a variant that shares a
 * default child can chain to it.
 */
function instantiateComponentInto(
  componentId: ComponentId,
  draft: Workspace,
  options: InstantiateComponentOptions = {},
): void {
  const schema = getComponentSchema(componentId)
  const defaultVariantRootId = componentBoardDefaultNodeId(componentId)
  const board = draft.boards[componentId]
  invariant(
    board && isComponentBoard(board),
    `Board shell for ${componentId} missing during instantiation`,
  )

  if (!isComplexSchema(schema)) {
    const nodes: Record<string, EntryNode> = {}
    nodes[defaultVariantRootId] = makeEntryNode({
      id: defaultVariantRootId,
      type: "default",
      level: schema.level as EntryNode["level"],
      label: schema.name,
      template: formatNodeCatalog(componentId),
      overrides: {},
    })
    const variantTreeRefs: ComponentTreeRef[] = [{ id: defaultVariantRootId }]

    const primitiveVariantIds =
      options.restrictedVariantIds ??
      (schema.variants ?? []).map((variant) => variant.id)
    for (const variantId of primitiveVariantIds) {
      const { id, node } = makePrimitiveVariantNode(
        componentId,
        schema,
        requireCatalogVariant(schema, componentId, variantId),
      )
      nodes[id] = node
      variantTreeRefs.push({ id })
    }

    draft.nodes = { ...draft.nodes, ...nodes }
    board.variants = variantTreeRefs
    return
  }

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

  const ctx: BuildContext = {
    workspace: draft,
    newNodes: {},
    variantFallbacks: options.variantFallbacks,
  }

  const defaultRef = buildVariantTree(
    componentId,
    defaultVariantRootId,
    {
      nodeType: "default",
      label: schema.name,
      template: formatNodeCatalog(componentId),
      overrides: {},
      children: defaultChildSlots,
    },
    ctx,
    undefined,
  )
  draft.nodes = { ...draft.nodes, ...ctx.newNodes }
  board.variants = [defaultRef]
  ctx.newNodes = {}

  for (const catalogVariant of catalogVariants) {
    appendComplexSchemaVariant(
      componentId,
      defaultVariantRootId,
      catalogVariant,
      defaultChildSlots,
      ctx,
      defaultRef,
      board.variants,
    )
    draft.nodes = { ...draft.nodes, ...ctx.newNodes }
    ctx.newNodes = {}
  }
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

  const ctx: BuildContext = {
    workspace: draft,
    newNodes: {},
    variantFallbacks: options.variantFallbacks,
  }
  const newRefs: ComponentTreeRef[] = []

  if (!isComplexSchema(schema)) {
    for (const variantId of missingVariantIds) {
      const { id, node } = makePrimitiveVariantNode(
        componentId,
        schema,
        requireCatalogVariant(schema, componentId, variantId),
      )
      ctx.newNodes[id] = node
      newRefs.push({ id })
    }
  } else {
    const defaultVariantRootId = componentBoardDefaultNodeId(componentId)
    // Restricted boards have empty default trees, so there are no canonical
    // default children to share. An existing full default tree lets reconciled
    // variants share its children the same way a full build would.
    const fallbackChildSlots = options.restrictedVariantIds?.length
      ? []
      : schema.default.children
    const defaultRef = board.variants.find(
      (ref) => ref.id === defaultVariantRootId,
    )
    for (const variantId of missingVariantIds) {
      appendComplexSchemaVariant(
        componentId,
        defaultVariantRootId,
        requireCatalogVariant(schema, componentId, variantId),
        fallbackChildSlots,
        ctx,
        defaultRef,
        newRefs,
      )
    }
  }

  draft.nodes = { ...draft.nodes, ...ctx.newNodes }
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

  let order = -1

  for (const componentId of components.reverse()) {
    if (draft.boards[componentId]) {
      reconcileComponentBoard(componentId, draft, {
        variantFallbacks,
        ...getInstantiationOptionsForComponent(componentId, instantiationPlans),
      })
    } else {
      const schema = getComponentSchema(componentId)

      const board: ComponentBoard = {
        type: "component",
        level: schema.level as ComponentBoard["level"],
        catalogId: componentId,
        label: workspaceMutationService.getInitialComponentLabel(componentId),
        author: "Seldon Digital",
        componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
        componentProperties: getInitialBoardComponentProperties("component"),
        variants: [],
      }
      setBoardOrder(board, order)
      draft.boards[componentId] = board

      instantiateComponentInto(componentId, draft, {
        variantFallbacks,
        ...getInstantiationOptionsForComponent(componentId, instantiationPlans),
      })

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
