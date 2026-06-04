import { ComponentId } from "../../../components/constants"
import type { Properties } from "../../../properties/types/properties"
import { componentBoardUniqueNodeId } from "../../helpers/components/entry-node-ids"
import type { EntryNode } from "../../model/entry-node"
import {
  formatNodeCatalog,
  formatNodeLink,
  parseNodeCatalog,
} from "../../model/template-ref"
import { Instance, InstanceId, Variant, VariantId } from "../../types"

export interface NodeCreationOptions {
  isDefaultVariant?: boolean
  overrides?: Properties
  label?: string
  templateNodeId?: string
}

function catalogComponentId(node: Variant | Instance): ComponentId {
  const parsed = parseNodeCatalog(node.template)
  if (parsed?.kind === "catalog") {
    return parsed.componentId as ComponentId
  }
  throw new Error(`Expected catalog template on node ${node.id}`)
}

/**
 * Creates a new variant entry node.
 */
export function createVariantNode(
  sourceNode: Variant,
  options: NodeCreationOptions = {},
): { newId: VariantId; newNode: Variant } {
  const componentId = catalogComponentId(sourceNode)
  const id = componentBoardUniqueNodeId(componentId) as VariantId
  const isDefault = options.isDefaultVariant ?? false
  const overrides = options.overrides ?? structuredClone(sourceNode.overrides)

  const newNode = {
    id,
    type: isDefault ? "default" : "variant",
    level: sourceNode.level,
    theme: sourceNode.theme,
    template: isDefault
      ? formatNodeCatalog(componentId)
      : formatNodeLink(options.templateNodeId ?? sourceNode.id),
    overrides,
    label: options.label ?? sourceNode.label,
    __editor: { initialOverrides: structuredClone(overrides) },
  } as EntryNode

  return { newId: id, newNode: newNode as Variant }
}

/**
 * Creates a new instance entry node from a source row.
 */
export function createInstanceNode(
  sourceNode: Instance,
  options: NodeCreationOptions = {},
): { newId: InstanceId; newNode: Instance } {
  const componentId = catalogComponentId(sourceNode)
  const id = componentBoardUniqueNodeId(componentId) as InstanceId
  const overrides = options.overrides ?? structuredClone(sourceNode.overrides)

  const newNode: EntryNode = {
    id,
    type: "instance",
    level: sourceNode.level,
    theme: sourceNode.theme,
    template: formatNodeLink(options.templateNodeId ?? sourceNode.id),
    overrides,
    label: options.label ?? sourceNode.label,
    origin: "user",
    __editor: { initialOverrides: structuredClone(overrides) },
  }

  return { newId: id, newNode: newNode as Instance }
}

/**
 * Inserts an item after another item in an array.
 */
export function insertAfter<T>(array: T[], afterItem: T, newItem: T): void {
  const index = array.indexOf(afterItem)
  if (index !== -1) {
    array.splice(index + 1, 0, newItem)
  } else {
    array.push(newItem)
  }
}
