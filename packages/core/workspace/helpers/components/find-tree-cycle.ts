import type { ComponentTreeRef, Workspace } from "../../types"

/**
 * Finds the first node id that forms a cycle in any board variant tree.
 *
 * Returns null when every tree is acyclic. The walk is iterative so a cyclic or
 * very deep tree cannot overflow the call stack the way a recursive walk would.
 * Immer freezes a workspace by recursing through these nested trees, so a cycle
 * here crashes a reducer with a call stack overflow. Detect it first and fail
 * with a clear message instead.
 */
export function findComponentTreeCycleId(workspace: Workspace): string | null {
  for (const board of Object.values(workspace.components)) {
    const cycleId = findCycleInRefs(board.variants)
    if (cycleId) return cycleId
  }
  return null
}

/**
 * Depth-first walk that tracks the current path only. A back edge to an id or
 * ref object already on the path marks a cycle. Ids and refs that appear in
 * sibling branches that already finished are not flagged, so shared nodes in an
 * acyclic graph pass.
 */
function findCycleInRefs(roots: ComponentTreeRef[]): string | null {
  type Frame = { ref: ComponentTreeRef; childIndex: number }

  for (const root of roots) {
    const stack: Frame[] = [{ ref: root, childIndex: 0 }]
    const pathIds = new Set<string>([root.id])
    const pathRefs = new Set<ComponentTreeRef>([root])

    while (stack.length > 0) {
      const frame = stack[stack.length - 1]
      const children = frame.ref.children

      if (!children || frame.childIndex >= children.length) {
        pathIds.delete(frame.ref.id)
        pathRefs.delete(frame.ref)
        stack.pop()
        continue
      }

      const child = children[frame.childIndex]
      frame.childIndex += 1

      if (pathRefs.has(child) || pathIds.has(child.id)) {
        return child.id
      }

      pathIds.add(child.id)
      pathRefs.add(child)
      stack.push({ ref: child, childIndex: 0 })
    }
  }

  return null
}
