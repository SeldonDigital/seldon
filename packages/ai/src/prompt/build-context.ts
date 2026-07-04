import { catalog } from "@seldon/core/components/catalog"
import type {
  BoardKey,
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"

/** Walks a component tree, emitting one indented line per node with its id, level, and template. */
function walkTree(
  refs: ComponentTreeRef[],
  nodes: Record<EntryNodeId, EntryNode>,
  depth: number,
  lines: string[],
): void {
  for (const ref of refs) {
    const node = nodes[ref.id]
    const indent = "  ".repeat(depth)
    if (node) {
      const label = node.label ? ` label="${node.label}"` : ""
      lines.push(
        `${indent}- ${ref.id} [${node.level}] template=${node.template}${label}`,
      )
    } else {
      lines.push(`${indent}- ${ref.id} (no node entry)`)
    }
    if (ref.children && ref.children.length > 0) {
      walkTree(ref.children, nodes, depth + 1, lines)
    }
  }
}

/** Every component catalog id the agent may create through add_component_and_insert_default_instance. */
function catalogComponentIds(): string[] {
  return [
    ...catalog.frames,
    ...catalog.primitives,
    ...catalog.elements,
    ...catalog.parts,
    ...catalog.modules,
    ...catalog.screens,
  ].map((schema) => schema.id)
}

/**
 * Builds a compact grounding summary for the model. It deliberately omits raw
 * property overrides and the full node map: the model needs identity and
 * structure, not the entire file. Emits the component boards, the active board's
 * node tree with ids to target, the theme ids, and the catalog component ids.
 */
export function buildContext(
  workspace: Workspace,
  activeBoardKey?: BoardKey,
): string {
  const lines: string[] = []

  lines.push(`Workspace: "${workspace.metadata.label ?? "Untitled"}"`)

  const componentBoards = Object.entries(workspace.boards).filter(
    ([, board]) => board.type === "component",
  )

  lines.push("", "Component boards (boardKey -> catalogId -> label):")
  if (componentBoards.length === 0) {
    lines.push("- (none yet)")
  }
  for (const [key, board] of componentBoards) {
    const catalogId =
      "catalogId" in board ? board.catalogId : "(unknown)"
    lines.push(`- ${key} -> ${catalogId} -> "${board.label}"`)
  }

  const resolvedKey =
    activeBoardKey && workspace.boards[activeBoardKey]
      ? activeBoardKey
      : componentBoards[0]?.[0]

  const activeBoard = resolvedKey ? workspace.boards[resolvedKey] : undefined
  if (activeBoard && activeBoard.type === "component") {
    lines.push("", `Active board: ${resolvedKey}`)
    const rootRef = activeBoard.variants[0]
    if (rootRef) {
      lines.push(`Default variant root id: ${rootRef.id}`)
      lines.push(
        "Node tree (use these ids for nodeId / parentId / instanceId / variantId):",
      )
      walkTree([rootRef], workspace.nodes, 0, lines)
    }
  }

  const themeIds = Object.keys(workspace.themes)
  if (themeIds.length > 0) {
    lines.push("", "Theme ids (use as themeId for set_theme_override):")
    lines.push(themeIds.join(", "))
  }

  lines.push(
    "",
    "Component catalog ids (use as boardKey for add_component_and_insert_default_instance):",
  )
  lines.push(catalogComponentIds().join(", "))

  return lines.join("\n")
}
