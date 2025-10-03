import { createNodeId } from "../../../helpers/utils/create-node-id"
import {
  Instance,
  InstanceId,
  UserVariant,
  Variant,
  VariantId,
} from "../../types"

export interface NodeCreationOptions {
  isDefaultVariant?: boolean
  fromSchema?: boolean
  properties?: Record<string, any>
  label?: string
  instanceOf?: string
  variant?: string
}

/**
 * Creates a new variant node with the specified options.
 * @param sourceNode - The source variant to base the new node on
 * @param options - Creation options
 * @returns The new variant ID and node
 */
export function createVariantNode(
  sourceNode: Variant,
  options: NodeCreationOptions = {},
): { newId: VariantId; newNode: Variant } {
  const id = `variant-${sourceNode.component}-${createNodeId()}` as VariantId
  const isDefaultVariant = options.isDefaultVariant ?? false

  const newNode = isDefaultVariant
    ? ({
        id,
        type: "defaultVariant" as const,
        component: sourceNode.component,
        level: sourceNode.level,
        theme: sourceNode.theme,
        isChild: false,
        fromSchema: true,
        properties: {},
        __editor: {
          initialOverrides: {},
        },
        instanceOf: sourceNode.id,
        label: options.label ?? `Variant-${createNodeId().slice(0, 4)}`,
      } as Variant)
    : ({
        id,
        type: "userVariant" as const,
        component: sourceNode.component,
        level: sourceNode.level,
        theme: sourceNode.theme,
        isChild: false,
        fromSchema: options.fromSchema ?? false,
        properties: options.properties ?? sourceNode.properties,
        __editor: {
          initialOverrides: options.properties ?? sourceNode.properties,
        },
        // UserVariant has instanceOf property, default variants don't
        instanceOf: (sourceNode as UserVariant).instanceOf,
        label: options.label ?? `Variant-${createNodeId().slice(0, 4)}`,
      } as Variant)

  return { newId: id, newNode }
}

/**
 * Creates a new instance node with the specified options.
 * @param sourceNode - The source instance to base the new node on
 * @param options - Creation options
 * @returns The new instance ID and node
 */
export function createInstanceNode(
  sourceNode: Instance,
  options: NodeCreationOptions = {},
): { newId: InstanceId; newNode: Instance } {
  const id = `child-${sourceNode.component}-${createNodeId()}` as InstanceId

  const newNode: Instance = {
    id,
    // Use provided instanceOf, or sourceNode.id for default variants, or sourceNode.instanceOf for others
    instanceOf:
      (options.instanceOf as VariantId | InstanceId) ??
      (options.isDefaultVariant ? sourceNode.id : sourceNode.instanceOf),
    theme: sourceNode.theme,
    component: sourceNode.component,
    level: sourceNode.level,
    isChild: true,
    fromSchema: options.fromSchema ?? false,
    variant: (options.variant as VariantId) ?? sourceNode.variant,
    label: options.label ?? sourceNode.label,
    properties: options.properties ?? sourceNode.properties,
    __editor: { initialOverrides: options.properties ?? sourceNode.properties },
  }

  return { newId: id, newNode }
}

/**
 * Inserts an item after another item in an array.
 * @param array - The array to modify
 * @param afterItem - The item to insert after
 * @param newItem - The item to insert
 */
export function insertAfter<T>(array: T[], afterItem: T, newItem: T): void {
  const index = array.indexOf(afterItem)
  if (index !== -1) {
    array.splice(index + 1, 0, newItem)
  } else {
    array.push(newItem)
  }
}
