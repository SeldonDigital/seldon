import type { BoardKey, Workspace } from "@seldon/core/workspace/types"
import { activeBoardSection } from "./context-sections/active-board"
import { catalogComponentsSection } from "./context-sections/catalog-components"
import { hierarchySection } from "./context-sections/hierarchy"
import { propertyShapeSection } from "./context-sections/property-shape"
import { propertyVocabularySection } from "./context-sections/property-vocabulary"
import { selectionSection } from "./context-sections/selection"
import { themeIdsSection } from "./context-sections/theme-ids"
import { themeTokensSection } from "./context-sections/theme-tokens"

/** Options controlling what the context foregrounds. */
export interface BuildContextOptions {
  /** Board the user is looking at. Its node tree is summarized in the context. */
  activeBoardKey?: BoardKey
  /** Node selected on the canvas, surfaced as the primary target with its properties. */
  selectedNodeId?: string
  /** Variant-root column of the selected node, for shared-id disambiguation. */
  selectedNodeRootId?: string
}

/**
 * Context Builder.
 *
 * Assembles the design context the model reads before it chooses actions. Each
 * context section lives in its own module under `context-sections/` and owns its
 * title; this function only resolves the active board and orders the sections.
 * The call order below is the order the sections appear in the output, so this
 * reads as the context's table of contents. Every section is derived from the
 * workspace and core, so the context never claims a capability the reducer would
 * reject, and a section that has nothing to say drops out rather than printing an
 * empty title.
 *
 * The active board is resolved here because several sections depend on it: the
 * selection is described relative to it, and the components it contains drive the
 * property vocabulary and shape sections.
 */
export function buildContext(
  workspace: Workspace,
  options: BuildContextOptions = {},
): string {
  const { activeBoardKey, selectedNodeId, selectedNodeRootId } = options
  const lines: string[] = [`Workspace: "${workspace.metadata.label ?? "Untitled"}"`]

  const componentBoards = Object.entries(workspace.boards).filter(
    ([, board]) => board.type === "component",
  )
  const resolvedKey =
    activeBoardKey && workspace.boards[activeBoardKey]
      ? activeBoardKey
      : componentBoards[0]?.[0]
  const activeBoard =
    resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined

  let treeCatalogIds = new Set<string>()
  if (!activeBoard || activeBoard.type !== "component" || resolvedKey === undefined) {
    lines.push(
      "",
      "No active board is selected. Ask the user to open or select a board, and do not edit anything until one is active.",
    )
  } else {
    const board = activeBoardSection(workspace, resolvedKey, activeBoard)
    lines.push(...board.lines)
    treeCatalogIds = board.treeCatalogIds
  }

  lines.push(...selectionSection(workspace, activeBoard, selectedNodeId, selectedNodeRootId))
  lines.push(...propertyVocabularySection(treeCatalogIds))
  lines.push(...propertyShapeSection(treeCatalogIds))
  lines.push(...hierarchySection())
  lines.push(...themeIdsSection(workspace))
  lines.push(...themeTokensSection(workspace))
  lines.push(...catalogComponentsSection())

  return lines.join("\n")
}
