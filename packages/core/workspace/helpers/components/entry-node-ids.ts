import { createNodeId } from "../../../helpers/utils/create-node-id"

/** Default root node id for a component catalog row (`component-{boardKey}-default`). */
export function componentBoardDefaultNodeId(boardKey: string): string {
  return `component-${boardKey}-default`
}

/** Root node id for a catalog schema variant (`component-{boardKey}-{variantId}`). */
export function componentBoardSchemaVariantNodeId(
  boardKey: string,
  variantId: string,
): string {
  return `component-${boardKey}-${variantId}`
}

/** New node id with unique suffix (`component-{boardKey}-{suffix}`). */
export function componentBoardUniqueNodeId(boardKey: string): string {
  return `component-${boardKey}-${createNodeId()}`
}

/** Authored root node id for an authored board (`component-{boardKey}-authored`). */
export function authoredBoardRootNodeId(boardKey: string): string {
  return `component-${boardKey}-authored`
}

/** New Sandbox root node id for a playground (`playground-{playgroundKey}-{suffix}`). */
export function playgroundSandboxNodeId(playgroundKey: string): string {
  return `playground-${playgroundKey}-${createNodeId()}`
}
