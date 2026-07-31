import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

/**
 * Deterministic spatial labels for nodes, computed from real tree geometry.
 * The embedding rank matches a user's spatial phrasing ("second from the
 * top", "last button") against these canonical labels, so the counting is
 * done here in code -- the model and the embeddings only ever match wording,
 * never do arithmetic. Ported from the terminus research branch's
 * NodeStringifier, trimmed to sibling-relative labels.
 */

const ORDINALS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
] as const

/**
 * Above this many siblings, "third" and "middle" start carrying information;
 * below it they duplicate the edge labels that already apply.
 */
const MANY_SIBLINGS_THRESHOLD = 4

/** Fewer siblings than this and position carries no information at all. */
const MINIMUM_SIBLINGS_TO_LABEL = 2

interface SiblingPosition {
  parentId: string
  index: number
  count: number
  /** Directional reference pair from the parent's orientation. */
  references: readonly [string, string]
}

/**
 * The directional reference pair for a parent's children: a horizontal
 * container reads left/right, everything else reads top/bottom. Orientation
 * is read from the parent node's own property override when present;
 * anything unresolved defaults to vertical, which matches the editor's
 * default stacking.
 */
function referencesFor(
  workspace: Workspace,
  parentId: string,
): readonly [string, string] {
  const parentNode = workspace.nodes[parentId] as
    | { overrides?: Record<string, unknown> }
    | undefined
  const orientationOverride = parentNode?.overrides?.orientation as
    | { value?: unknown }
    | undefined
  const parentStacksHorizontally = orientationOverride?.value === "horizontal"
  if (parentStacksHorizontally) return ["left", "right"] as const
  return ["top", "bottom"] as const
}

/** Sibling positions for every node on the board, in one walk. */
function siblingPositions(
  workspace: Workspace,
  boardKey: BoardKey,
): Map<string, SiblingPosition> {
  const positionsByNodeId = new Map<string, SiblingPosition>()
  const activeBoard = workspace.boards[boardKey]
  const boardHasNoVariantTrees =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard))
  if (boardHasNoVariantTrees) return positionsByNodeId
  walkBoardTreeRefs(activeBoard.variants, (ref) => {
    const childRefs = ref.children ?? []
    const refIsALeaf = childRefs.length === 0
    if (refIsALeaf) return
    const references = referencesFor(workspace, ref.id)
    childRefs.forEach((child, childIndex) => {
      positionsByNodeId.set(child.id, {
        parentId: ref.id,
        index: childIndex,
        count: childRefs.length,
        references,
      })
    })
  })
  return positionsByNodeId
}

/**
 * The base positional phrase for one index among siblings: "top" / "left",
 * "second", "middle", "second last", "bottom" / "right", or an ordinal
 * fallback like "fourth from the top".
 */
function baseReference(position: SiblingPosition): string {
  const { index, count, references } = position
  const hasManySiblings = count > MANY_SIBLINGS_THRESHOLD

  const isFirstChild = index === 0
  if (isFirstChild) return references[0]
  const isLastChild = index === count - 1
  if (isLastChild) return references[1]
  const isSecondChild = index === 1
  if (isSecondChild) return "second"
  const isThirdOfManySiblings = index === 2 && hasManySiblings
  if (isThirdOfManySiblings) return "third"
  const isSecondToLastChild = index === count - 2
  if (isSecondToLastChild) return "second last"
  const isMiddleOfManySiblings =
    hasManySiblings && index === Math.floor(count / 2)
  if (isMiddleOfManySiblings) return "middle"

  const ordinal = ORDINALS[index] ?? `${index + 1}th`
  return `${ordinal} from the ${references[0]}`
}

/**
 * Synonyms from the front and back so more phrasings land: the first child is
 * also "first" and "top-most"/"left-most", the last also "last" and
 * "bottom-most"/"right-most", plus "second"/"second last" near the edges.
 */
function synonyms(position: SiblingPosition): string[] {
  const { index, count, references } = position
  const synonymWords: string[] = []
  const isFirstChild = index === 0
  const isSecondChild = index === 1
  if (isFirstChild) {
    synonymWords.push("first", `${references[0]}-most`)
  } else if (isSecondChild) {
    synonymWords.push("second")
  }
  const positionFromEnd = count - index
  const isLastChild = positionFromEnd === 1
  const isSecondToLastChild = positionFromEnd === 2
  if (isLastChild) {
    synonymWords.push("last", `${references[1]}-most`)
  } else if (isSecondToLastChild) {
    synonymWords.push("second last")
  }
  return synonymWords
}

/**
 * The canonical spatial label for every requested node: the base positional
 * phrase plus its synonyms, comma-joined ("top, first, top-most"). Nodes with
 * no siblings (roots, only children) label as "" -- position carries no
 * information there and would only add noise to the embedding text.
 */
export function spatialLabels(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  nodeIds: readonly string[],
): Map<string, string> {
  const labelsByNodeId = new Map<string, string>()
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) {
    for (const nodeId of nodeIds) labelsByNodeId.set(nodeId, "")
    return labelsByNodeId
  }
  const positionsByNodeId = siblingPositions(workspace, boardKey)
  for (const nodeId of nodeIds) {
    const position = positionsByNodeId.get(nodeId)
    const nodeHasNoLabelableSiblings =
      position === undefined || position.count < MINIMUM_SIBLINGS_TO_LABEL
    if (nodeHasNoLabelableSiblings) {
      labelsByNodeId.set(nodeId, "")
      continue
    }
    const labelParts = [baseReference(position), ...synonyms(position)]
    labelsByNodeId.set(nodeId, [...new Set(labelParts)].join(", "))
  }
  return labelsByNodeId
}
