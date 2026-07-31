import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useStore as useSelectionStore } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useMemo } from "react"

import { parseNodeLink } from "@seldon/core/workspace/model/template-ref"

import type { Workspace } from "@seldon/core/workspace/types"

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

/**
 * The branch around the selection: everything that inherits from it, plus the
 * template chain it comes from.
 */
function computeHighlight(selectedNodeId: string, workspace: Workspace): SharedNodeHighlight {
  const graph = buildTemplateGraph(workspace)
  const primary = new Set<string>([selectedNodeId])
  const secondary = new Set<string>()

  for (const id of collectDownstream(selectedNodeId, graph)) primary.add(id)
  for (const id of collectUpstream(selectedNodeId, graph)) secondary.add(id)

  return { primary, secondary }
}

let highlightCache: {
  selectedNodeId: string
  workspace: Workspace
  value: SharedNodeHighlight
} | null = null

/**
 * Resolves the branch around the current selection while Show Connectors is on.
 * The result is cached across sidebar rows so the template graph is only walked
 * once per selection.
 */
export function useSharedNodeHighlight(): SharedNodeHighlight {
  const { showConnectors } = useEditorConfig()
  const { workspace } = useWorkspace({ usePreview: false })
  const selectedNodeId = useSelectionStore((state) => state.selectedNodeId)

  return useMemo(() => {
    if (!showConnectors || !selectedNodeId) return EMPTY_HIGHLIGHT
    if (!workspace.nodes[selectedNodeId]) return EMPTY_HIGHLIGHT

    if (
      highlightCache &&
      highlightCache.selectedNodeId === selectedNodeId &&
      highlightCache.workspace === workspace
    ) {
      return highlightCache.value
    }

    const value = computeHighlight(selectedNodeId, workspace)

    highlightCache = { selectedNodeId, workspace, value }

    return value
  }, [showConnectors, selectedNodeId, workspace])
}
