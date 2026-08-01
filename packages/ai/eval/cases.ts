import type { MessageReason } from "../local/resolvers/resolve-target"
import type { ChatMessage, SelectionScope } from "../types"

/**
 * Authored eval cases: realistic chat phrasings over a real seeded workspace
 * (the button board), each labeled with the ground truth for every real
 * pipeline stage the case's message should pass through -- route, decompose,
 * classify, target resolution, and property-name resolution. These are
 * measurement cases for model selection, not pass/fail CI tests -- the
 * harness reports per-model, per-stage accuracy so the shipping default is
 * chosen on evidence, and a failing stage points at one specific prompt.
 */
/** Which seeded workspace a case runs against. Defaults to the button board. */
export type EvalSeed = "button" | "chipRow" | "textList"

/** Ground truth for one decomposed step's classify+resolve+property pass. */
export interface StepExpectation {
  intent: string
  /** For set_node_properties cases: keys the name resolver must include. */
  propertyKeys?: string[]
  /**
   * How many nodes resolution should land on, or the specific reason it
   * should decline to resolve. A bare "did it ask a question?" is not worth
   * scoring: "several" is Hari offering a pick list, "no-target" is Hari
   * never having had a phrase to search with.
   */
  resolution?: number | MessageReason
}

export interface EvalCase {
  /** Short stable id for the report table. */
  id: string
  message: string
  /** Prior turns, for cases exercising decompose's history-dependent rewriting. */
  history?: ChatMessage[]
  scope?: SelectionScope
  /** Whether the seeded text child is "selected" for this case. */
  selectText?: boolean
  seed?: EvalSeed
  /**
   * Why this case is expected to fail today. Present only on cases that
   * document a gap the pipeline has not been built to cover yet, so the report
   * can separate "not built" from "regressed".
   */
  known?: string
  expected: {
    /** route() ground truth. Absent means "expected to route to process". */
    route?: "reply" | "process"
    /** decompose() ground truth: how many steps the message should split into. */
    decomposedStepCount?: number
    /** Per decomposed step, in order. A single-instruction case has one entry. */
    steps: StepExpectation[]
    /**
     * Does the message name one particular element, or a class of them? This
     * is the half of cardinality readable from the message alone -- the count
     * comes from matching the phrase against the board. Scored off the real
     * extract_target stage's `plural` output, not a per-step count, since it
     * only ever describes the whole case.
     */
    referenceIntent?: "single" | "class"
  }
}

/** A single-instruction case's expectation, wrapped into the `steps` shape. */
function singleStep(
  expectation: StepExpectation,
  caseLevel?: {
    referenceIntent?: "single" | "class"
    route?: "reply" | "process"
  },
): EvalCase["expected"] {
  return { steps: [expectation], ...caseLevel }
}

export const EVAL_CASES: EvalCase[] = [
  // -- set_node_properties, direct phrasing --------------------------------
  {
    id: "content-quoted",
    message: 'change the text to "Get started"',
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["content"],
    }),
  },
  {
    id: "content-say",
    message: "make it say Welcome back",
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["content"],
    }),
  },
  {
    id: "color-red",
    message: "make the title red",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "set_node_properties" }),
  },
  {
    id: "bigger-font",
    message: "the font is too small, bump it up a bit",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "set_node_properties" }),
  },
  // -- compound/layered property keys: the model must pick dotted write
  // -- paths (`background.0.color`), not the CSS-familiar flattened names.
  {
    id: "background-yellow",
    message: "make its background yellow",
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["background.0.color"],
    }),
  },
  {
    id: "border-thicker",
    message: "give it a thicker border",
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["border.width"],
    }),
  },
  {
    id: "padding-top",
    message: "increase the top padding",
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["padding.top"],
    }),
  },
  {
    id: "shadow-softer",
    message: "make the shadow blurrier",
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["shadow.0.blur"],
    }),
  },
  {
    id: "hide-it",
    message: "hide this",
    scope: "instance",
    selectText: true,
    expected: singleStep({
      intent: "set_node_properties",
      propertyKeys: ["display"],
    }),
  },

  // -- reset / rename --------------------------------------------------------
  {
    id: "reset-color",
    message: "reset the color back to the default",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "reset_node_property" }),
  },
  {
    id: "rename",
    message: 'rename this to "Primary CTA"',
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "set_node_label" }),
  },

  // -- mutations --------------------------------------------------------------
  {
    id: "remove-selected",
    message: "delete this",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "remove_instance" }),
  },
  {
    id: "remove-named",
    message: "get rid of the icon",
    scope: "board",
    expected: singleStep({ intent: "remove_instance" }),
  },
  {
    id: "duplicate",
    message: "duplicate this button",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "duplicate_node" }),
  },
  {
    id: "remove-component",
    message: "remove the whole button component from the workspace",
    scope: "workspace",
    expected: singleStep({ intent: "remove_component" }),
  },

  // -- add / insert -------------------------------------------------------------
  {
    id: "add-board",
    message: "add a card component",
    scope: "board",
    expected: singleStep({ intent: "add_component" }),
  },
  {
    id: "insert-into",
    message: "put an icon inside the button",
    scope: "board",
    expected: singleStep({ intent: "add_component" }),
  },
  {
    id: "add-variant",
    message: "create a new variant of this button",
    scope: "board",
    expected: singleStep({ intent: "add_variant" }),
  },

  // -- ordering -----------------------------------------------------------------
  {
    id: "reorder-first",
    message: "move the icon to the front",
    scope: "variant",
    expected: singleStep({ intent: "reorder_instance" }),
  },
  {
    id: "move-into",
    message: "move the icon into the second button",
    scope: "board",
    expected: singleStep({ intent: "move_instance" }),
  },

  // -- themes ----------------------------------------------------------------------
  {
    id: "apply-theme-node",
    message: "apply the dark theme to this card",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "set_node_theme" }),
  },
  {
    id: "theme-token",
    message: "change the primary color of the theme to teal",
    scope: "theme",
    expected: singleStep({ intent: "set_theme_override" }),
  },
  {
    id: "custom-swatch",
    message: "add a custom brand purple swatch to the theme",
    scope: "theme",
    expected: singleStep({ intent: "add_theme_custom_token" }),
  },

  // -- fonts & icons -----------------------------------------------------------------
  {
    id: "font-off",
    message: "turn off the secondary font family",
    scope: "fontCollection",
    expected: singleStep({ intent: "set_font_collection_family_preset" }),
  },
  {
    id: "icons-subcat",
    message: "enable all the arrow icons",
    scope: "iconSet",
    expected: singleStep({ intent: "set_icon_set_subcategory_preset" }),
  },

  // -- content ---------------------------------------------------------------------------
  {
    id: "translate",
    message: "translate this card into Dutch",
    scope: "instance",
    selectText: true,
    expected: singleStep({ intent: "translate" }),
  },

  // -- none escape --------------------------------------------------------------------------
  // Both of these are pure conversation, never an edit request: route() is
  // the stage responsible for filtering them out, so they never reach
  // classify-action at all -- they carry no steps.
  {
    id: "greeting",
    message: "hey! what can you do?",
    expected: { route: "reply", steps: [] },
  },
  {
    id: "thanks",
    message: "perfect, thanks",
    expected: { route: "reply", steps: [] },
  },

  // -- decompose regression ------------------------------------------------
  // Reproduces 03-decompose-preempts-class-resolution.md: a plural class
  // reference must survive decompose as ONE step, not get split into N
  // ordinal steps that each resolve to a single chip.
  {
    id: "decompose-plural-stays-one-step",
    message: "make all the chips red",
    scope: "board",
    seed: "chipRow",
    history: [
      { role: "user", content: "insert 3 more chip instances into this variant" },
      { role: "assistant", content: "Done -- the variant now holds 4 chips." },
    ],
    expected: {
      decomposedStepCount: 1,
      steps: [{ intent: "set_node_properties", resolution: 4 }],
      referenceIntent: "class",
    },
  },

  // -- cardinality grid ----------------------------------------------------
  // Four rows: reference intent (single | class) x board matches (1 | n).
  // The chipRow seed holds four sibling chips; the button seed holds one text
  // child.

  // single x n across variants: the button board's four variant rows each
  // hold an equally-matching text, so under the multiple-matches-and-none-
  // selected rule the honest outcome is an ask, not a silent pick. (The old
  // pipeline resolved this by letting the LLM tie-break choose one.)
  {
    id: "card-single-one",
    message: "make the title red",
    scope: "board",
    expected: singleStep(
      { intent: "set_node_properties", resolution: "several" },
      { referenceIntent: "single" },
    ),
  },

  // single x n: well-formed, but four chips match "the chip". The honest
  // outcome is a clarification, not a silent pick.
  {
    id: "card-single-many",
    message: "make the chip red",
    scope: "board",
    seed: "chipRow",
    expected: singleStep(
      { intent: "set_node_properties", resolution: "several" },
      { referenceIntent: "single" },
    ),
  },

  // class x n: the four rows that need `resolved-many`.
  {
    id: "card-class-all",
    message: "make all the chips red",
    scope: "board",
    seed: "chipRow",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 4 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "card-class-bare-plural",
    message: "make the chips red",
    scope: "board",
    seed: "chipRow",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 4 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "card-class-every",
    message: "give every chip a bigger corner radius",
    scope: "board",
    seed: "chipRow",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 4 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "card-class-each",
    message: "hide each of the chips",
    scope: "board",
    seed: "chipRow",
    known: "classifier answers outside the vocabulary; plural phrasing dies at the intent stage",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 4 },
      { referenceIntent: "class" },
    ),
  },

  // Originally authored as the class-x-1 cell, mislabeled: the button board
  // holds nine text nodes, so "all the text" correctly matches all nine. A
  // true class-x-1 case needs a seed with exactly one member of some class --
  // follow-up, tracked in the cardinality issue.
  {
    id: "card-class-one-match",
    message: "make all the text red",
    scope: "board",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 9 },
      { referenceIntent: "class" },
    ),
  },

  // Distractor: "all" inside a phrase that still names one element. Reference
  // intent here is single -- the text is one node, not a class.
  {
    id: "card-all-of-the-text",
    message: "translate all of the text in this button into Dutch",
    scope: "instance",
    selectText: true,
    expected: singleStep(
      { intent: "translate" },
      { referenceIntent: "single" },
    ),
  },

  // Single-intent controls. Without these the reference axis can be passed by
  // a classifier that answers "class" every time -- which is exactly what the
  // first probe prompt did.
  {
    id: "ref-single-plain",
    message: "make the label bold",
    scope: "board",
    expected: singleStep(
      { intent: "set_node_properties" },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "ref-single-pronoun",
    message: "make it wider",
    scope: "instance",
    selectText: true,
    expected: singleStep(
      { intent: "set_node_properties" },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "ref-single-among-many",
    message: "make the first chip green",
    scope: "board",
    seed: "chipRow",
    expected: singleStep(
      { intent: "set_node_properties" },
      { referenceIntent: "single" },
    ),
  },

  // Container + class, the shape translate hardcodes today. Kept separate on
  // purpose: this is a subtree-scoped class query, not a board-wide predicate.
  {
    id: "card-class-in-container",
    message: "make all the chips in the list bold",
    scope: "board",
    seed: "chipRow",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 4 },
      { referenceIntent: "class" },
    ),
  },

  // -- bounded-count matrix -------------------------------------------------
  // Only the intents whose handlers actually iterate `resolved-many`
  // (set_node_properties, reset_node_property, set_node_theme, translate)
  // get the full 5-cell matrix -- everything else refuses a multi-node match
  // outright, so a single-spatial/single-semantic pair is enough coverage.
  // The textList seed's 5 texts (3 about cars, 2 not) give both "the top
  // two" and "the two about cars" one unambiguous correct answer.

  // set_node_properties -- single, spatial
  {
    id: "fanout-properties-single-spatial",
    message: "make the last text bold",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  // set_node_properties -- single, semantic
  {
    id: "fanout-properties-single-semantic",
    message: "make the recipe text bold",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  // set_node_properties -- multiple, spatial (bounded count + tree order)
  {
    id: "fanout-properties-multi-spatial",
    message: "make the top two texts bold",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  // set_node_properties -- multiple, semantic (bounded count + content ranking)
  {
    id: "fanout-properties-multi-semantic",
    message: "make the two texts about cars bold",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  // set_node_properties -- all
  {
    id: "fanout-properties-all",
    message: "make all the texts bold",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_properties", resolution: 5 },
      { referenceIntent: "class" },
    ),
  },

  // reset_node_property -- single, spatial / semantic / multi-spatial /
  // multi-semantic / all
  {
    id: "fanout-reset-single-spatial",
    message: "reset the last text's color",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "reset_node_property", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "fanout-reset-single-semantic",
    message: "reset the recipe text's color",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "reset_node_property", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "fanout-reset-multi-spatial",
    message: "reset the color of the top two texts",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "reset_node_property", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "fanout-reset-multi-semantic",
    message: "reset the color of the two texts about cars",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "reset_node_property", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "fanout-reset-all",
    message: "reset the color on all the texts",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "reset_node_property", resolution: 5 },
      { referenceIntent: "class" },
    ),
  },

  // set_node_theme -- single, spatial / semantic / multi-spatial /
  // multi-semantic / all
  {
    id: "fanout-theme-single-spatial",
    message: "apply the dark theme to the last text",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_theme", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "fanout-theme-single-semantic",
    message: "apply the dark theme to the recipe text",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_theme", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "fanout-theme-multi-spatial",
    message: "apply the dark theme to the top two texts",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_theme", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "fanout-theme-multi-semantic",
    message: "apply the dark theme to the two texts about cars",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_theme", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "fanout-theme-all",
    message: "apply the dark theme to all the texts",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "set_node_theme", resolution: 5 },
      { referenceIntent: "class" },
    ),
  },

  // translate -- single, spatial / semantic / multi-spatial / multi-semantic
  // / all
  {
    id: "fanout-translate-single-spatial",
    message: "translate the last text into Dutch",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "translate", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "fanout-translate-single-semantic",
    message: "translate the recipe text into Dutch",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "translate", resolution: 1 },
      { referenceIntent: "single" },
    ),
  },
  {
    id: "fanout-translate-multi-spatial",
    message: "translate the top two texts into Dutch",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "translate", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "fanout-translate-multi-semantic",
    message: "translate the two texts about cars into Dutch",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "translate", resolution: 2 },
      { referenceIntent: "class" },
    ),
  },
  {
    id: "fanout-translate-all",
    message: "translate all the texts into Dutch",
    scope: "board",
    seed: "textList",
    expected: singleStep(
      { intent: "translate", resolution: 5 },
      { referenceIntent: "class" },
    ),
  },
]
