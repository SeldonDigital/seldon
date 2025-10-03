import { ComponentId } from "../components/constants"
import { ThemeSwatchId } from "../themes/types"
import { InstanceId, VariantId } from "./types"

export const ErrorMessages = {
  nodeNotFound: (id: InstanceId | VariantId) => `Node ${id} not found.`,
  boardNotFound: (id: ComponentId) => `Board ${id} not found.`,
  boardAlreadyExists: (id: ComponentId) => `Board ${id} already exists.`,
  boardNotFoundForVariant: (id: VariantId) =>
    `Board not found for variant ${id}.`,
  tooManyDefaultVariants: (id: ComponentId) =>
    `Board ${id} has more than one default variant.`,
  invalidBoardIndex: (id: ComponentId, index: number, expected: number) =>
    `Board ${id} has an invalid index of ${index} (expected ${expected}).`,
  nodeOrBoardNotFound: (id: InstanceId | VariantId | ComponentId) =>
    `No node or board found with id ${id}.`,
  boardVariantsInUse: (id: ComponentId) =>
    `One or more variants of this board are in use in other components. Remove them first before deleting the board.`,
  variantNotFound: (id: VariantId) => `Variant ${id} not found.`,
  variantLabelNotUnique: (label: string) =>
    `A variant that is called ${label} already exists. Please choose another name.`,
  defaultVariantNotFound: (id: ComponentId) =>
    `Default variant not found for component ${id}.`,
  defaultVariantCannotBeRemoved: () => `Default variants cannot be removed.`,
  variantInUse: (id: VariantId) =>
    `This variant is used in other components. Remove it from them first before deleting.`,
  nodeNotVariant: (id: InstanceId | VariantId) =>
    `Node ${id} is not a variant.`,
  nodeNotInstance: (id: InstanceId | VariantId) =>
    `Node ${id} is not an instance but a variant.`,
  noChildAtIndex: (id: InstanceId | VariantId, index: number) =>
    `Node ${id} does not have a child at index ${index}.`,
  childNotAllowed: (id: InstanceId | VariantId) =>
    `Node ${id} cannot have children.`,
  parentNotFound: (id: InstanceId | VariantId) =>
    `Parent node not found for node ${id}.`,
  moveNotAllowed: (id: InstanceId | VariantId) =>
    `Node ${id} is not allowed to be moved.`,
  cannotMoveToDifferentVariant: () =>
    `A component cannot be moved to a different variant or board.`,
  danglingVariant: (id: VariantId) => `Variant ${id} is not used in any board.`,
  missingVariant: (id: VariantId) => `Variant ${id} not found.`,
  danglingChildNode: (id: InstanceId) =>
    `Child node ${id} is not used in any node.`,
  missingInstance: (
    id: InstanceId | VariantId,
    instance: InstanceId | VariantId,
  ) => `Node ${id} references ${instance} which does not exist.`,
  duplicateIds: (ids: string[]) =>
    `Duplicate IDs found in workspace: ${ids.join(", ")}.`,
  duplicateInstanceIds: (ids: string[]) =>
    `Duplicate child IDs found in workspace: ${ids.join(", ")}.`,
  variantRefersToParent: (id: VariantId, property: string) =>
    `Variant ${id}'s property ${property} is based on a parent node but variants don't have a parent node.`,
  cannotMoveToDefaultPosition: () =>
    "Cannot move a variant to the default position",
  cannotAddSelfAsInstance: () => "Cannot add self as an instance to self",
  cannotAddChild: (component: string) =>
    `${component} does not allow adding children`,
  invalidParentChildRelationship: (
    parentComponent: string,
    childComponent: string,
  ) =>
    `${parentComponent} cannot contain a ${childComponent} due to level constraints.`,
  swatchNotFound: (id: ThemeSwatchId) =>
    `A swatch with the id ${id} does not exist.`,
} as const
