import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import { buildExtractTargetStage } from "../../prompt/stages/extract-target"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * What the message points at. The two facts are independent: a message can
 * point at the selection AND name an element ("make this title red"), or do
 * neither. Choosing between them belongs to the resolver -- this stage only
 * reports what the message says, so a phrase is never discarded before
 * anything has looked at the board. The model never sees the tree here.
 */
export interface TargetHint {
  /** The message uses a pronoun, or names nothing to search for. */
  pointsAtSelection: boolean
  /** The phrase naming an element, when the message names one. */
  match?: string
  /**
   * The bare noun alone, without the describing words. The class path needs
   * this: "the top two texts" must match the board's texts by kind, and a
   * composed "top two text" phrase matches nothing. Search paths keep using
   * `match`, where the describing words are signal, not noise.
   */
  baseNode?: string
  /** The edit applies to every element of a kind, not one particular one. */
  plural: boolean
  /** A bounded plural's requested size ("the top two"), when named. */
  count?: number
}

/**
 * Rejoins the separately-asked element parts into the one phrase the search
 * path expects. The stage asks for the noun and its describing words apart so
 * a property name cannot compete with the element name for a single slot
 * (issue 07); nothing downstream reads them apart, so they are put back
 * together here. An unnamed element wins over any descriptor: describing
 * words with no noun name no element to find.
 */
function composeSearchPhrase(descriptor: string, baseNode: string): string {
  const namedElement = baseNode.trim()
  if (namedElement === "") return ""
  return `${descriptor.trim()} ${namedElement}`.trim().replace(/\s+/g, " ")
}

/** Number words a bounded reference spells out. "one" is absent on purpose: it names a single element, not a bounded class. */
const COUNT_WORDS_BY_NAME: Record<string, number> = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
}

/**
 * The bounded count read straight off the message: a number directly before
 * the noun (allowing a couple of describing words between, "the two red
 * chips"). The model keeps dropping this on trailing-modifier phrasings
 * ("the two texts about cars" -> 0, deterministically, with the exact shape
 * in its examples) -- and a count is arithmetic over words that are sitting
 * right there, so it is read in code, the same stance geometry-labels takes:
 * the model matches wording, it never counts. Also consumed by the add flow
 * ("add four chips" -> 4 inserts).
 */
export function countNamedBeforeNoun(
  message: string,
  bareNoun: string,
): number | undefined {
  const nounStem = bareNoun.split(/\s+/)[0] ?? ""
  if (nounStem === "") return undefined
  const numberWordAlternatives = [
    ...Object.keys(COUNT_WORDS_BY_NAME),
    "\\d{1,2}",
  ].join("|")
  const boundedReference = new RegExp(
    `\\b(${numberWordAlternatives})\\b(?:\\s+\\w+){0,2}?\\s+${nounStem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    "i",
  )
  const numberMatch = boundedReference.exec(message)
  if (numberMatch === null) return undefined
  const numberWord = numberMatch[1]!.toLowerCase()
  const namedCount = COUNT_WORDS_BY_NAME[numberWord] ?? Number(numberWord)
  const countBoundsAClass = namedCount >= 2
  return countBoundsAClass ? namedCount : undefined
}

/**
 * The longest board-vocabulary word the message literally contains, for when
 * the model answers an empty baseNode on a message that plainly names one.
 * Extraction is brittle to surface form -- "make the last text bold"
 * extracts "text" while its decompose rewrite "Make the last text bold."
 * extracts nothing, deterministically -- and the board knows its own kinds,
 * so an exact word-boundary scan recovers the noun without inventing
 * anything: no vocabulary word in the message, no fallback.
 */
function boardKindNamedInMessage(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  message: string,
): string | undefined {
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) return undefined
  const activeBoard = workspace.boards[boardKey]
  const boardHasNoVariantTrees =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard))
  if (boardHasNoVariantTrees) return undefined

  const kindNames = new Set<string>()
  walkBoardTreeRefs(activeBoard.variants, (ref) => {
    const node = workspace.nodes[ref.id]
    if (!node) return
    const catalogId = getNodeCatalogId(node, workspace)
    if (catalogId) kindNames.add(catalogId.toLowerCase())
    const label = (node as { label?: string }).label
    if (label) kindNames.add(label.toLowerCase())
  })

  const namedKinds = [...kindNames].filter((kindName) => {
    const kindNameAppearsWhole = new RegExp(
      `\\b${kindName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`,
      "i",
    ).test(message)
    return kindNameAppearsWhole
  })
  if (namedKinds.length === 0) return undefined
  // The longest name is the most specific: a board with "text" and
  // "hero text" resolves "the hero text" to the latter.
  return namedKinds.sort(
    (kindA, kindB) => kindB.length - kindA.length,
  )[0]
}

/**
 * Extracts a target hint from the message with one shallow call. A pronoun
 * ("it", "this") or an implicit target sets `pointsAtSelection`; an explicit
 * name ("the title", "all the chips") fills `match`. Both can be set at once.
 */
export async function extractTargetHint(
  context: TurnContext,
): Promise<TargetHint> {
  const { prompt, schema } = buildExtractTargetStage({
    message: context.message,
    hasSelection: context.resolved.selectedNodeId !== undefined,
  })

  const { value: rawHint, metrics } = await callOllamaFormat<{
    pointsAtSelection: boolean
    baseNode: string
    descriptor: string
    plural: boolean
    count: number
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "extract_target", {
    ok: true,
    prompt,
    output: JSON.stringify(rawHint, null, 2),
  })

  const extractedNoun = (rawHint.baseNode ?? "").trim()
  const bareNoun =
    extractedNoun !== ""
      ? extractedNoun
      : (boardKindNamedInMessage(
          context.state.workspace,
          context.resolved.resolvedKey,
          context.message,
        ) ?? "")
  const modelDroppedANamedKind = extractedNoun === "" && bareNoun !== ""
  if (modelDroppedANamedKind) {
    recordStep(context, "extract_target_kind_fallback", {
      ok: true,
      output: `The model extracted no element, but the message names "${bareNoun}" -- a kind on the active board. Using it as the search noun (deterministic, no model call).`,
    })
  }
  const searchPhrase = composeSearchPhrase(rawHint.descriptor ?? "", bareNoun)
  // 0 is the sentinel for "no number was named", mirroring match's "" -> undefined.
  // A count without a phrase is as meaningless as plural without one -- there
  // is no class to narrow.
  const extractedCount =
    rawHint.count > 0 ? rawHint.count : countNamedBeforeNoun(context.message, bareNoun)
  const requestedCount =
    extractedCount !== undefined && searchPhrase !== "" ? extractedCount : undefined
  return {
    pointsAtSelection: rawHint.pointsAtSelection,
    match: searchPhrase === "" ? undefined : searchPhrase,
    baseNode: bareNoun === "" ? undefined : bareNoun,
    // Plural without a phrase is meaningless: there is no class to match.
    // A named count implies plural even if the model's own boolean waffles.
    plural: (rawHint.plural || requestedCount !== undefined) && searchPhrase !== "",
    count: requestedCount,
  }
}
