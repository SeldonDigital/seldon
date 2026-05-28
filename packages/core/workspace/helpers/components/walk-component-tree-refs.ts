import type { ComponentTreeRef } from "../../types"

/**
 * Visit each node in a board tree.
 *
 * @param roots Root nodes to walk.
 * @param visit Function to run for each node and its parent. Return true to stop.
 */
export function walkComponentTreeRefs(
  roots: ComponentTreeRef[],
  visit: (ref: ComponentTreeRef, parent: ComponentTreeRef | null) => boolean | void,
): void {
  const visitRef = (ref: ComponentTreeRef, parent: ComponentTreeRef | null): boolean => {
    const shouldStop = visit(ref, parent)
    if (shouldStop === true) return true

    if (!ref.children?.length) return false

    for (const child of ref.children) {
      if (visitRef(child, ref)) return true
    }

    return false
  }

  for (const root of roots) {
    if (visitRef(root, null)) return
  }
}
