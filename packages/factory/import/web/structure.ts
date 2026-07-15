import type { FunctionalNode } from "./types"

/** A one-line descriptor for a node: tag, first class, role, and catalog seed. */
function describeNode(node: FunctionalNode): string {
  const cls = node.evidence.classes?.length ? `.${node.evidence.classes[0]}` : ""
  const role = node.role ? `[${node.role}]` : ""
  const seed = node.seededComponent ? ` -> ${node.seededComponent}` : ""
  return `${node.tag}${cls}${role}${seed}`
}

/** A flat list of descriptors for a node's direct children. */
export function childOutline(node: FunctionalNode): string[] {
  return node.children.map(describeNode)
}

/**
 * A compact, indented outline of a subtree down to `maxDepth`, including class
 * names and text samples. This is the human- and model-readable view of what a
 * piece contains.
 */
export function describeTree(
  node: FunctionalNode,
  maxDepth = 3,
  depth = 0,
): string {
  const indent = "  ".repeat(depth)
  const role = node.role ? ` role=${node.role}` : ""
  const classes = node.evidence.classes?.length
    ? ` class="${node.evidence.classes.join(" ")}"`
    : ""
  const text = node.evidence.text ? ` "${node.evidence.text}"` : ""
  const line = `${indent}<${node.tag}${role}${classes}>${text}`
  if (depth >= maxDepth || node.children.length === 0) return line
  const kids = node.children
    .map((child) => describeTree(child, maxDepth, depth + 1))
    .join("\n")
  return `${line}\n${kids}`
}
