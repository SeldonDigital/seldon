import type { DedupedPiece, FunctionalNode } from "./types"

/**
 * A structural signature for a subtree. Two nodes share a signature when they
 * have the same tag, role, own-text presence, and the same ordered child
 * signatures. Text content, ids, and attributes are excluded, so nodes that
 * differ only in their data collapse onto one signature.
 */
export function signatureOf(node: FunctionalNode): string {
  const role = node.role ? `#${node.role}` : ""
  const text = node.hasText ? "~t" : ""
  const children = node.children.map(signatureOf).join(",")
  return `${node.tag}${role}${text}(${children})`
}

/** Total node count of a subtree, used to rank larger pieces first. */
function subtreeSize(node: FunctionalNode): number {
  return node.children.reduce((total, child) => total + subtreeSize(child), 1)
}

/**
 * Reduces a functional tree to its smallest set of structurally unique pieces.
 * Every node in the tree is grouped by signature, so a piece that repeats, such
 * as a list item or card, is reported once with its occurrence count. Pieces
 * are ordered largest first, then by how often they occur, so the most
 * significant structures lead the report.
 */
export function dedupe(root: FunctionalNode): DedupedPiece[] {
  const groups = new Map<string, DedupedPiece>()

  function visit(node: FunctionalNode): void {
    const signature = signatureOf(node)
    const existing = groups.get(signature)
    if (existing) {
      existing.count += 1
    } else {
      groups.set(signature, { signature, count: 1, sample: node })
    }
    for (const child of node.children) visit(child)
  }

  visit(root)

  return Array.from(groups.values()).sort((a, b) => {
    const sizeDelta = subtreeSize(b.sample) - subtreeSize(a.sample)
    if (sizeDelta !== 0) return sizeDelta
    return b.count - a.count
  })
}
