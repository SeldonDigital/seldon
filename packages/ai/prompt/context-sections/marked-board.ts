import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type {
  Board,
  ComponentTreeRef,
  Workspace,
} from "@seldon/core/workspace/types"

import { nodeAuthoredContent } from "./node-strings"

/**
 * The active board rendered for the reference pick, with the user's selection
 * marked in place rather than passed alongside.
 *
 * Marking beats filtering. A pick shown only the selection's subtree cannot
 * know a better match sits outside it, so it takes the closest thing it can
 * see and never widens -- relevance is comparative. With the whole board in
 * front of it and the selection marked, the model prefers what the user
 * pointed at for the right reason: it has seen what it is preferring over.
 */
export interface MarkedBoardTree {
  lines: string[]
  /** Every id in the tree, in render order: the pick's answer is bounded to these. */
  nodeIds: string[]
}

const SELECTION_MARK = "  <- SELECTED"
const IN_SELECTION_MARK = "  <- inside the selection"

/** A component or authored board: both own a variant tree the agent edits. */
function isEditableComponentBoard(board: Board): boolean {
  return isComponentBoard(board) || isAuthoredBoard(board)
}

/**
 * One node's line: what it is, what it says, and where it sits among the
 * siblings of its own kind.
 *
 * The position is spelled out because the model cannot count indented lines.
 * Probed on qwen3:8b: "reset the last text's color" over a listing of five
 * texts answered with all five ids and a "found" verdict -- unable to tell
 * which one was last, it returned the cohort and called it a match. Position
 * is arithmetic over what the board already knows, so the listing states it.
 *
 * Counted within the same catalog kind, not over all children, because a
 * variant's child list carries inherited schema refs the user never sees
 * ("5 texts, then 3 list items") and counting those hands back "3 of 8" for a
 * node the user reads as the last text (issue 11). A kind cohort needs no
 * ruling on which refs render. "The last element", kind-agnostic, still has no
 * honest answer here -- that is issue 11's unresolved half, not something this
 * line can paper over.
 *
 * Deliberately narrower than `nodeSummaryTail`: that renders every string
 * property for an edit prompt, which here is noise an 8b model has to read
 * past. What identifies a node in a reference is its kind, its authored
 * content, and its position.
 */
function pickLine(
  workspace: Workspace,
  nodeId: string,
  cohortLabel: string,
  selectionMark: string,
): string {
  const node = workspace.nodes[nodeId]
  if (!node) return `- ${nodeId} (no node entry)`
  const catalogWord = getNodeCatalogId(node, workspace) ?? node.level
  const authoredContent = nodeAuthoredContent(workspace, nodeId)
  const content =
    authoredContent !== undefined ? ` says "${authoredContent}"` : ""
  const label = node.label
  const labelSaysMoreThanTheCatalogWord =
    label !== undefined && label !== "" && label.toLowerCase() !== catalogWord
  const labelPart = labelSaysMoreThanTheCatalogWord ? ` named "${label}"` : ""
  return `- ${nodeId}: ${catalogWord} ${cohortLabel}${labelPart}${content}${selectionMark}`
}

/** `2 of 5` among the siblings sharing a kind, or `only one` when alone. */
function cohortLabelsBySiblingId(
  workspace: Workspace,
  siblingRefs: readonly ComponentTreeRef[],
): Map<string, string> {
  const kindCounts = new Map<string, number>()
  for (const ref of siblingRefs) {
    const node = workspace.nodes[ref.id]
    const kind = node ? (getNodeCatalogId(node, workspace) ?? "node") : "node"
    kindCounts.set(kind, (kindCounts.get(kind) ?? 0) + 1)
  }
  const seenPerKind = new Map<string, number>()
  const labels = new Map<string, string>()
  for (const ref of siblingRefs) {
    const node = workspace.nodes[ref.id]
    const kind = node ? (getNodeCatalogId(node, workspace) ?? "node") : "node"
    const indexInKind = (seenPerKind.get(kind) ?? 0) + 1
    seenPerKind.set(kind, indexInKind)
    const kindCount = kindCounts.get(kind) ?? 1
    const nodeIsTheOnlyOneOfItsKind = kindCount === 1
    labels.set(
      ref.id,
      nodeIsTheOnlyOneOfItsKind
        ? "(the only one here)"
        : `(${indexInKind} of ${kindCount}, top to bottom)`,
    )
  }
  return labels
}

function walkMarkedTree(
  refs: readonly ComponentTreeRef[],
  workspace: Workspace,
  depth: number,
  selectedNodeId: string | undefined,
  parentIsSelectionOrInsideIt: boolean,
  tree: MarkedBoardTree,
): void {
  const cohortLabels = cohortLabelsBySiblingId(workspace, refs)
  for (const ref of refs) {
    const refIsTheSelection = ref.id === selectedNodeId
    const refSitsInsideTheSelection =
      parentIsSelectionOrInsideIt && !refIsTheSelection
    const selectionMark = refIsTheSelection
      ? SELECTION_MARK
      : refSitsInsideTheSelection
        ? IN_SELECTION_MARK
        : ""
    const indent = "  ".repeat(depth)
    tree.lines.push(
      `${indent}${pickLine(workspace, ref.id, cohortLabels.get(ref.id) ?? "", selectionMark)}`,
    )
    tree.nodeIds.push(ref.id)
    const childRefs = ref.children ?? []
    if (childRefs.length > 0) {
      walkMarkedTree(
        childRefs,
        workspace,
        depth + 1,
        selectedNodeId,
        refIsTheSelection || refSitsInsideTheSelection,
        tree,
      )
    }
  }
}

/**
 * The selected element and everything inside it, rendered the same way, for
 * the narrow first pass: most edits are about what the user is looking at, and
 * a handful of lines is a far easier read for an 8b model than a whole board.
 *
 * The pass that reads this can answer "wider" instead of picking, which is the
 * whole reason a narrow first look is safe. Without that escape hatch a small
 * candidate list is dangerous: relevance is comparative, so a model shown only
 * the selection takes the closest thing in it and never learns that a better
 * match sits outside.
 *
 * Returns empty lines when nothing is selected or the selection is not on this
 * board, so the caller goes straight to the board-wide pick.
 */
export function markedSelectionSubtree(inputs: {
  workspace: Workspace
  activeBoard: Board
  selectedNodeId: string | undefined
}): MarkedBoardTree {
  const tree: MarkedBoardTree = { lines: [], nodeIds: [] }
  const nothingIsSelected = inputs.selectedNodeId === undefined
  if (nothingIsSelected || !isEditableComponentBoard(inputs.activeBoard))
    return tree

  let selectionRef: ComponentTreeRef | undefined
  walkBoardTreeRefs(inputs.activeBoard.variants, (ref) => {
    if (ref.id !== inputs.selectedNodeId) return
    selectionRef = ref
    return true
  })
  if (!selectionRef) return tree

  walkMarkedTree(
    [selectionRef],
    inputs.workspace,
    0,
    inputs.selectedNodeId,
    false,
    tree,
  )
  return tree
}

/**
 * Renders every variant of the active board as indented lines that pair an id
 * with its kind, authored content, and position among its same-kind siblings,
 * marking the selected node and its descendants. Returns empty lines for a
 * board with no variant trees, so the caller can fall back.
 */
export function markedBoardTree(inputs: {
  workspace: Workspace
  activeBoard: Board
  selectedNodeId: string | undefined
}): MarkedBoardTree {
  const tree: MarkedBoardTree = { lines: [], nodeIds: [] }
  if (!isEditableComponentBoard(inputs.activeBoard)) return tree

  const variantCount = inputs.activeBoard.variants.length
  inputs.activeBoard.variants.forEach((variantRef, variantIndex) => {
    const variantNode = inputs.workspace.nodes[variantRef.id]
    const variantLabel = variantNode?.label ? ` "${variantNode.label}"` : ""
    const variantIsTheBoardDefault = variantIndex === 0
    const defaultTag = variantIsTheBoardDefault
      ? " (the board default, not a user variant)"
      : ""
    tree.lines.push(
      `Variant ${variantIndex + 1} of ${variantCount}: ${variantRef.id}${variantLabel}${defaultTag}`,
    )
    walkMarkedTree(
      [variantRef],
      inputs.workspace,
      1,
      inputs.selectedNodeId,
      false,
      tree,
    )
  })
  return tree
}
