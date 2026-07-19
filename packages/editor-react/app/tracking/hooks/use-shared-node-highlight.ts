import { useMemo } from "react"
import { parseNodeLink } from "@seldon/core/workspace/model/template-ref"
import type { Workspace } from "@seldon/core/workspace/types"
import { useStore as useSelectionStore } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useEditorConfig } from "@app/hooks/use-editor-config"

const EMPTY_IDS: ReadonlySet<string> = new Set()

/**
 * Primary ids highlight strongly ("what changes when you edit the selected
 * node"). Secondary ids highlight faintly (related lineage that does not change
 * from this edit).
 */
export interface SharedNodeHighlight {
  primary: ReadonlySet<string>
  secondary: ReadonlySet<string>
}

const EMPTY_HIGHLIGHT: SharedNodeHighlight = {
  primary: EMPTY_IDS,
  secondary: EMPTY_IDS,
}

type Mode = "downstream" | "chain" | "family"

/** Maps the View menu metaphor labels to the graph traversal they perform. */
const MODE_BY_HIGHLIGHT: Record<"leaves" | "branch" | "tree", Mode> = {
  leaves: "downstream",
  branch: "chain",
  tree: "family",
}

/** Maps each node to its immediate template-source node id, and the reverse. */
interface TemplateGraph {
  sourceOf: Map<string, string>
  childrenOf: Map<string, string[]>
}

function buildTemplateGraph(workspace: Workspace): TemplateGraph {
  const sourceOf = new Map<string, string>()
  const childrenOf = new Map<string, string[]>()

  for (const node of Object.values(workspace.nodes)) {
    const link = parseNodeLink(node.template)
    if (!link) continue
    sourceOf.set(node.id, link.nodeId)
    const siblings = childrenOf.get(link.nodeId)
    if (siblings) siblings.push(node.id)
    else childrenOf.set(link.nodeId, [node.id])
  }

  return { sourceOf, childrenOf }
}

/** Every node reachable downstream of `rootId` by following reverse template links. */
function collectDownstream(rootId: string, graph: TemplateGraph): Set<string> {
  const result = new Set<string>()
  const queue = [rootId]

  while (queue.length > 0) {
    const current = queue.pop() as string
    const children = graph.childrenOf.get(current)
    if (!children) continue
    for (const child of children) {
      if (result.has(child)) continue
      result.add(child)
      queue.push(child)
    }
  }

  return result
}

/** The chain of template sources above `id`, nearest first. */
function collectUpstream(id: string, graph: TemplateGraph): Set<string> {
  const result = new Set<string>()
  let current = graph.sourceOf.get(id)
  while (current && !result.has(current)) {
    result.add(current)
    current = graph.sourceOf.get(current)
  }
  return result
}

/** The topmost template source (catalog-rooted node) above or at `id`. */
function findRootId(id: string, graph: TemplateGraph): string {
  let current = id
  let next = graph.sourceOf.get(current)
  while (next) {
    current = next
    next = graph.sourceOf.get(current)
  }
  return current
}

function computeHighlight(
  mode: Mode,
  selectedNodeId: string,
  workspace: Workspace,
): SharedNodeHighlight {
  const graph = buildTemplateGraph(workspace)

  const primary = new Set<string>([selectedNodeId])
  for (const id of collectDownstream(selectedNodeId, graph)) primary.add(id)

  if (mode === "downstream") {
    return { primary, secondary: EMPTY_IDS }
  }

  const secondary = new Set<string>()

  if (mode === "chain") {
    for (const id of collectUpstream(selectedNodeId, graph)) secondary.add(id)
    return { primary, secondary }
  }

  // family: everything connected to the same catalog root, minus the primary set.
  const rootId = findRootId(selectedNodeId, graph)
  const family = collectDownstream(rootId, graph)
  family.add(rootId)
  for (const id of family) {
    if (!primary.has(id)) secondary.add(id)
  }
  return { primary, secondary }
}

let highlightCache: {
  mode: Mode
  selectedNodeId: string
  workspace: Workspace
  value: SharedNodeHighlight
} | null = null

/**
 * Resolves the active Show Leaves / Branch / Tree highlight for the current
 * selection, driven by the View menu `componentHighlightMode` radio. The
 * `"selection"` mode shows no relationship overlay. The result is cached across
 * sidebar rows so the template graph is only walked once per selection.
 */
export function useSharedNodeHighlight(): SharedNodeHighlight {
  const { componentHighlightMode } = useEditorConfig()
  const { workspace } = useWorkspace({ usePreview: false })
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)

  const mode: Mode | null =
    componentHighlightMode === "selection"
      ? null
      : MODE_BY_HIGHLIGHT[componentHighlightMode]

  return useMemo(() => {
    if (!mode || !selectedNodeId) return EMPTY_HIGHLIGHT
    if (!workspace.nodes[selectedNodeId]) return EMPTY_HIGHLIGHT

    if (
      highlightCache &&
      highlightCache.mode === mode &&
      highlightCache.selectedNodeId === selectedNodeId &&
      highlightCache.workspace === workspace
    ) {
      return highlightCache.value
    }

    const value = computeHighlight(mode, selectedNodeId, workspace)
    highlightCache = { mode, selectedNodeId, workspace, value }
    return value
  }, [mode, selectedNodeId, workspace])
}
