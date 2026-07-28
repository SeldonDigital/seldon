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
  const parent = workspace.nodes[parentId] as
    | { overrides?: Record<string, unknown> }
    | undefined
  const orientation = parent?.overrides?.orientation as
    | { value?: unknown }
    | undefined
  if (orientation?.value === "horizontal") return ["left", "right"] as const
  return ["top", "bottom"] as const
}

/** Sibling positions for every node on the board, in one walk. */
function siblingPositions(
  workspace: Workspace,
  boardKey: BoardKey,
): Map<string, SiblingPosition> {
  const positions = new Map<string, SiblingPosition>()
  const board = workspace.boards[boardKey]
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board)))
    return positions
  walkBoardTreeRefs(board.variants, (ref) => {
    const children = ref.children ?? []
    if (children.length === 0) return
    const references = referencesFor(workspace, ref.id)
    children.forEach((child, index) => {
      positions.set(child.id, {
        parentId: ref.id,
        index,
        count: children.length,
        references,
      })
    })
  })
  return positions
}

/**
 * The base positional phrase for one index among siblings: "top" / "left",
 * "second", "middle", "second last", "bottom" / "right", or an ordinal
 * fallback like "fourth from the top".
 */
function baseReference(position: SiblingPosition): string {
  const { index, count, references } = position
  if (index === 0) return references[0]
  if (index === count - 1) return references[1]
  if (index === 1) return "second"
  if (index === 2 && count > 4) return "third"
  if (index === count - 2) return "second last"
  if (count > 4 && index === Math.floor(count / 2)) return "middle"
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
  const words: string[] = []
  if (index === 0) {
    words.push("first", `${references[0]}-most`)
  } else if (index === 1) {
    words.push("second")
  }
  const reverse = count - index
  if (reverse === 1) {
    words.push("last", `${references[1]}-most`)
  } else if (reverse === 2) {
    words.push("second last")
  }
  return words
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
  const labels = new Map<string, string>()
  if (boardKey === undefined) {
    for (const id of nodeIds) labels.set(id, "")
    return labels
  }
  const positions = siblingPositions(workspace, boardKey)
  for (const id of nodeIds) {
    const position = positions.get(id)
    if (!position || position.count < 2) {
      labels.set(id, "")
      continue
    }
    const parts = [baseReference(position), ...synonyms(position)]
    labels.set(id, [...new Set(parts)].join(", "))
  }
  return labels
}
