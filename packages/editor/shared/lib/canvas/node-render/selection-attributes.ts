/**
 * The names of the attributes below, for code that reads or clears the contract
 * rather than stamping it.
 */
export const CANVAS_SELECTION_ATTRIBUTES = [
  "data-canvas-node-id",
  "data-canvas-selection-id",
  "data-selection-id",
  "data-selection-kind",
  "data-selection-root-id",
  "data-component-id",
] as const

/**
 * The canvas selection/tracking data attributes stamped on every rendered node,
 * shared by the React and Vue canvases so both surfaces expose the same DOM
 * contract to selection, hover, and measurement. Property attributes (`src`,
 * `checked`, and so on) are mapped separately by each framework because React
 * prop names differ from DOM attribute names.
 */
export function buildCanvasSelectionAttributes(input: {
  nodeId: string
  selfPath: string
  catalogComponentId: string | null
}): Record<string, string> {
  return {
    "data-canvas-node-id": input.nodeId,
    "data-canvas-selection-id": input.nodeId,
    "data-selection-id": input.nodeId,
    "data-selection-kind": "node",
    "data-selection-root-id": input.selfPath,
    "data-component-id": input.catalogComponentId ?? "",
  }
}
