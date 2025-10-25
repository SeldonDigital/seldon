import { Workspace } from "@seldon/core"
import { expandShorthand as coreExpandShorthand } from "@seldon/core/helpers/properties"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import { isShorthandProperty as isShorthandPropertyBase } from "./property-types"

export const isShorthandProperty = isShorthandPropertyBase

/**
 * Creates a shorthand property update payload
 * @param propertyKey - The shorthand property key
 * @param value - The value to set
 * @param workspace - Workspace for core expansion
 * @param node - Node for core expansion
 * @returns Update object for the shorthand property
 */
export function createShorthandPropertyUpdate(
  propertyKey: string,
  value: unknown,
  workspace: Workspace,
  node: Variant | Instance | Board,
): Record<string, unknown> {
  return coreExpandShorthand(
    propertyKey,
    value,
    node.id,
    workspace as unknown as Workspace,
  )
}
