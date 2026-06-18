import {
  ComponentToExport,
  ExportOptions,
  FileToExport,
  JSONTreeNode,
} from "../../types"

/**
 * One entry in the generated refs registry. `className` scopes DOM lookups to
 * the rendered node, since the same exported component can render many times.
 */
type SeldonRefEntry = {
  component: string
  nodeId: string
  className: string
}

/**
 * Generates a React-only `refs/index.ts` registry. It exports a `SeldonRef`
 * string-literal union of every node ref in the workspace and a `SELDON_REFS`
 * map from ref to its component, node id, and class name. App code uses it for
 * type-safe ref names alongside the emitted `data-seldon-ref` attributes.
 *
 * Returns `null` when no node carries a ref, so the file is only emitted when
 * it has content.
 */
export function generateRefsRegistry(
  components: ComponentToExport[],
  nodeIdToClass: Record<string, string>,
  options: ExportOptions,
): FileToExport | null {
  const refs = new Map<string, SeldonRefEntry>()

  function visit(node: JSONTreeNode) {
    if (node.ref && !refs.has(node.ref)) {
      const className =
        node.classNames && node.classNames.length > 0
          ? node.classNames.filter(Boolean).join(" ")
          : (nodeIdToClass[node.nodeId] ?? "")
      refs.set(node.ref, {
        component: node.name,
        nodeId: node.nodeId,
        className,
      })
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(visit)
    }
  }

  for (const component of components) {
    visit(component.tree)
  }

  if (refs.size === 0) {
    return null
  }

  const sortedRefs = Array.from(refs.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  )

  const unionType = sortedRefs
    .map(([ref]) => `  | ${JSON.stringify(ref)}`)
    .join("\n")

  const mapEntries = sortedRefs
    .map(
      ([ref, entry]) => `  ${JSON.stringify(ref)}: ${JSON.stringify(entry)},`,
    )
    .join("\n")

  const content = `export type SeldonRef =
${unionType}

export interface SeldonRefEntry {
  component: string
  nodeId: string
  className: string
}

export const SELDON_REFS: Record<SeldonRef, SeldonRefEntry> = {
${mapEntries}
}
`

  const indexPath =
    `${options.output.componentsFolder}/refs/index.ts`.replaceAll("//", "/")

  return {
    path: indexPath,
    content,
  }
}
