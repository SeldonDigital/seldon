import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type {
  Board,
  BoardKey,
  ComponentTreeRef,
  EntryNode,
  Workspace,
} from "@seldon/core/workspace/types"

import { nodeStringsSummary } from "./node-strings"

/**
 * Every workspace action targets a node by id, so the model can only act on ids
 * it has seen. This serializes a variant subtree into indented lines that pair
 * each id with its level and resolved catalog id, the exact handle the model
 * needs to map a node to its property vocabulary. It lives here because the
 * active-board section is its only caller: the tree it prints and the id set it
 * gathers are two views of the same walk.
 */
function walkTree(
  refs: ComponentTreeRef[],
  workspace: Workspace,
  depth: number,
  lines: string[],
  visited: EntryNode[],
  maxDepth: number = Number.POSITIVE_INFINITY,
): void {
  for (const ref of refs) {
    const node = workspace.nodes[ref.id]
    const indent = "  ".repeat(depth)
    if (node) {
      visited.push(node)
      const catalogId = getNodeCatalogId(node, workspace)
      const kind = catalogId ? `${node.level} ${catalogId}` : node.level
      const label = node.label ? ` label="${node.label}"` : ""
      const stateKeys = node.states ? Object.keys(node.states) : []
      const states =
        stateKeys.length > 0 ? ` states=[${stateKeys.join(", ")}]` : ""
      const summary = nodeStringsSummary(workspace, ref.id)
      const values = summary ? ` {${summary}}` : ""
      lines.push(`${indent}- ${ref.id} [${kind}]${label}${states}${values}`)
    } else {
      lines.push(`${indent}- ${ref.id} (no node entry)`)
    }
    if (depth < maxDepth && ref.children && ref.children.length > 0) {
      walkTree(ref.children, workspace, depth + 1, lines, visited, maxDepth)
    }
  }
}

/** Collects the resolved catalog ids from a set of visited nodes. */
function collectCatalogIds(
  visited: EntryNode[],
  workspace: Workspace,
): Set<string> {
  const ids = new Set<string>()
  for (const node of visited) {
    const catalogId = getNodeCatalogId(node, workspace)
    if (catalogId) ids.add(catalogId)
  }
  return ids
}

/**
 * Context section: Active board.
 *
 * The agent edits what the user is looking at, not the whole file. Scoping the
 * context to the single active board is a deliberate guardrail: it hands the
 * model the ids and structure for the canvas in front of the user and withholds
 * everything else, so it cannot silently retarget a similar node on another
 * board. Each variant column is listed on its own because a shared node id can
 * appear in several variants, and the model must pick the right column.
 *
 * This section returns its lines together with the catalog ids found while
 * walking the tree. The vocabulary and shape sections describe exactly those
 * components, so gathering the ids here avoids a second walk and keeps the two
 * downstream sections aligned with what is actually on screen.
 */
export function activeBoardSection(
  workspace: Workspace,
  resolvedKey: BoardKey,
  activeBoard: Board,
): { lines: string[]; treeCatalogIds: Set<string> } {
  const lines: string[] = []
  const treeCatalogIds = new Set<string>()

  const catalogId =
    "catalogId" in activeBoard ? activeBoard.catalogId : "(unknown)"
  lines.push(
    "",
    "The context is scoped to the active board the user is viewing. Only its nodes, states, and variants below are in scope. Refuse targets outside it.",
  )
  lines.push(
    "",
    `Active board: ${resolvedKey} -> ${catalogId} -> "${activeBoard.label}"`,
  )

  const customStates = workspace.metadata.customStates ?? []
  if (customStates.length > 0) {
    lines.push(
      `Custom states (state keys usable in a node's states map): ${customStates
        .map((state) => `${state.key} "${state.label}"`)
        .join(", ")}`,
    )
  }

  lines.push(
    "Node trees per variant (use these ids for nodeId / parentId / instanceId / variantId):",
  )
  const visited: EntryNode[] = []
  activeBoard.variants.forEach((variantRef, index) => {
    const variantNode = workspace.nodes[variantRef.id]
    const variantLabel = variantNode?.label ? ` "${variantNode.label}"` : ""
    const defaultTag = index === 0 ? " (default)" : ""
    lines.push(`Variant ${variantRef.id}${variantLabel}${defaultTag}:`)
    walkTree([variantRef], workspace, 1, lines, visited)
  })

  for (const node of visited) {
    const nodeCatalogId = getNodeCatalogId(node, workspace)
    if (nodeCatalogId) treeCatalogIds.add(nodeCatalogId)
  }

  return { lines, treeCatalogIds }
}

/**
 * Context section: Active variant (tier 1).
 *
 * The narrowest editing scope: a single variant subtree, the one the selection
 * sits in. It hands the model just that column's ids so the common "change this"
 * edit needs no wider context. Returns empty lines when the id is not a variant
 * root on the active board, so the caller falls back to the whole board.
 */
export function activeVariantSection(
  workspace: Workspace,
  resolvedKey: BoardKey,
  activeBoard: Board,
  variantId: string,
): { lines: string[]; treeCatalogIds: Set<string> } {
  const lines: string[] = []
  const treeCatalogIds = new Set<string>()
  if (activeBoard.type !== "component") return { lines, treeCatalogIds }

  const variantRef = activeBoard.variants.find((ref) => ref.id === variantId)
  if (!variantRef) return { lines, treeCatalogIds }

  const variantNode = workspace.nodes[variantRef.id]
  const variantLabel = variantNode?.label ? ` "${variantNode.label}"` : ""
  const defaultTag =
    activeBoard.variants[0]?.id === variantRef.id ? " (default)" : ""
  lines.push(
    "",
    "The context is scoped to the active variant the user has selected. Only its nodes below are in scope for a direct edit.",
    "",
    `Active board: ${resolvedKey} -> ${activeBoard.catalogId} -> "${activeBoard.label}"`,
    `Active variant ${variantRef.id}${variantLabel}${defaultTag} (use these ids for nodeId / parentId / instanceId / variantId):`,
  )

  const visited: EntryNode[] = []
  walkTree([variantRef], workspace, 1, lines, visited)
  for (const node of visited) {
    const nodeCatalogId = getNodeCatalogId(node, workspace)
    if (nodeCatalogId) treeCatalogIds.add(nodeCatalogId)
  }

  return { lines, treeCatalogIds }
}

/**
 * Context section: Selection subtree (instance scope).
 *
 * The narrowest scope of all: the selected node and everything under it, with no
 * parents or siblings. An instance edit is a local override, so the model rarely
 * needs the wider column. It walks down from the node's tree ref on the active
 * board and returns empty lines when the id is not on the board, so the caller
 * can fall back to the variant subtree.
 */
export function nodeSubtreeSection(
  workspace: Workspace,
  resolvedKey: BoardKey,
  activeBoard: Board,
  nodeId: string,
): { lines: string[]; treeCatalogIds: Set<string> } {
  const lines: string[] = []
  if (activeBoard.type !== "component") {
    return { lines, treeCatalogIds: new Set<string>() }
  }

  let target: ComponentTreeRef | undefined
  walkBoardTreeRefs(activeBoard.variants, (ref) => {
    if (ref.id !== nodeId) return
    target = ref
    return true
  })
  if (!target) return { lines, treeCatalogIds: new Set<string>() }

  const node = workspace.nodes[nodeId]
  const label = node?.label ? ` "${node.label}"` : ""
  lines.push(
    "",
    "The context is scoped to the selected node and its descendants. Only the ids below are in scope for a direct edit.",
    "",
    `Active board: ${resolvedKey} -> ${activeBoard.catalogId} -> "${activeBoard.label}"`,
    `Selection subtree ${nodeId}${label} (use these ids for nodeId / parentId / instanceId):`,
  )

  const visited: EntryNode[] = []
  walkTree([target], workspace, 1, lines, visited)
  return { lines, treeCatalogIds: collectCatalogIds(visited, workspace) }
}

/**
 * Context section: Workspace (shallow).
 *
 * Broad, cross-board work starts with a wide but shallow map: every component
 * board walked only a few levels deep, so the model can locate the right board
 * before drilling in. Deeper nodes stay behind widen_scope, describe_node, and
 * get_active_board, keeping the initial prompt small.
 */
export function workspaceShallowSection(
  workspace: Workspace,
  maxDepth: number = 3,
): { lines: string[]; treeCatalogIds: Set<string> } {
  const lines: string[] = [
    "",
    `Workspace boards (each walked ${maxDepth} levels deep; call widen_scope, describe_node, or get_active_board to go deeper):`,
  ]
  const visited: EntryNode[] = []
  for (const [boardKey, board] of Object.entries(workspace.boards)) {
    if (board.type !== "component") continue
    lines.push(`Board ${boardKey} -> ${board.catalogId} -> "${board.label}":`)
    const defaultVariant = board.variants[0]
    if (defaultVariant) {
      walkTree([defaultVariant], workspace, 1, lines, visited, maxDepth)
    }
  }
  return { lines, treeCatalogIds: collectCatalogIds(visited, workspace) }
}
