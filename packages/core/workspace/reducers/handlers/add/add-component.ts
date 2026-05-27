/**
 * Ensures component catalog boards exist for a root component and its schema
 * descendants. Creates missing boards, default nodes, catalog schema variant
 * nodes, and instance trees, then normalizes board sort order.
 */
import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId, isComponentId } from "../../../../components/constants"
import { SchemaChild, isComplexSchema } from "../../../../components/types"
import { mergeProperties } from "../../../../properties/helpers/merge-properties"
import { ExtractPayload, Properties, Workspace, invariant } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { setComponentOrder } from "../../../helpers/components/component-sort-order"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
  componentBoardUniqueNodeId,
} from "../../../helpers/components/entry-node-ids"
import { getWorkspaceNodes } from "../../../helpers/general/get-workspace-nodes"
import { getNodeCatalogId } from "../../../helpers/nodes/get-node-catalog-id"
import {
  collectComponentInstantiationPlans,
  getInstantiationOptionsForComponent,
} from "../../../helpers/nodes/collect-component-instantiation-plans"
import { getComponentDescendantIds } from "../../../helpers/nodes/get-descendant-ids"
import { resolveSchemaChild } from "../../../helpers/nodes/resolve-schema-child"
import { applyVariantFallbackToSlot } from "../../../helpers/nodes/schema-composition-children"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatNodeCatalog, formatNodeLink } from "../../../model/template-ref"
import type { ValidationOptions } from "../../helpers/validation"
import type { ComponentBoard, ComponentTreeRef, EntryNode } from "../../../types"
import {
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

type NodeRegistry = Partial<Record<ComponentId, NodeRegister>>

type NodeRegister = {
  id: string
  component: ComponentId
  children?: NodeRegister[]
}

type InstantiateComponentOptions = {
  embeddedVariantId?: string
  restrictedCatalogVariantIds?: string[]
  variantFallbacks?: ReadonlySet<string>
}

function toVariantFallbackSet(
  variantFallbacks: string[] | undefined,
): ReadonlySet<string> | undefined {
  if (!variantFallbacks?.length) {
    return undefined
  }
  return new Set(variantFallbacks)
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
 * Rebuilds the in-memory register tree from an existing component board so new
 * sibling boards can attach instances to the same variant ids.
 */
function nodeRegisterFromComponentBoard(
  componentId: ComponentId,
  workspace: Workspace,
): NodeRegister {
  const board = workspace.components[componentId]
  invariant(
    board && board.type === "component",
    `Missing component board for ${componentId}`,
  )
  const nodes = getWorkspaceNodes(workspace)
  const rootRef = board.variants[0]
  invariant(rootRef, `Missing root variant on board ${componentId}`)

  function walkRef(ref: ComponentTreeRef): NodeRegister {
    const node = nodes[ref.id]
    invariant(node, `Missing node ${ref.id}`)
    const catalogId = getNodeCatalogId(node, workspace)
    invariant(
      catalogId && isComponentId(catalogId),
      `Expected catalog template on ${ref.id}`,
    )
    const reg: NodeRegister = {
      id: ref.id,
      component: catalogId,
    }
    if (ref.children?.length) {
      reg.children = ref.children.map(walkRef)
    }
    return reg
  }

  return walkRef(rootRef)
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
): void {
  register.children = []

  function instantiateFromSlot(
    registerToWriteTo: NodeRegister,
    slot: SchemaChild,
  ): void {
    const resolvedSlot = applyVariantFallbackToSlot(slot, options.variantFallbacks)
    const resolvedChild = resolveSchemaChild(resolvedSlot)

    invariant(
      registry[resolvedChild.componentId],
      `Register for ${resolvedChild.componentId} not found`,
    )
    const childSchema = resolvedChild.schema
    const id = componentBoardUniqueNodeId(childSchema.id)
    const processedOverrides = mergeProperties({}, resolvedSlot.overrides ?? {})

    newInstancesById[id] = {
      id,
      type: "instance",
      level: childSchema.level as EntryNode["level"],
      label: resolvedChild.label,
      theme: null,
      template: formatNodeLink(resolvedChild.templateNodeId),
      overrides: processedOverrides as EntryNode["overrides"],
      __editor: { initialOverrides: structuredClone(processedOverrides) },
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

    childSlots.forEach((childSlot) =>
      instantiateFromSlot(newChild, childSlot),
    )
  }

  slots.forEach((slot) =>
    instantiateFromSlot(register, applyVariantFallbackToSlot(slot, options.variantFallbacks)),
  )
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
): NodeRegister {
  const register: NodeRegister = {
    id: variantRootId,
    component: componentId,
  }

  if (treeOptions.children?.length) {
    for (const slot of treeOptions.children) {
      const resolvedSlot = applyVariantFallbackToSlot(slot, options.variantFallbacks)
      if (!registry[resolvedSlot.component]) {
        registry[resolvedSlot.component] = {
          id: componentBoardDefaultNodeId(resolvedSlot.component),
          component: resolvedSlot.component,
        }
      }
    }
    instantiateSchemaChildrenFromSlots(
      componentId,
      register,
      treeOptions.children,
      registry,
      newInstancesById,
      options,
    )
  }

  newInstancesById[variantRootId] = {
    id: variantRootId,
    type: treeOptions.nodeType,
    level: getComponentSchema(componentId).level as EntryNode["level"],
    label: treeOptions.label,
    theme: null,
    template: treeOptions.template,
    overrides: treeOptions.overrides as EntryNode["overrides"],
    __editor: { initialOverrides: structuredClone(treeOptions.overrides) },
  }

  return register
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

  registry[componentId] = {
    id: defaultVariantRootId,
    component: componentId,
  }

  if (!isComplexSchema(schema)) {
    newInstancesById[defaultVariantRootId] = {
      id: defaultVariantRootId,
      type: "default",
      level: schema.level as EntryNode["level"],
      label: schema.name,
      theme: null,
      template: formatNodeCatalog(componentId),
      overrides: {},
    }
    return {
      nodesById: newInstancesById,
      variantTreeRefs: [{ id: defaultVariantRootId }],
    }
  }

  const restrictedVariantIds =
    options.restrictedCatalogVariantIds ??
    (options.embeddedVariantId ? [options.embeddedVariantId] : undefined)

  if (restrictedVariantIds?.length) {
    const variantTreeRefs: ComponentTreeRef[] = []
    const defaultRegister = instantiateVariantTree(
      componentId,
      defaultVariantRootId,
      {
        nodeType: "default",
        label: schema.name,
        template: formatNodeCatalog(componentId),
        overrides: {},
        children: [],
      },
      registry,
      newInstancesById,
      options,
    )
    variantTreeRefs.push(variantTreeRefFromRegister(defaultRegister))

    for (const variantId of restrictedVariantIds) {
      const catalogVariant = schema.variants?.find(
        (candidate) => candidate.id === variantId,
      )
      invariant(
        catalogVariant,
        `Schema child ${componentId} references missing variant "${variantId}"`,
      )

      const variantRootId = componentBoardSchemaVariantNodeId(
        componentId,
        variantId,
      )
      const variantChildSlots = catalogVariant.children?.length
        ? catalogVariant.children
        : []
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
      )
      variantTreeRefs.push(variantTreeRefFromRegister(variantRegister))
    }

    return { nodesById: newInstancesById, variantTreeRefs }
  }

  const variantTreeRefs: ComponentTreeRef[] = []
  const defaultRegister = instantiateVariantTree(
    componentId,
    defaultVariantRootId,
    {
      nodeType: "default",
      label: schema.name,
      template: formatNodeCatalog(componentId),
      overrides: {},
      children: schema.default.children,
    },
    registry,
    newInstancesById,
    options,
  )
  variantTreeRefs.push(variantTreeRefFromRegister(defaultRegister))

  const defaultChildSlots = schema.default.children

  for (const catalogVariant of schema.variants ?? []) {
    const variantRootId = componentBoardSchemaVariantNodeId(
      componentId,
      catalogVariant.id,
    )
    const variantOverrides = mergeProperties(
      {},
      catalogVariant.overrides ?? {},
    )
    const variantChildSlots = catalogVariant.children?.length
      ? catalogVariant.children
      : defaultChildSlots
    const variantRegister = instantiateVariantTree(
      componentId,
      variantRootId,
      {
        nodeType: "variant",
        label: catalogVariant.label,
        template: formatNodeLink(defaultVariantRootId),
        overrides: variantOverrides,
        children: variantChildSlots,
      },
      registry,
      newInstancesById,
      options,
    )
    variantTreeRefs.push(variantTreeRefFromRegister(variantRegister))
  }

  return { nodesById: newInstancesById, variantTreeRefs }
}

/**
 * Adds the component board for `componentId` when missing, including any
 * descendant component boards required by the catalog, then realigns board
 * order across the workspace.
 */
export function addComponent(
  payload: ExtractPayload<"add_component">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    if (draft.components[payload.componentId]) {
      return
    }

    const rootId = payload.componentId as ComponentId
    const variantFallbacks = toVariantFallbackSet(payload.variantFallbacks)
    const instantiationPlans = collectComponentInstantiationPlans(
      rootId,
      variantFallbacks,
    )
    const components = getComponentDescendantIds(rootId, variantFallbacks)
    const registry: NodeRegistry = {}

    let order = -1

    for (const componentId of components.reverse()) {
      if (draft.components[componentId]) {
        registry[componentId] = nodeRegisterFromComponentBoard(
          componentId,
          draft,
        )
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
        setComponentOrder(board, order)
        draft.components[componentId] = board

        order--
      }
    }

    const updatedWorkspace = workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
