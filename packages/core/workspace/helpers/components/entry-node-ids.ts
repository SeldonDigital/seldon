import { createNodeId } from "../../../helpers/utils/create-node-id"

/** Default root node id for a component catalog row (`component-{componentKey}-default`). */
export function componentBoardDefaultNodeId(componentKey: string): string {
  return `component-${componentKey}-default`
}

/** Root node id for a catalog schema variant (`component-{componentKey}-{variantId}`). */
export function componentBoardSchemaVariantNodeId(
  componentKey: string,
  variantId: string,
): string {
  return `component-${componentKey}-${variantId}`
}

/** New node id with unique suffix (`component-{componentKey}-{suffix}`). */
export function componentBoardUniqueNodeId(componentKey: string): string {
  return `component-${componentKey}-${createNodeId()}`
}
