import type { ComponentToExport, ExportOptions, FileToExport, JSONTreeNode } from "../types"

/**
 * Slot facts one target's generation pass already computed for one component.
 *
 * `propNames` maps a node path to the prop name the owning component exposes for
 * it. `conditionalPaths` holds the paths that render only when the caller passes
 * them. Both come from the same pass that emits the component file, so the
 * registry reports the slots a target actually generated rather than re-deriving
 * them and drifting from the emitted source.
 */
export interface RefViewSource {
  component: ComponentToExport
  propNames: Map<string, string>
  conditionalPaths: Set<string>
}

/**
 * When a slot renders. `unless-null` renders by default and disappears when the
 * caller passes `null`. `when-passed` stays absent until the caller passes props
 * for it, so a `seldonRefs` override alone cannot bring it on screen.
 */
type RefViewRendersWhen = "unless-null" | "when-passed"

/**
 * One place a referenced node surfaces as a prop. `component` is the generated
 * component that owns the slot, which is the component a caller imports and
 * passes props to. A `null` slot means the node is that component's own root, so
 * the caller drives it through the component's own props.
 */
interface SeldonRefView {
  component: string
  file: string
  slot: string | null
  type: string
  rendersWhen: RefViewRendersWhen
}

/**
 * One entry in the generated refs registry. `component` is the referenced node's
 * own component, and `className` scopes DOM lookups to the rendered node, since
 * the same exported component can render many times. `views` lists every
 * generated component that exposes the node as a prop.
 */
interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
  views: SeldonRefView[]
}

/**
 * Generates the `refs/index.ts` registry shared by every target. It exports a
 * `SeldonRef` string-literal union of every node ref in the workspace and a
 * `SELDON_REFS` map from ref to its component, node id, class name, and the
 * views that expose it. App code uses it for type-safe ref names alongside the
 * emitted `data-seldon-ref` attributes.
 *
 * Returns `null` when no node carries a ref, so the file is only emitted when it
 * has content.
 */
export function generateRefsRegistry(
  sources: RefViewSource[],
  nodeIdToClass: Record<string, string>,
  options: ExportOptions,
): FileToExport | null {
  const refs = new Map<string, SeldonRefEntry>()

  for (const { component, propNames, conditionalPaths } of sources) {
    const file = getRelativeOutputPath(component.output.path, options.output.componentsFolder)

    function visit(node: JSONTreeNode) {
      if (node.ref) {
        const entry = refs.get(node.ref) ?? createEntry(node, nodeIdToClass)

        refs.set(node.ref, entry)
        addView(entry, {
          component: component.name,
          file,
          slot: propNames.get(node.dataBinding.path) ?? null,
          type: node.dataBinding.interfaceName,
          rendersWhen: conditionalPaths.has(node.dataBinding.path) ? "when-passed" : "unless-null",
        })
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit)
      }
    }

    visit(component.tree)
  }

  if (refs.size === 0) {
    return null
  }

  const sortedRefs = Array.from(refs.entries()).sort(([a], [b]) => a.localeCompare(b))

  const unionType = sortedRefs.map(([ref]) => `  | ${JSON.stringify(ref)}`).join("\n")

  const mapEntries = sortedRefs
    .map(([ref, entry]) => `  ${JSON.stringify(ref)}: ${JSON.stringify(entry)},`)
    .join("\n")

  const content = `export type SeldonRef =
${unionType}

export interface SeldonRefView {
  component: string
  file: string
  slot: string | null
  type: string
  rendersWhen: "unless-null" | "when-passed"
}

export interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
  views: SeldonRefView[]
}

export const SELDON_REFS: Record<SeldonRef, SeldonRefEntry> = {
${mapEntries}
}
`

  const indexPath = `${options.output.componentsFolder}/refs/index.ts`.replaceAll("//", "/")

  return {
    path: indexPath,
    content,
  }
}

function createEntry(node: JSONTreeNode, nodeIdToClass: Record<string, string>): SeldonRefEntry {
  const className =
    node.classNames && node.classNames.length > 0
      ? node.classNames.filter(Boolean).join(" ")
      : (nodeIdToClass[node.nodeId] ?? "")

  return {
    component: node.name,
    nodeId: node.nodeId,
    className,
    views: [],
  }
}

/**
 * Adds a view, keeping the list sorted by component then slot so the emitted
 * file stays diff-stable, and skipping a slot the same component already
 * reported. A root view sorts ahead of the named slots of the same component.
 */
function addView(entry: SeldonRefEntry, view: SeldonRefView) {
  const exists = entry.views.some(
    (existing) => existing.component === view.component && existing.slot === view.slot,
  )

  if (exists) return

  entry.views.push(view)
  entry.views.sort((a, b) => {
    const byComponent = a.component.localeCompare(b.component)

    if (byComponent !== 0) return byComponent

    return (a.slot ?? "").localeCompare(b.slot ?? "")
  })
}

function getRelativeOutputPath(path: string, componentsFolder: string): string {
  const prefix = `${componentsFolder}/`

  return path.startsWith(prefix) ? path.slice(prefix.length) : path
}
