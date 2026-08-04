import { isPlural, plural as pluralSpellingOf } from "pluralize"

import { catalog } from "@seldon/core/components/catalog"
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
  /**
   * The edit applies to every element of a kind, not one particular one.
   * Code-derived from `baseNode` (see `nounIsPlural`), not asked of the
   * model: qwen3 kept answering `plural: true` for singular, position-named
   * references ("the last chip", "the first list item"), fanning a
   * single-element edit over every match on the board (issue 10).
   */
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
 *
 * Returns the word as it actually appears in the message, not the
 * canonicalized catalog name: the catalog name decides WHETHER a kind is
 * named at all, but "hide all the chips" must hand back "chips", the
 * inflected form the message used, or `nounIsPlural` would read the
 * canonicalized singular "chip" and wrongly call this singular (issue 10).
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

  const namedKinds: { kindName: string; wordInMessage: string }[] = []
  for (const kindName of kindNames) {
    const kindNamePattern = new RegExp(
      `\\b${kindName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`,
      "i",
    )
    const kindNameMatch = kindNamePattern.exec(message)
    if (kindNameMatch) {
      namedKinds.push({
        kindName,
        wordInMessage: kindNameMatch[0].toLowerCase(),
      })
    }
  }
  if (namedKinds.length === 0) return undefined
  // The longest catalog name is the most specific: a board with "text" and
  // "hero text" resolves "the hero text" to the latter.
  return namedKinds.sort(
    (kindA, kindB) => kindB.kindName.length - kindA.kindName.length,
  )[0]!.wordInMessage
}

/**
 * Every catalog component name, lowercased. A noun that IS one of these names
 * is singular by definition -- the catalog names each component in the
 * singular -- even when English misleads `isPlural` about the word itself:
 * "Table Data" reads as plural because "data" is the plural of "datum", and
 * the "... Specimen" names because "-men" reads as a plural of "-man". The
 * catalog is the enumeration, so a new component with such a name is covered
 * the day it lands, with no word list to maintain.
 */
const SINGULAR_CATALOG_NAMES: ReadonlySet<string> = new Set(
  [
    ...catalog.frames,
    ...catalog.primitives,
    ...catalog.elements,
    ...catalog.parts,
    ...catalog.modules,
    ...catalog.screens,
    ...catalog.boards,
  ].map((schema) => schema.name.toLowerCase()),
)

/**
 * Quantifier words that state a class over a grammatically singular noun:
 * "every chip" and "each of the chips" both name every matching element,
 * even though "chip" alone is singular. Bounded to appear near the noun so
 * an unrelated "each"/"every" elsewhere in the message cannot flip this.
 */
const CLASS_QUANTIFIER_WORDS = ["every", "each"]

/**
 * Whether the target names a class of elements, not one. Judged in code from
 * `bareNoun`'s own grammatical number, not asked of the model: qwen3
 * deterministically answered `plural: true` for singular, position-named
 * references ("the last chip", "the first list item"), and a prompt fix
 * (more singular examples) did not generalize to new phrasings -- routing a
 * single-element edit down the class path silently overwrote every match on
 * the board (issue 10). `pluralize`'s `isPlural` is the primary signal; a
 * class quantifier immediately before the noun overrides a singular reading,
 * since English states the class with a singular noun there ("every chip").
 *
 * `bareNoun`'s own spelling is not trustworthy enough to be the ONLY signal,
 * though: qwen3 inconsistently drops the plural "s" when transcribing the
 * noun even when the message plainly carries it -- "make the chips red" came
 * back with `baseNode: "chip"` live, which silently turned a correct class
 * edit into a wrong single-element one (measured regression while fixing
 * this same issue). The message is the ground truth for what the user
 * actually typed, so a literal plural spelling of the noun THERE overrides a
 * singular-looking `bareNoun` -- the same stance `countNamedBeforeNoun` and
 * `boardKindNamedInMessage` already take: the model matches wording, it does
 * not reliably transcribe it.
 */
export function nounIsPlural(message: string, bareNoun: string): boolean {
  if (bareNoun === "") return false
  const nounWords = bareNoun.split(/\s+/)
  const nounStem = nounWords[0] ?? ""
  const headNoun = nounWords[nounWords.length - 1] ?? ""
  const escapeRegex = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const quantifierNamesTheClass = new RegExp(
    `\\b(${CLASS_QUANTIFIER_WORDS.join("|")})\\b(?:\\s+\\w+){0,3}?\\s+${escapeRegex(nounStem)}s?\\b`,
    "i",
  ).test(message)
  if (quantifierNamesTheClass) return true

  const pluralHeadNoun = pluralSpellingOf(headNoun)
  const messageUsesThePluralSpelling =
    pluralHeadNoun !== headNoun &&
    new RegExp(`\\b${escapeRegex(pluralHeadNoun)}\\b`, "i").test(message)
  if (messageUsesThePluralSpelling) return true

  // Checked after the message-spelling override so a real plural still wins
  // ("all the table datas" stays a class, however unlikely the phrasing).
  const nounIsACatalogName = SINGULAR_CATALOG_NAMES.has(bareNoun.toLowerCase())
  if (nounIsACatalogName) return false

  return isPlural(bareNoun)
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
    count: number
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

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
  const searchPhrase = composeSearchPhrase(rawHint.descriptor ?? "", bareNoun)
  // 0 is the sentinel for "no number was named", mirroring match's "" -> undefined.
  // A count without a phrase is as meaningless as plural without one -- there
  // is no class to narrow.
  const extractedCount =
    rawHint.count > 0 ? rawHint.count : countNamedBeforeNoun(context.message, bareNoun)
  const requestedCount =
    extractedCount !== undefined && searchPhrase !== "" ? extractedCount : undefined
  // Plural without a phrase is meaningless: there is no class to match.
  // A named count implies plural even if the noun itself reads singular
  // ("the top 2 text").
  const plural =
    (nounIsPlural(context.message, bareNoun) || requestedCount !== undefined) &&
    searchPhrase !== ""

  // Logged with the code-derived `plural` folded in, not the bare model
  // JSON: `plural` is no longer part of what the model answers (issue 10),
  // and the eval harness's reference-intent scoring reads this step's output
  // to tell single-vs-class apart, so the transcript has to carry the real
  // decision, not just the raw fields.
  recordStep(context, "extract_target", {
    ok: true,
    prompt,
    output: JSON.stringify({ ...rawHint, plural }, null, 2),
  })
  if (modelDroppedANamedKind) {
    recordStep(context, "extract_target_kind_fallback", {
      ok: true,
      output: `The model extracted no element, but the message names "${bareNoun}" -- a kind on the active board. Using it as the search noun (deterministic, no model call).`,
    })
  }
  return {
    pointsAtSelection: rawHint.pointsAtSelection,
    match: searchPhrase === "" ? undefined : searchPhrase,
    baseNode: bareNoun === "" ? undefined : bareNoun,
    plural,
    count: requestedCount,
  }
}
