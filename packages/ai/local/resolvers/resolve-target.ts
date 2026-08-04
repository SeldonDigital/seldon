import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import {
  matchNodeStrings,
  nodeAuthoredContent,
} from "../../prompt/context-sections/node-strings"
import type { MessageReason } from "../../types"
import type { SelectionScope } from "../../types"
import { describeNodeInWords } from "../node-words"

/** How the model names a node to edit: the current selection or an explicit id. */
export type TargetSpec = "selection" | { nodeId: string }

/**
 * Outcome of resolving a target. `resolved` carries the node id to write.
 * `message` is a terminal directive the caller returns verbatim: a
 * clarification, a candidate list, a permission ask, or a not-found. No edit
 * happens on a `message`, so a scope miss ends in one deterministic step
 * instead of a re-search loop. This is the uniform disambiguation contract
 * every resolver in this package follows: resolve, or hand back one terminal
 * message -- never guess.
 */
/**
 * Why a resolution ended in a message rather than a node. These call for
 * opposite responses -- "several" hands the user a pick list, "not-found"
 * means try a different phrase, "no-target" means nothing was even searched
 * for -- so they must stay distinguishable. Merging them is how a broken
 * outcome reads as a working one.
 */
export type { MessageReason } from "../../types"

export type TargetResolution =
  | { kind: "resolved"; nodeId: string }
  /**
   * A class reference resolved to every match on the active board. Only the
   * plural path produces this; a family handler that cannot act on a set
   * refuses explicitly rather than picking one.
   */
  | { kind: "resolved-many"; nodeIds: string[] }
  | {
      kind: "message"
      text: string
      reason: MessageReason
      /** The pick list as data, when the reason is "several". */
      candidateIds?: string[]
    }

interface NodeMatch {
  id: string
  boardKey: string
  boardLabel: string
  catalogId: string
  label: string
  snippet: string | null
  inActiveBoard: boolean
}

const MATCH_LIMIT = 10

/** Collects every node id listed in a board's variant trees. */
function boardNodeIds(workspace: Workspace, boardKey: BoardKey): Set<string> {
  const ids = new Set<string>()
  const board = workspace.boards[boardKey]
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board)))
    return ids
  walkBoardTreeRefs(board.variants, (ref) => {
    ids.add(ref.id)
  })
  return ids
}

/** Every node id in the subtree rooted at `rootId` on a component board. */
function subtreeNodeIds(
  workspace: Workspace,
  boardKey: BoardKey,
  rootId: string,
): Set<string> {
  const ids = new Set<string>()
  const board = workspace.boards[boardKey]
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board)))
    return ids

  const root = findRef(board.variants, rootId)
  if (!root) return ids

  walkBoardTreeRefs([root], (ref) => {
    ids.add(ref.id)
  })
  return ids
}

/** The first tree ref with the given id, searched depth-first. */
function findRef(
  refs: Parameters<typeof walkBoardTreeRefs>[0],
  id: string,
): Parameters<Parameters<typeof walkBoardTreeRefs>[1]>[0] | undefined {
  let found: Parameters<Parameters<typeof walkBoardTreeRefs>[1]>[0] | undefined
  walkBoardTreeRefs(refs, (ref) => {
    if (ref.id !== id) return
    found = ref
    return true
  })
  return found
}

/**
 * The matches for `query` that lie within the selected node's own subtree. A
 * request like "its title" should resolve into the selection's descendants
 * before the search widens outward, so a same-named node on another board never
 * wins over the part the user pointed at.
 */
function searchSubtree(
  workspace: Workspace,
  boardKey: BoardKey,
  rootId: string,
  query: string,
): NodeMatch[] {
  const ids = subtreeNodeIds(workspace, boardKey, rootId)
  if (ids.size === 0) return []
  return searchWorkspace(workspace, query, boardKey).filter((match) =>
    ids.has(match.id),
  )
}

/** Searches every component board for nodes whose label or catalog id matches. */
function searchWorkspace(
  workspace: Workspace,
  query: string,
  activeKey: BoardKey | undefined,
): NodeMatch[] {
  const needle = query.trim().toLowerCase()
  if (needle === "") return []
  const activeIds =
    activeKey !== undefined ? boardNodeIds(workspace, activeKey) : new Set()

  const matches: NodeMatch[] = []
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue
    walkBoardTreeRefs(board.variants, (ref) => {
      const node = workspace.nodes[ref.id]
      if (!node) return
      const catalogId = getNodeCatalogId(node, workspace) ?? ""
      const label = node.label ?? ""
      const byName =
        label.toLowerCase().includes(needle) ||
        catalogId.toLowerCase().includes(needle)
      const snippet = byName
        ? null
        : matchNodeStrings(workspace, ref.id, needle)
      if (!byName && snippet === null) return
      matches.push({
        id: ref.id,
        boardKey: key,
        boardLabel: board.label,
        catalogId,
        label,
        snippet,
        inActiveBoard: activeIds.has(ref.id),
      })
    })
  }
  return matches
}

/**
 * Naive singular variants of a class phrase, so "chips" matches nodes whose
 * catalog id or label is "chip". Deliberately dumb -- strip "es" then "s" --
 * because the phrase and the vocabulary are both English design nouns, and a
 * wrong variant merely matches nothing.
 */
function needleVariants(phrase: string): string[] {
  const needle = phrase.trim().toLowerCase()
  const variants = new Set([needle])
  if (needle.endsWith("es")) variants.add(needle.slice(0, -2))
  if (needle.endsWith("s")) variants.add(needle.slice(0, -1))
  return [...variants].filter((variant) => variant !== "")
}

/**
 * The class path: a plural reference resolves to EVERY match on the active
 * board, by predicate, not by ranking. There is nothing to disambiguate --
 * the set is the answer -- so no model call and no similarity threshold is
 * involved. Zero matches is the only failure.
 */
export function resolveClassTarget(
  workspace: Workspace,
  activeKey: BoardKey | undefined,
  phrase: string,
): TargetResolution {
  if (activeKey === undefined) {
    return {
      kind: "message",
      text: "No board is active, so there is no set of elements to match. Open a board first.",
      reason: "no-target",
    }
  }
  const matchedIds = new Set<string>()
  for (const variant of needleVariants(phrase)) {
    for (const match of searchWorkspace(workspace, variant, activeKey)) {
      if (match.inActiveBoard) matchedIds.add(match.id)
    }
  }
  // "Text" is a user word before it is a catalog kind: a list item whose
  // sentence the user typed IS "a text" to the user, but its kind is
  // listItem, so kind matching alone bolds the chip labels instead of the
  // sentences (observed live). Authored content is the discriminator, and
  // the catalog's shipped template column never counts: the default
  // variant's numbered "List item N" overrides are authored by the catalog,
  // not by anyone the user means.
  const phraseNamesTexts = needleVariants(phrase).includes("text")
  if (phraseNamesTexts) {
    const activeBoard = workspace.boards[activeKey]
    const boardHasVariants =
      activeBoard &&
      (isComponentBoard(activeBoard) || isAuthoredBoard(activeBoard))
    if (boardHasVariants) {
      for (const variantRef of activeBoard.variants) {
        const variantRoot = workspace.nodes[variantRef.id]
        const variantIsTheCatalogTemplate = variantRoot?.type === "default"
        if (variantIsTheCatalogTemplate) continue
        walkBoardTreeRefs([variantRef], (ref) => {
          const authoredContent = nodeAuthoredContent(workspace, ref.id)
          if (authoredContent !== undefined) matchedIds.add(ref.id)
        })
      }
    }
  }
  if (matchedIds.size === 0) {
    return {
      kind: "message",
      text: `No elements on this board match "${phrase}". Name the elements you mean, or select one on the canvas and ask again.`,
      reason: "not-found",
    }
  }
  return { kind: "resolved-many", nodeIds: [...matchedIds] }
}

/**
 * How one candidate reads in a pick list the user sees. The old form was built
 * for the removed free-tool-calling loop -- `component-text-h8 ("Text" text)
 * value="..." on board list "Lists"` -- and every message that uses it now
 * reaches the user word for word, so the internal id and board key are gone
 * and the content they can actually see on the canvas leads. The board name is
 * only worth the words when the candidates span boards.
 */
function describeMatch(
  workspace: Workspace,
  match: NodeMatch,
  options: { includeBoard: boolean },
): string {
  // The catalog kind and label alone repeat: five list texts all read "the
  // Text". What tells them apart is the sentence someone typed onto each,
  // which is exactly what describeNodeInWords leads with.
  const nameInWords = describeNodeInWords(workspace, match.id)
  // A value match ("hsl(202 50% 95%)") is why this node is in the list at
  // all, so it is named -- unless the description already showed it.
  const matchedValueIsAlreadyShown =
    match.snippet === null || nameInWords.includes(match.snippet)
  const valueNote = matchedValueIsAlreadyShown
    ? ""
    : ` (matching "${match.snippet}")`
  const boardPart = options.includeBoard
    ? ` on the "${match.boardLabel}" board`
    : ""
  return `${nameInWords}${valueNote}${boardPart}`
}

/** The pick list itself, bounded and bulleted. */
function describePickList(
  workspace: Workspace,
  matches: NodeMatch[],
  options: { includeBoard: boolean },
): string {
  return matches
    .slice(0, MATCH_LIMIT)
    .map((match) => `- ${describeMatch(workspace, match, options)}`)
    .join("\n")
}

/** The closing line every ask ends on, so the user hears one way to answer. */
export const HOW_TO_ANSWER =
  "Tell me which one you mean, or select it on the canvas and ask again."

/**
 * Widens once to a workspace lookup and reports one outcome. A single match in
 * the active board resolves; a single match elsewhere returns a permission ask,
 * upholding the tier-3 gate; several matches return a short pick list; none
 * returns a not-found. Never resolves silently to an off-screen node. Workspace
 * scope relaxes the gate: the user selected the whole workspace, so a single
 * off-board match resolves directly instead of returning the permission ask.
 */
function widen(
  workspace: Workspace,
  query: string,
  activeKey: BoardKey | undefined,
  scope: SelectionScope | undefined,
): TargetResolution {
  const matches = searchWorkspace(workspace, query, activeKey)
  if (matches.length === 0) {
    return {
      kind: "message",
      text: `Nothing here matches "${query}". Name the element you mean, or select it on the canvas and ask again.`,
      reason: "not-found",
    }
  }
  if (matches.length === 1) {
    const match = matches[0]
    if (match.inActiveBoard || scope === "workspace") {
      return { kind: "resolved", nodeId: match.id }
    }
    return {
      kind: "message",
      text: `The only match for "${query}" is ${describeMatch(workspace, match, { includeBoard: true })}, which isn't on the board you're working on. Open that board and ask again, or tell me to change it there.`,
      reason: "off-board",
    }
  }
  // A workspace-wide search crosses boards, so the board name earns its place.
  return {
    kind: "message",
    text: `Several elements match "${query}":\n${describePickList(workspace, matches, { includeBoard: true })}\n${HOW_TO_ANSWER}`,
    reason: "several",
    candidateIds: matches.slice(0, MATCH_LIMIT).map((match) => match.id),
  }
}

/**
 * Resolves a node target for a mutation. The selection sentinel resolves
 * only when a node is selected, so a board-only or empty selection is reported
 * as ambiguous rather than guessed. An unknown explicit id and an unresolved
 * sentinel with a `match` hint escalate once through {@link widen}.
 */
export function resolveNodeTarget(
  workspace: Workspace,
  activeKey: BoardKey | undefined,
  selectedNodeId: string | undefined,
  selectedBoardId: BoardKey | undefined,
  target: TargetSpec,
  match: string | undefined,
  scope: SelectionScope | undefined,
): TargetResolution {
  if (target === "selection") {
    // A match hint on a selected node means "a part of me": dive into the
    // selection's own subtree first, so the edit stays inside what the user
    // pointed at before the search widens outward.
    if (
      match &&
      selectedNodeId &&
      workspace.nodes[selectedNodeId] &&
      activeKey !== undefined
    ) {
      const within = searchSubtree(workspace, activeKey, selectedNodeId, match)
      if (within.length === 1) {
        return { kind: "resolved", nodeId: within[0].id }
      }
      if (within.length > 1) {
        // Every candidate sits inside the one selected element, so naming the
        // board on each line would repeat the same word ten times.
        return {
          kind: "message",
          text: `Several parts of the selection match "${match}":\n${describePickList(workspace, within, { includeBoard: false })}\n${HOW_TO_ANSWER}`,
          reason: "several",
          candidateIds: within
            .slice(0, MATCH_LIMIT)
            .map((partMatch) => partMatch.id),
        }
      }
      return widen(workspace, match, activeKey, scope)
    }
    if (selectedNodeId && workspace.nodes[selectedNodeId]) {
      return { kind: "resolved", nodeId: selectedNodeId }
    }
    if (match) return widen(workspace, match, activeKey, scope)
    const selectionNote = selectedBoardId
      ? `A board (${selectedBoardId}) is selected, not a node`
      : "Nothing is selected"
    return {
      kind: "message",
      // This text's only reader is the reply stage and then the user: keep it
      // human. The old version appended the whole active-board context here
      // (a directive for the removed free-tool-calling loop), and the reply
      // model paraphrased that blob into hallucinated nonsense (issue 06).
      text: `${selectionNote}, so I don't know which element to change. Name the element, or select it on the canvas and ask again.`,
      reason: "no-target",
    }
  }

  if (workspace.nodes[target.nodeId]) {
    return { kind: "resolved", nodeId: target.nodeId }
  }
  return widen(workspace, match ?? target.nodeId, activeKey, scope)
}
