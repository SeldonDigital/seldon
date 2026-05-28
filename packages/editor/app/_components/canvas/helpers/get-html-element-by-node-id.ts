export function getHtmlElementByNodeId(nodeId: string): HTMLElement | null {
  return document.querySelector(`[data-canvas-node-id="${nodeId}"]`)
}
