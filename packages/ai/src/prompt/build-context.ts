import { catalog, findComponentSchema } from "@seldon/core/components/catalog"
import { rules } from "@seldon/core/rules/config/rules.config"
import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import { getPropertyStatus } from "@seldon/core/workspace/helpers/properties/property-status"
import type {
  Board,
  BoardKey,
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"

/** Options controlling what the grounding context foregrounds. */
export interface BuildContextOptions {
  /** Board the user is looking at. Its node tree is summarized for grounding. */
  activeBoardKey?: BoardKey
  /** Node selected on the canvas, surfaced as the primary target with its properties. */
  selectedNodeId?: string
  /** Variant-root column of the selected node, for shared-id disambiguation. */
  selectedNodeRootId?: string
}

/**
 * Walks a component tree, emitting one indented line per node with its id,
 * level, and template, and collecting the nodes it visits so the caller can
 * resolve their catalog ids for the property vocabulary.
 */
function walkTree(
  refs: ComponentTreeRef[],
  nodes: Record<EntryNodeId, EntryNode>,
  depth: number,
  lines: string[],
  visited: EntryNode[],
): void {
  for (const ref of refs) {
    const node = nodes[ref.id]
    const indent = "  ".repeat(depth)
    if (node) {
      visited.push(node)
      const label = node.label ? ` label="${node.label}"` : ""
      lines.push(
        `${indent}- ${ref.id} [${node.level}] template=${node.template}${label}`,
      )
    } else {
      lines.push(`${indent}- ${ref.id} (no node entry)`)
    }
    if (ref.children && ref.children.length > 0) {
      walkTree(ref.children, nodes, depth + 1, lines, visited)
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
 * Lists the settable property keys for each component that appears in the
 * active tree. Reads live from `findComponentSchema`, so the vocabulary always
 * matches core. The model must only set keys listed here.
 */
function propertyVocabularyLines(catalogIds: Set<string>): string[] {
  const lines: string[] = []
  for (const catalogId of [...catalogIds].sort()) {
    const schema = findComponentSchema(catalogId)
    if (!schema) continue
    const keys = schema.properties ? Object.keys(schema.properties) : []
    lines.push(`- ${catalogId} [${schema.level}]: ${keys.join(", ") || "(none)"}`)
  }
  return lines
}

/** Serializes the hierarchy rules so the model only nests legal levels. */
function hierarchyLines(): string[] {
  const lines: string[] = []
  for (const [level, config] of Object.entries(rules.componentLevels)) {
    const mayContain = config.mayContain
    lines.push(
      `- ${level}: ${mayContain.length > 0 ? mayContain.join(", ") : "(nothing)"}`,
    )
  }
  return lines
}

/** Theme token scopes worth referencing from component properties. */
const TOKEN_SCOPES = [
  "swatch",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "size",
  "margin",
  "padding",
  "gap",
  "corners",
  "borderWidth",
  "font",
  "border",
  "gradient",
  "shadow",
] as const

/**
 * Lists the real theme token ids for the workspace so `@scope.key` references
 * resolve. Uses one representative computed theme, since the reserved token key
 * sets are shared across themes.
 */
function themeTokenLines(workspace: Workspace): string[] {
  try {
    const computed = computeWorkspaceThemes(workspace)
    const theme = computed[0]
    if (!theme) return []
    const lines: string[] = []
    for (const scope of TOKEN_SCOPES) {
      const table = (theme as unknown as Record<string, unknown>)[scope]
      if (!table || typeof table !== "object") continue
      const keys = Object.keys(table as Record<string, unknown>)
      if (keys.length === 0) continue
      lines.push(`@${scope}: ${keys.join(", ")}`)
    }
    return lines
  } catch {
    return []
  }
}

/** Compact serialization of a tagged property value for the selection block. */
function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "type" in value) {
    const tagged = value as { type?: unknown; value?: unknown }
    return `${String(tagged.type)}:${JSON.stringify(tagged.value)}`
  }
  const json = JSON.stringify(value)
  return json.length > 80 ? `${json.slice(0, 80)}…` : json
}

/**
 * Describes the node the user selected on the canvas: its identity, parent,
 * children, and the properties currently set or overridden with their status.
 * This is the primary target for requests like "change this".
 */
function selectionLines(
  workspace: Workspace,
  board: Board | undefined,
  selectedNodeId: string,
  selectedNodeRootId?: string,
): string[] {
  const node = workspace.nodes[selectedNodeId]
  if (!node) return []

  const lines: string[] = []
  const catalogId = getNodeCatalogId(node, workspace)
  const label = node.label ? ` label="${node.label}"` : ""
  lines.push(
    `Selected node: ${selectedNodeId} [${node.level}]${catalogId ? ` catalogId=${catalogId}` : ""}${label}`,
  )
  if (selectedNodeRootId) {
    lines.push(`Selected in variant column: ${selectedNodeRootId}`)
  }

  const parentId = getImmediateParentIdInWorkspace(workspace, selectedNodeId)
  lines.push(`Parent: ${parentId ?? "(root)"}`)

  if (board) {
    const childIds = getChildrenIds(board, selectedNodeId)
    if (childIds.length > 0) {
      lines.push(`Children: ${childIds.join(", ")}`)
    }
  }

  try {
    const effective = getEffectiveProperties(selectedNodeId, workspace)
    const status = getPropertyStatus(selectedNodeId, workspace)
    const keys = Object.keys(effective).filter(
      (key) => status[key] === "set" || status[key] === "override",
    )
    if (keys.length > 0) {
      lines.push("Current properties (key = value (status)):")
      for (const key of keys) {
        const value = (effective as Record<string, unknown>)[key]
        lines.push(`- ${key} = ${summarizeValue(value)} (${status[key]})`)
      }
    }
  } catch {
    // Selected id is not a property-bearing node; skip its property summary.
  }

  return lines
}

/**
 * Builds a compact grounding summary for the model. It deliberately omits raw
 * property overrides and the full node map: the model needs identity and
 * structure, not the entire file. Emits the component boards, the active board's
 * node tree with ids to target, the selected node with its current properties,
 * the property vocabulary for components in that tree, the hierarchy rules, the
 * theme ids and token ids, and the catalog component ids.
 */
export function buildContext(
  workspace: Workspace,
  options: BuildContextOptions = {},
): string {
  const { activeBoardKey, selectedNodeId, selectedNodeRootId } = options
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

  lines.push(
    "",
    "Board variants (boardKey -> variant ids and labels; target a variant by its id):",
  )
  for (const [key, board] of componentBoards) {
    if (board.type !== "component") continue
    const entries = board.variants.map((ref, index) => {
      const node = workspace.nodes[ref.id]
      const label = node?.label ? ` "${node.label}"` : ""
      return `${ref.id}${label}${index === 0 ? " (default)" : ""}`
    })
    lines.push(`- ${key}: ${entries.join(", ")}`)
  }

  const resolvedKey =
    activeBoardKey && workspace.boards[activeBoardKey]
      ? activeBoardKey
      : componentBoards[0]?.[0]

  const activeBoard = resolvedKey ? workspace.boards[resolvedKey] : undefined
  const treeCatalogIds = new Set<string>()
  if (activeBoard && activeBoard.type === "component") {
    lines.push("", `Active board: ${resolvedKey}`)
    lines.push(
      "Node trees per variant (use these ids for nodeId / parentId / instanceId / variantId):",
    )
    const visited: EntryNode[] = []
    activeBoard.variants.forEach((variantRef, index) => {
      const variantNode = workspace.nodes[variantRef.id]
      const variantLabel = variantNode?.label ? ` "${variantNode.label}"` : ""
      const defaultTag = index === 0 ? " (default)" : ""
      lines.push(`Variant ${variantRef.id}${variantLabel}${defaultTag}:`)
      walkTree([variantRef], workspace.nodes, 1, lines, visited)
    })
    for (const node of visited) {
      const catalogId = getNodeCatalogId(node, workspace)
      if (catalogId) treeCatalogIds.add(catalogId)
    }
  }

  if (selectedNodeId) {
    const selection = selectionLines(
      workspace,
      activeBoard,
      selectedNodeId,
      selectedNodeRootId,
    )
    if (selection.length > 0) {
      lines.push("", ...selection)
    }
  }

  if (treeCatalogIds.size > 0) {
    lines.push(
      "",
      "Property vocabulary (component -> settable property keys; only set keys listed here):",
    )
    lines.push(...propertyVocabularyLines(treeCatalogIds))
  }

  lines.push("", "Hierarchy (level -> may contain):")
  lines.push(...hierarchyLines())

  const themeIds = Object.keys(workspace.themes)
  if (themeIds.length > 0) {
    lines.push("", "Theme ids (use as themeId for set_theme_override):")
    lines.push(themeIds.join(", "))
  }

  const tokenLines = themeTokenLines(workspace)
  if (tokenLines.length > 0) {
    lines.push(
      "",
      "Theme tokens (reference as @scope.key, for example @swatch.primary):",
    )
    lines.push(...tokenLines)
  }

  lines.push(
    "",
    "Component catalog ids (use as boardKey for add_component_and_insert_default_instance):",
  )
  lines.push(catalogComponentIds().join(", "))

  return lines.join("\n")
}
