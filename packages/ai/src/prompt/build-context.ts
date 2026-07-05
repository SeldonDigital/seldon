import { catalog, findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { BACKGROUND_KIND_VALUES } from "@seldon/core/properties/values/appearance/background/background-kind"
import { rules } from "@seldon/core/rules/config/rules.config"
import { propertyShape, SHORTHAND_SIDES } from "./property-shapes"
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
 * Walks a component tree, emitting one indented line per node with its id, its
 * level and resolved catalog id (so the model can map the node to its property
 * vocabulary), its label, and its state keys. Collects the nodes it visits so
 * the caller can gather the catalog ids present in the tree.
 */
function walkTree(
  refs: ComponentTreeRef[],
  workspace: Workspace,
  depth: number,
  lines: string[],
  visited: EntryNode[],
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
      lines.push(`${indent}- ${ref.id} [${kind}]${label}${states}`)
    } else {
      lines.push(`${indent}- ${ref.id} (no node entry)`)
    }
    if (ref.children && ref.children.length > 0) {
      walkTree(ref.children, workspace, depth + 1, lines, visited)
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
 * matches core. Non-atomic keys carry a shape tag that maps to the shapes
 * legend below. The model must only set keys listed here.
 */
function propertyVocabularyLines(catalogIds: Set<string>): string[] {
  const lines: string[] = []
  for (const catalogId of [...catalogIds].sort()) {
    const schema = findComponentSchema(catalogId)
    if (!schema) continue
    const keys = schema.properties ? Object.keys(schema.properties) : []
    const annotated = keys.map((key) => {
      const shape = propertyShape(key)
      return shape === "atomic" ? key : `${key} [${shape}]`
    })
    lines.push(
      `- ${catalogId} [${schema.level}]: ${annotated.join(", ") || "(none)"}`,
    )
  }
  return lines
}

/**
 * Describes the value shape of every non-atomic property that appears in the
 * active tree. Facet and side names come from core so the legend stays in sync.
 */
function propertyShapesLegend(catalogIds: Set<string>): string[] {
  const present = new Set<string>()
  for (const catalogId of catalogIds) {
    const schema = findComponentSchema(catalogId)
    if (!schema?.properties) continue
    for (const key of Object.keys(schema.properties)) {
      if (propertyShape(key) !== "atomic") present.add(key)
    }
  }
  if (present.size === 0) return []
  const lines: string[] = []
  for (const key of [...present].sort()) {
    const shape = propertyShape(key)
    if (shape === "layered" && key === "background") {
      lines.push(
        `- background: array of layers. Each layer picks a kind (${BACKGROUND_KIND_VALUES.join(", ")}), then that kind's facets. A color layer: [{ "kind": { "type": "option", "value": "color" }, "color": <theme.categorical or exact> }]`,
      )
    } else if (shape === "layered") {
      const facets = COMPOUND_FACET_DISPLAY_ORDER[key] ?? []
      lines.push(`- ${key}: array of layers. Each layer { ${facets.join(", ")} }`)
    } else if (shape === "compound") {
      const facets = COMPOUND_FACET_DISPLAY_ORDER[key] ?? []
      lines.push(`- ${key}: facet object { ${facets.join(", ")} }`)
    } else if (shape === "shorthand") {
      const sides = SHORTHAND_SIDES[key] ?? []
      lines.push(`- ${key}: side object { ${sides.join(", ")} }`)
    }
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
 * Builds a compact grounding summary for the model, scoped to the active board
 * the user is viewing. It deliberately omits other boards and the full node map:
 * the model needs identity and structure for what is on the canvas, not the
 * entire file. Emits the active board identity, its custom states, its per
 * variant node trees with state annotations and ids to target, the selected node
 * with its current properties, the property vocabulary for components in that
 * tree, the hierarchy rules, the theme ids and token ids, and the catalog
 * component ids.
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

  const resolvedKey =
    activeBoardKey && workspace.boards[activeBoardKey]
      ? activeBoardKey
      : componentBoards[0]?.[0]

  const activeBoard = resolvedKey ? workspace.boards[resolvedKey] : undefined
  const treeCatalogIds = new Set<string>()
  if (!activeBoard || activeBoard.type !== "component") {
    lines.push(
      "",
      "No active board is selected. Ask the user to open or select a board, and do not edit anything until one is active.",
    )
  } else {
    const catalogId = "catalogId" in activeBoard ? activeBoard.catalogId : "(unknown)"
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
    const shapeLines = propertyShapesLegend(treeCatalogIds)
    if (shapeLines.length > 0) {
      lines.push(
        "",
        "Property value shapes (set the facet or layer shown, never a flat value on the parent):",
      )
      lines.push(...shapeLines)
    }
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
