/**
 * Child to parent edges from a "/"-joined render path (root-first).
 *
 * The editor renders a node at a known tree position and tracks that position
 * as a path of node ids from the variant root down to the node. A shared child
 * id can appear under several variant trees, so the global parent index keeps
 * only one parent per id. Passing these per-render edges to the compute
 * pipeline resolves `#parent.*` against the parent the node is actually drawn
 * under, without forking the resolver.
 *
 * A single-segment path (a root node) yields an empty map, which matches a node
 * with no composition parent.
 */
export function buildRenderParentIndex(path: string): Map<string, string> {
  const ids = path.split("/")
  const edges = new Map<string, string>()
  for (let i = 1; i < ids.length; i++) edges.set(ids[i], ids[i - 1])
  return edges
}
