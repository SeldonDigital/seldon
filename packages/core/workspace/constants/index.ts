import { ComponentId } from "../../components/constants"
import type { ThemeInstanceId } from "../../themes/types"
import { InstanceId, VariantId } from "../types"

/**
 * Fallback theme id when a board or node carries no theme ref. Matches the
 * protected `seldon` theme entry that every workspace keeps.
 */
export const DEFAULT_THEME_ID = "seldon" as ThemeInstanceId

export const ErrorMessages = {
  nodeNotFound: (id: InstanceId | VariantId) => `Node ${id} not found.`,
  componentNotFound: (id: string) =>
    id ? `Board ${id} not found.` : `Board id is missing (received ${id}).`,
  componentAlreadyExists: (id: string) => `Board ${id} already exists.`,
  componentNotFoundForVariant: (id: VariantId) =>
    `Board not found for variant ${id}.`,
  tooManyDefaultVariants: (id: ComponentId) =>
    `Board ${id} has more than one default variant.`,
  componentVariantsInUse: (_id: ComponentId) =>
    `One or more variants of this board are in use in other components. Remove them first before deleting the board.`,
  variantsInUseForReset: (
    usages: { usingBoardLabel: string; variantLabel: string }[],
  ) => {
    const detail = usages
      .map((usage) => `${usage.usingBoardLabel} uses ${usage.variantLabel}`)
      .join(", ")
    return `Cannot reset to catalog: variants are still in use by other components (${detail}). Remove those references first.`
  },
  variantNotFound: (id: VariantId) => `Variant ${id} not found.`,
  variantLabelNotUnique: (label: string) =>
    `A variant that is called ${label} already exists. Please choose another name.`,
  refNotUnique: (ref: string) =>
    `The reference "${ref}" is already in use. Please choose another reference.`,
  defaultVariantNotFound: (id: ComponentId) =>
    `Default variant not found for component ${id}.`,
  defaultVariantCannotBeRemoved: () => `Default variants cannot be removed.`,
  variantInUse: (_id: VariantId) =>
    `This variant is used in other components. Remove it from them first before deleting.`,
  nodeNotVariant: (id: InstanceId | VariantId) =>
    `Node ${id} is not a variant.`,
  nodeNotInstance: (id: InstanceId | VariantId) =>
    `Node ${id} is not an instance but a variant.`,
  childNotAllowed: (id: InstanceId | VariantId) =>
    `Node ${id} cannot have children.`,
  parentNotFound: (id: InstanceId | VariantId) =>
    `Parent node not found for node ${id}.`,
  cannotMoveToDifferentVariant: () =>
    `A component cannot be moved to a different variant or board.`,
  cannotMoveIntoOwnSubtree: (id: InstanceId | VariantId) =>
    `Node ${id} cannot be moved into itself or one of its own descendants.`,
  cyclicComponentTree: (id: string) =>
    `Component tree contains a cycle at node ${id}.`,
  danglingVariant: (id: VariantId) => `Variant ${id} is not used in any board.`,
  danglingChildNode: (id: InstanceId) =>
    `Child node ${id} is not used in any node.`,
  instanceMissingOrigin: (id: InstanceId) =>
    `Instance ${id} is missing a valid origin classification.`,
  missingInstance: (
    id: InstanceId | VariantId,
    instance: InstanceId | VariantId,
  ) => `Node ${id} references ${instance} which does not exist.`,
  duplicateIds: (ids: string[]) =>
    `Duplicate IDs found in workspace: ${ids.join(", ")}.`,
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
} as const
