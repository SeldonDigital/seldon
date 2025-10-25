import { produce } from "immer"
import { getComponentSchema } from "../../../../components/catalog"
import { ComponentLevel } from "../../../../components/constants"
import { ComponentId } from "../../../../components/constants"
import {
  ComplexComponentSchema,
  Component,
  ComponentSchema,
  NestedOverrides,
} from "../../../../components/types"
import { flattenNestedOverridesObject } from "../../../../helpers/properties/flatten-nested-overrides-object"
import { processNestedOverridesProps } from "../../../../helpers/properties/process-nested-overrides-props"
import { createNodeId } from "../../../../helpers/utils/create-node-id"
import {
  ExtractPayload,
  Instance,
  InstanceId,
  Properties,
  Variant,
  VariantId,
  Workspace,
  invariant,
} from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { getComponentDescendantIds } from "../../../helpers/get-descendant-ids"
import { workspaceService } from "../../../services/workspace.service"
import {
  ValidationOptions,
  logValidationResult,
  validateCoreOperation,
} from "../helpers/validation"

/**
 * Parse indexed property paths like "label2.content" to extract component type and index
 *
 * @param propertyPath - The property path (e.g., "label2.content")
 * @returns Object with componentType, index, and remainingPath, or null if not indexed
 */
function parseIndexedPropertyPath(
  propertyPath: string,
): { componentType: string; index: number; remainingPath: string } | null {
  // Match patterns like "label2.content", "icon1.size", "tableHeader2.content", etc.
  // This regex captures camelCase compound words like "tableHeader", "buttonGroup", etc.
  const match = propertyPath.match(
    /^([a-zA-Z]+(?:[A-Z][a-zA-Z]*)*)(\d+)\.(.+)$/,
  )
  if (match) {
    const [, componentType, indexStr, remainingPath] = match
    return {
      componentType,
      index: parseInt(indexStr, 10),
      remainingPath,
    }
  }
  return null
}

/**
 * Process indexed nestedOverrides props by mapping them to the correct child component instances
 *
 * @param nestedOverrides - The nestedOverrides props from the parent
 * @param childComponentId - The component ID of the child being instantiated
 * @param childIndex - The index of this child in the parent's children array
 * @param parentComponentId - The component ID of the parent (to get the actual children structure)
 * @returns Processed nestedOverrides props with indexed references resolved
 */
function processIndexedNestedOverrides(
  nestedOverrides: NestedOverrides,
  childComponentId: string,
  childIndex: number,
  parentComponentId?: string,
): Record<string, any> {
  const processedNestedOverrides: Record<string, any> = {}

  // Check if this is already flat dot notation or needs to be flattened
  const hasFlatDotNotation = Object.keys(nestedOverrides).some((key) =>
    key.includes("."),
  )
  const flattenedNestedOverrides = hasFlatDotNotation
    ? nestedOverrides
    : flattenNestedOverridesObject(nestedOverrides)

  // Get the parent component schema to understand the children structure
  let parentChildren: Component[] = []
  if (parentComponentId) {
    const parentSchema = getComponentSchema(parentComponentId as ComponentId)
    if ("children" in parentSchema) {
      parentChildren = parentSchema.children || []
    }
  }

  for (const [key, value] of Object.entries(flattenedNestedOverrides)) {
    const indexedPath = parseIndexedPropertyPath(key)

    if (indexedPath) {
      // Find the actual child component at the specified index
      // The index in the nestedOverrides prop is 1-based, so we need to convert to 0-based
      const targetIndex = indexedPath.index - 1

      // Find all children of the specified component type
      const matchingChildren = parentChildren.filter(
        (child) => child.component === indexedPath.componentType,
      )
      const targetChild = matchingChildren[targetIndex]

      // Check if this indexed nestedOverrides applies to the current child
      if (
        targetChild &&
        targetChild.component === childComponentId &&
        parentChildren.indexOf(targetChild) === childIndex
      ) {
        // This indexed nestedOverrides applies to the current child
        const newKey = `${childComponentId}.${indexedPath.remainingPath.replace(/\.([a-z])/g, (_, letter) => letter.toUpperCase())}`
        processedNestedOverrides[newKey] = value
      }
    } else {
      // Non-indexed nestedOverrides - check if this is a numbered component reference
      // Parse the component type from the key (e.g., "tableData.content" -> "tableData")
      const componentType = key.split(".")[0]

      // Check if this is a numbered component reference (e.g., "tableData2", "tableData3")
      const numberedMatch = componentType.match(/^(.+?)(\d+)$/)
      let targetIndex = 0
      let baseComponentType = componentType

      if (numberedMatch) {
        // This is a numbered reference like "tableData2"
        baseComponentType = numberedMatch[1]
        targetIndex = parseInt(numberedMatch[2]) - 1 // Convert to 0-based index
      }

      // Find all children of the specified component type
      const matchingChildren = parentChildren.filter(
        (child) => child.component === baseComponentType,
      )
      const targetChild = matchingChildren[targetIndex]

      // Apply to the specific child (first child for non-numbered, specific index for numbered)
      if (
        targetChild &&
        targetChild.component === childComponentId &&
        parentChildren.indexOf(targetChild) === childIndex
      ) {
        // For numbered references, update the key to use the base component type
        const updatedKey = numberedMatch
          ? key.replace(componentType, baseComponentType)
          : key
        processedNestedOverrides[updatedKey] = value
      }
    }
  }

  return processedNestedOverrides
}

/**
 * A registry of all node ids that have been created within the handleAddBoard function
 * This is used to set the instanceOf property of child nodes
 */
type NodeRegistry = Partial<Record<ComponentId, NodeRegister>>

type NodeRegister = {
  id: VariantId | InstanceId
  component: ComponentId
  children?: NodeRegister[]
}

/**
 * Add a new board to the workspace
 *
 * When we add a board, we need to create missing boards for all (grand) child components along with a default variant.
 * It's important, however, that we do this bottom-up, because if we, for example, add a complex component to an empty workspace, then:
 *
 * ParentComponent.ChildComponent instantiates ChildComponent (so the ChildComponent board + default variant must already exist)
 * ParentComponent.ChildComponent.GrandChild instantiates GrandChild (so the GrandChild board + default variant must already exist)
 * ParentComponent.ChildComponent.GrandChild.Primitive instantiates Primitive (so the Primitive board + default variant must already exist)
 *
 * @param payload
 * @param workspace
 * @returns
 */
export function handleAddBoard(
  payload: ExtractPayload<"add_board">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  // Perform validation for AI operations or when explicitly requested
  if (options.isAiOperation || options.strict) {
    const validation = validateCoreOperation(
      "add_board",
      payload,
      workspace,
      options,
    )
    logValidationResult("add_board", validation, options)

    // For AI operations, we want to be more strict about validation failures
    if (options.isAiOperation && !validation.isValid) {
      // Continue execution but log the issues for AI debugging
    }
  }

  return produce(workspace, (draft) => {
    if (draft.boards[payload.componentId]) {
      return draft
    }

    /**
     * Add default variants and boards to the workspace if they don't exist
     */
    const components = getComponentDescendantIds(payload.componentId)
    const registry: NodeRegistry = {}

    // Make sure boards are added before the first board. Order will be realigned automatically later.
    let order = -1

    // Process components in reverse order to ensure parent components have access to their children's variant IDs
    for (const componentId of components.reverse()) {
      // If there is already a board for this component, we don't need to create a new one.
      // We add the existing board's default variant to the registry so that we can instantiate its children in the following components.
      if (draft.boards[componentId]) {
        registry[componentId] = createRegisterFromExistingBoard(
          componentId,
          draft,
        )
      } else {
        // If there is no board for this component, we need to create a new one.
        // We also create a register for it, so that we can instantiate its children in the following components.
        const { newInstancesById, newVariantId } = instantiateComponent(
          componentId,
          registry,
        )

        // Add the instantiated children to the workspace
        draft.byId = { ...draft.byId, ...newInstancesById }

        // Add a new board with a default variant
        draft.boards[componentId] = {
          label: workspaceService.getInitialBoardLabel(componentId),
          id: componentId,
          component: componentId,
          theme: "default",
          variants: [newVariantId],
          properties: {},
          order,
        }

        order--
      }
    }

    // Realign the order of the boards based on component levels
    const updatedWorkspace = workspaceService.realignBoardOrder(draft)
    Object.assign(draft.boards, updatedWorkspace.boards)
  })
}

/**
 * Create a register from an existing board
 *
 * @param componentId - The id of the component to create a register for
 * @param workspace - The workspace to create the register from
 * @returns The register
 */
function createRegisterFromExistingBoard(
  componentId: ComponentId,
  workspace: Workspace,
): NodeRegister {
  function addNodeToRegister(childId: InstanceId | VariantId): NodeRegister {
    const child = workspace.byId[childId]
    const register: NodeRegister = {
      id: childId,
      component: child.component,
    }
    if (child.children) {
      register.children = child.children.map(addNodeToRegister)
    }
    return register
  }

  return addNodeToRegister(`variant-${componentId}-default`)
}

/**
 * Instantiate a component and all its children and add them to the registry
 *
 * @param componentId - The id of the component to instantiate
 * @param registry - The registry to use to instantiate the children
 * @returns The new instances by id and the new variant id
 */
function instantiateComponent(
  componentId: ComponentId,
  registry: NodeRegistry,
): {
  newInstancesById: Workspace["byId"]
  newVariantId: VariantId
} {
  const schema = getComponentSchema(componentId)
  const variantId: VariantId = `variant-${componentId}-default`

  registry[componentId] = {
    id: variantId,
    component: componentId,
  }

  // Ensure all child component variants exist in the registry before creating child instances
  if ("children" in schema && schema.children) {
    schema.children.forEach((child: any) => {
      const childComponentId = child.component as ComponentId
      if (!registry[childComponentId]) {
        // Recursively instantiate the child component to ensure its variant exists
        const {
          newInstancesById: childInstances,
          newVariantId: childVariantId,
        } = instantiateComponent(childComponentId, registry)

        // Add the child component's instances to our instances (but don't add to workspace yet)
        Object.assign(newInstancesById, childInstances)

        // Create registry entry for the child component
        registry[childComponentId] = {
          id: childVariantId,
          component: childComponentId,
        }
      }
    })
  }

  /**
   * Traverse the component tree and instantiate the children
   */
  const { newInstancesById: childrenById, directInstanceIds } =
    instantiateChildrenFromSchema(schema, registry)

  const variant: Variant = {
    id: variantId,
    type: "defaultVariant",
    label: schema.name,
    isChild: false,
    fromSchema: true,
    theme: null,
    level: schema.level,
    component: componentId,
    properties: {},
  }

  const newInstancesById: Workspace["byId"] = {
    [variantId]: variant,
    ...childrenById,
  }

  // If this component has any direct children, add them to it's byId record
  if ("children" in schema) {
    variant.children = directInstanceIds
  }

  return { newInstancesById, newVariantId: variantId }
}

/**
 * Instantiate component children and add them to the registry
 *
 * @param component - The component to instantiate
 * @param registry - The registry to use to instantiate the children
 * @returns The new instances by id and the direct instance ids
 */
function instantiateChildrenFromSchema(
  component: Component | ComponentSchema,
  registry: NodeRegistry,
): {
  newInstancesById: Workspace["byId"]
  directInstanceIds: InstanceId[]
} {
  const newInstancesById: Workspace["byId"] = {}
  const directInstanceIds: InstanceId[] = []
  const componentId =
    "component" in component ? component.component : component.id
  const register = registry[componentId]!

  function instantiateChild(
    registerToWriteTo: NodeRegister,
    registerToReadFrom: NodeRegister,
    overrides: Properties = {},
    isDirectChild: boolean = false,
    parentOverride?: Record<string, any>,
  ) {
    if (!registerToWriteTo.children) {
      throw new Error("Children not found in register " + registerToWriteTo.id)
    }

    // Get the full schema of the component
    const schema = getComponentSchema(registerToReadFrom.component)
    const id: InstanceId = `child-${schema.id}-${createNodeId()}`

    const processedOverrides = processNestedOverridesProps(
      overrides,
      parentOverride,
      schema.id,
    )

    const instance: Instance = {
      id,
      label: schema.name,
      isChild: true,
      fromSchema: true,
      level: schema.level,
      theme: null,
      variant: `variant-${schema.id}-default`,
      instanceOf: registerToReadFrom.id,
      component: schema.id,
      properties: processedOverrides,
      __editor: { initialOverrides: processedOverrides },
    }

    newInstancesById[id] = instance

    const newChild: NodeRegister = { id, component: schema.id }

    registerToWriteTo.children.push(newChild)

    if (isDirectChild) {
      directInstanceIds.push(id)
    }

    if (registerToReadFrom.children) {
      instance.children = []
      newChild.children = []

      registerToReadFrom.children.forEach((childRegister, childIndex) => {
        // Get the child's properties from the parent component schema
        const parentSchema = getComponentSchema(registerToReadFrom.component)
        let childProperties: Properties = {}
        let childNestedOverrides: Record<string, any> | undefined

        // Only complex components have children schemas
        if (parentSchema.level !== ComponentLevel.PRIMITIVE) {
          const complexSchema = parentSchema as ComplexComponentSchema
          // Get the child schema by index, not by component type, to handle multiple children of the same type
          const childSchema = complexSchema.children?.[childIndex]
          if (
            childSchema &&
            childSchema.component === childRegister.component
          ) {
            childProperties = childSchema.overrides || {}
            childNestedOverrides = childSchema.nestedOverrides
          }
        }

        // Process indexed nestedOverrides props for this child from the parent
        let processedParentOverride = parentOverride
        if (parentOverride) {
          processedParentOverride = processIndexedNestedOverrides(
            parentOverride,
            childRegister.component,
            childIndex,
            registerToReadFrom.component,
          )
        }

        // Merge the child's own nestedOverrides props with the processed parent override
        // Child nestedOverrides props take precedence over parent nestedOverrides props
        let mergedNestedOverrides = processedParentOverride
        if (childNestedOverrides) {
          mergedNestedOverrides = {
            ...processedParentOverride,
            ...childNestedOverrides,
          }
        }

        // For nested children, we need to pass the merged nestedOverrides data
        // This allows nested property overrides to work correctly
        const childId = instantiateChild(
          newChild,
          childRegister,
          childProperties,
          false,
          mergedNestedOverrides,
        )
        instance.children!.push(childId)
      })
    }

    return id
  }

  // This is the root component, we only want to traverse it's children, not iself
  if ("children" in component) {
    register.children = []

    component.children?.forEach((child, childIndex) => {
      invariant(
        registry[child.component],
        `Register for ${child.component} not found`,
      )

      // Pass through the nestedOverrides props unchanged - indexed processing happens at the child level
      const processedNestedOverrides = child.nestedOverrides

      // Create the child instance with properties and processed nestedOverrides
      const childId = instantiateChild(
        register,
        registry[child.component]!,
        child.overrides,
        true,
        processedNestedOverrides, // Pass the processed nestedOverrides data to the child
      )

      // nestedOverrides data is now passed during instantiation, so no need to store it separately
    })
  }

  return { newInstancesById, directInstanceIds }
}
