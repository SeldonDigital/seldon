import type { PromptStage } from "./shared"

/**
 * How many elements the request covers, asked separately from which ones.
 *
 * `only` is not "one": "the two chips about cars" and "all buttons of the
 * second card" are both local subsets. What the answer decides is whether the
 * pick may return every match on the board or must stay with what the message
 * points at. Judged by a model rather than from grammatical number, because
 * plural nouns alone do not mean "all" ("the chips" in a message about one
 * card), and a code reading of grammatical number fanned a single-element
 * edit over six list items (issue 10).
 */
export type Quantifier = "only" | "all" | "all-except"

const QUANTIFIER_VALUES: Quantifier[] = ["only", "all", "all-except"]

/**
 * One message-only call: does this request cover every matching element on the
 * board, everything except named exceptions, or only what it points at? No
 * tree is needed to answer it, which keeps the call cheap and keeps cardinality
 * out of the pick's job.
 */
export function buildQuantifierStage(inputs: { message: string }): PromptStage {
  const prompt = [
    "A design-editor chat message asks for a change to elements on a canvas. Decide how many elements it covers.",
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    'all: the change applies to every matching element on the canvas, with no restriction. Cues: "all", "every", "everywhere", "each".',
    'all-except: every matching element, minus named exceptions. Cues: "all ... except", "excluding", "but not".',
    "only: the change applies to what the message points at, whether that is one element or a named subset.",
    "",
    'A local restriction beats an "all" cue: "all the buttons in the second card" and "the first three chips" are subsets, so they are "only".',
    'A plural noun on its own does not mean every element: "make the chips red" is "only" unless the message says all of them.',
    'A pronoun or an unnamed target ("make this red", "duplicate it") is "only".',
    "",
    // Worked examples, not more rules: the sibling-steal fixes only ever
    // landed through a positive example, and terminus's quantifier prompt --
    // which this one is modelled on -- ships a dozen. An 8b imitates far more
    // reliably than it compiles instructions.
    "Examples:",
    '"make the banner green" -> only',
    '"update all the badges to blue" -> all',
    '"hide every divider" -> all',
    '"make all the badges round except the top one" -> all-except',
    '"delete the last two banners" -> only',
    '"all the badges in the first section" -> only',
    '"rotate this" -> only',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        quantifier: { type: "string", enum: QUANTIFIER_VALUES },
      },
      required: ["quantifier"],
    },
  }
}

/** What the pick call concluded about the message's reference. */
export type PickVerdict = "found" | "ambiguous" | "none"

const PICK_VERDICTS: PickVerdict[] = ["found", "ambiguous", "none"]

/**
 * The narrow pass's verdicts. `wider` is the one that matters: it is how the
 * pass declines rather than settling for the nearest thing in a short list.
 * Without it this pass would be a trap, since a model shown three candidates
 * picks one of the three whether or not the real target is elsewhere.
 */
export type ScopedPickVerdict = "found" | "ambiguous" | "wider"

const SCOPED_PICK_VERDICTS: ScopedPickVerdict[] = [
  "found",
  "ambiguous",
  "wider",
]

/**
 * The selection policy, stated once, in the prompt that acts on it.
 *
 * It used to live in `resolveNodeTarget`'s ladder as control flow: search the
 * selection's subtree, then widen to the board, then ask. The ladder cannot
 * express the case that actually matters, a message that names an element AND
 * points at the selection ("make the title red" with a card selected), because
 * it has to commit to one reading before it has looked at the board. Written
 * as three rules over a board that marks the selection, the model weighs both.
 */
/**
 * How to read a positional reference, and how many ids one deserves.
 *
 * Probed on qwen3:8b before this existed: "reset the last text's color" over
 * five texts answered with all five ids, verdict "found". Unable to tell which
 * was last, the model returned the cohort and reported success -- the same
 * silent over-reach as the plural fan-out in issue 10, from the model's side
 * instead of the code's. Each line now states its position, and this says what
 * to do with it.
 */
const CARDINALITY_RULES = [
  "Each line says where the element sits among its siblings of the same kind, top to bottom.",
  'A reference to ONE element answers with exactly one id. "The last text" is the text whose position is the highest number; "the first chip" is chip 1; "the second variant" is variant 2.',
  "Never answer with a whole group because you are unsure which one is meant. If the message points at one element and the lines do not separate them, that is what the \"ambiguous\" verdict is for.",
]

const SELECTION_RULES = [
  "The board marks what the user has selected. Use it like this:",
  "- The message names a specific element, by name, content, or position: search the whole board and ignore the selection. \"Make the title in the footer red\" means the footer's title even when something else is selected.",
  '- The message is vague or uses a pronoun ("duplicate this", "make it red", "add a chip"): answer with the element marked SELECTED. When the selected element cannot play the role the message needs, answer with the element it sits inside.',
  "- Several elements match equally well: keep only the ones marked SELECTED or inside the selection.",
]

/** What the request covers, in the words the pick needs to hear. */
const COVERAGE_RULE_BY_QUANTIFIER: Record<Quantifier, string> = {
  all: "This request covers EVERY matching element on the board, so answer with all of their ids.",
  "all-except":
    "This request covers every matching element on the board EXCEPT the ones the message names as exceptions, so answer with all of their ids and leave the exceptions out.",
  only: "This request covers only what the message points at, so do not add elements it never refers to.",
}

/**
 * The narrow first pass: the selected element and its own children, nothing
 * else, with `wider` available instead of a pick.
 *
 * Most edits are about what the user is looking at, and a dozen lines is a
 * much easier read at 8b than a whole board. What makes it safe rather than a
 * trap is that declining is a first-class answer: the pass is told, in as many
 * words, that the rest of the board exists and that asking for it costs
 * nothing.
 */
export function buildPickInSelectionStage(inputs: {
  message: string
  selectionLines: readonly string[]
  nodeIds: readonly string[]
  quantifier: Quantifier
}): PromptStage {
  const prompt = [
    "The user has an element selected on the canvas. Does the message refer to that element, or to something inside it?",
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    "The selected element and its contents:",
    ...inputs.selectionLines,
    "",
    ...CARDINALITY_RULES,
    "",
    COVERAGE_RULE_BY_QUANTIFIER[inputs.quantifier],
    "",
    "This is only part of the board. The board holds other elements you cannot see here, including other variants.",
    'Answer "found" with the ids, when the message refers to the selected element or something listed inside it.',
    'Answer "wider" with no ids, when the message names something that is not in this list -- a different element, another variant, or anything you cannot see above. Asking for the wider board costs nothing and is the right answer whenever you are not confident the target is here.',
    'Answer "ambiguous" with the ids that tie, when the message fits several of these equally and nothing separates them.',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        verdict: { type: "string", enum: SCOPED_PICK_VERDICTS },
        nodeIds: {
          type: "array",
          items: { type: "string", enum: [...inputs.nodeIds] },
        },
      },
      required: ["verdict", "nodeIds"],
    },
  }
}

/**
 * One enum-constrained pick over the whole active board. The answer can only
 * be ids the prompt listed, so an invented target -- "container" for a board
 * that has none, "element" for a bare "duplicate this" -- is not expressible
 * (issue 12), and no code has to check the answer against the user's words
 * afterwards.
 */
export function buildPickTargetStage(inputs: {
  message: string
  boardLines: readonly string[]
  nodeIds: readonly string[]
  quantifier: Quantifier
}): PromptStage {
  const coverageRule = COVERAGE_RULE_BY_QUANTIFIER[inputs.quantifier]
  const prompt = [
    "Which elements on this board does the message refer to?",
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    "Board:",
    ...inputs.boardLines,
    "",
    ...CARDINALITY_RULES,
    "",
    ...SELECTION_RULES,
    "",
    coverageRule,
    "",
    'Answer "found" with the ids you picked.',
    'Answer "ambiguous" with the ids that tie, when the message fits several elements and the rules above do not separate them.',
    'Answer "none" with no ids, when nothing on the board fits.',
    "",
    // The "ambiguous" example is the point: the verdict rule alone changed
    // nothing (the model never volunteers uncertainty), so it is SHOWN what
    // declining looks like. The example board is lexically distant from any
    // real one -- invented kinds, ex- ids -- because examples leak (issue
    // 05); a leaked ex- id is also inexpressible under the nodeIds enum.
    "Examples, from a different board whose lines were:",
    '  - ex-1: badge (1 of 4, top to bottom) says "Alpha"',
    '  - ex-2: badge (2 of 4, top to bottom) says "Beta"',
    '  - ex-3: badge (3 of 4, top to bottom) says "Gamma"',
    '  - ex-4: badge (4 of 4, top to bottom) says "Delta"',
    'Message "make the last badge purple" -> verdict "found", ids ["ex-4"] (its position says it is last).',
    'Message "make the badge purple" -> verdict "ambiguous", ids ["ex-1", "ex-2", "ex-3", "ex-4"] (four badges fit "the badge" equally; picking one would be a guess).',
    'Message "make the banner purple" -> verdict "none", no ids (nothing on that board is a banner).',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        verdict: { type: "string", enum: PICK_VERDICTS },
        nodeIds: {
          type: "array",
          items: { type: "string", enum: [...inputs.nodeIds] },
        },
      },
      required: ["verdict", "nodeIds"],
    },
  }
}
