export function getChildNodesWithNodeId(node: HTMLElement) {
  return Array.from(
    node.querySelectorAll<HTMLElement>(":scope > [data-node-id]"),
  )
}
