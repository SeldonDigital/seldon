import type { MessageReason } from "../local/resolvers/resolve-target"
import type { SelectionScope } from "../types"

/**
 * Authored eval cases: realistic chat phrasings over a real seeded workspace
 * (the button board), each labeled with the intent the classifier must pick
 * and, for property edits, the property key(s) the name resolver must find.
 * These are measurement cases for model selection, not pass/fail CI tests --
 * the harness reports per-model accuracy so the shipping default is chosen
 * on evidence.
 */
/** Which seeded workspace a case runs against. Defaults to the button board. */
export type EvalSeed = "button" | "chipRow"

export interface EvalCase {
  /** Short stable id for the report table. */
  id: string
  message: string
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
    intent: string
    /** For set_node_properties cases: keys the name resolver must include. */
    propertyKeys?: string[]
    /**
     * Does the message name one particular element, or a class of them? This
     * is the half of cardinality readable from the message alone -- the count
     * comes from matching the phrase against the board.
     */
    referenceIntent?: "single" | "class"
    /**
     * How many nodes resolution should land on, or the specific reason it
     * should decline to resolve. A bare "did it ask a question?" is not worth
     * scoring: "several" is Hari offering a pick list, "no-target" is Hari
     * never having had a phrase to search with.
     */
    resolution?: number | MessageReason
  }
}

export const EVAL_CASES: EvalCase[] = [
  // -- set_node_properties, direct phrasing --------------------------------
  {
    id: "content-quoted",
    message: 'change the text to "Get started"',
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_properties", propertyKeys: ["content"] },
  },
  {
    id: "content-say",
    message: "make it say Welcome back",
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_properties", propertyKeys: ["content"] },
  },
  {
    id: "color-red",
    message: "make the title red",
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_properties" },
  },
  {
    id: "bigger-font",
    message: "the font is too small, bump it up a bit",
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_properties" },
  },
  // -- compound/layered property keys: the model must pick dotted write
  // -- paths (`background.0.color`), not the CSS-familiar flattened names.
  {
    id: "background-yellow",
    message: "make its background yellow",
    scope: "instance",
    selectText: true,
    expected: {
      intent: "set_node_properties",
      propertyKeys: ["background.0.color"],
    },
  },
  {
    id: "border-thicker",
    message: "give it a thicker border",
    scope: "instance",
    selectText: true,
    expected: {
      intent: "set_node_properties",
      propertyKeys: ["border.width"],
    },
  },
  {
    id: "padding-top",
    message: "increase the top padding",
    scope: "instance",
    selectText: true,
    expected: {
      intent: "set_node_properties",
      propertyKeys: ["padding.top"],
    },
  },
  {
    id: "shadow-softer",
    message: "make the shadow blurrier",
    scope: "instance",
    selectText: true,
    expected: {
      intent: "set_node_properties",
      propertyKeys: ["shadow.0.blur"],
    },
  },
  {
    id: "hide-it",
    message: "hide this",
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_properties", propertyKeys: ["display"] },
  },

  // -- reset / rename --------------------------------------------------------
  {
    id: "reset-color",
    message: "reset the color back to the default",
    scope: "instance",
    selectText: true,
    expected: { intent: "reset_node_property" },
  },
  {
    id: "rename",
    message: 'rename this to "Primary CTA"',
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_label" },
  },

  // -- mutations --------------------------------------------------------------
  {
    id: "remove-selected",
    message: "delete this",
    scope: "instance",
    selectText: true,
    expected: { intent: "remove_instance" },
  },
  {
    id: "remove-named",
    message: "get rid of the icon",
    scope: "board",
    expected: { intent: "remove_instance" },
  },
  {
    id: "duplicate",
    message: "duplicate this button",
    scope: "instance",
    selectText: true,
    expected: { intent: "duplicate_node" },
  },
  {
    id: "remove-component",
    message: "remove the whole button component from the workspace",
    scope: "workspace",
    expected: { intent: "remove_component" },
  },

  // -- add / insert -------------------------------------------------------------
  {
    id: "add-board",
    message: "add a card component",
    scope: "board",
    expected: { intent: "add_component" },
  },
  {
    id: "insert-into",
    message: "put an icon inside the button",
    scope: "board",
    expected: { intent: "add_component" },
  },
  {
    id: "add-variant",
    message: "create a new variant of this button",
    scope: "board",
    expected: { intent: "add_variant" },
  },

  // -- ordering -----------------------------------------------------------------
  {
    id: "reorder-first",
    message: "move the icon to the front",
    scope: "variant",
    expected: { intent: "reorder_instance" },
  },
  {
    id: "move-into",
    message: "move the icon into the second button",
    scope: "board",
    expected: { intent: "move_instance" },
  },

  // -- themes ----------------------------------------------------------------------
  {
    id: "apply-theme-node",
    message: "apply the dark theme to this card",
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_theme" },
  },
  {
    id: "theme-token",
    message: "change the primary color of the theme to teal",
    scope: "theme",
    expected: { intent: "set_theme_override" },
  },
  {
    id: "custom-swatch",
    message: "add a custom brand purple swatch to the theme",
    scope: "theme",
    expected: { intent: "add_theme_custom_token" },
  },

  // -- fonts & icons -----------------------------------------------------------------
  {
    id: "font-off",
    message: "turn off the secondary font family",
    scope: "fontCollection",
    expected: { intent: "set_font_collection_family_preset" },
  },
  {
    id: "icons-subcat",
    message: "enable all the arrow icons",
    scope: "iconSet",
    expected: { intent: "set_icon_set_subcategory_preset" },
  },

  // -- content ---------------------------------------------------------------------------
  {
    id: "translate",
    message: "translate this card into Dutch",
    scope: "instance",
    selectText: true,
    expected: { intent: "translate" },
  },

  // -- none escape --------------------------------------------------------------------------
  {
    id: "greeting",
    message: "hey! what can you do?",
    expected: { intent: "none" },
  },
  {
    id: "thanks",
    message: "perfect, thanks",
    expected: { intent: "none" },
  },

  // -- cardinality grid ----------------------------------------------------
  // Four rows: reference intent (single | class) x board matches (1 | n).
  // The chipRow seed holds four sibling chips; the button seed holds one text
  // child. Everything marked `known` fails today by construction -- the
  // resolver's return type cannot express more than one node.

  // single x n across variants: the button board's four variant rows each
  // hold an equally-matching text, so under the multiple-matches-and-none-
  // selected rule the honest outcome is an ask, not a silent pick. (The old
  // pipeline resolved this by letting the LLM tie-break choose one.)
  {
    id: "card-single-one",
    message: "make the title red",
    scope: "board",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "single",
      resolution: "several",
    },
  },

  // single x n: well-formed, but four chips match "the chip". The honest
  // outcome is a clarification, not a silent pick.
  {
    id: "card-single-many",
    message: "make the chip red",
    scope: "board",
    seed: "chipRow",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "single",
      resolution: "several",
    },
  },

  // class x n: the four rows that need `resolved-many`.
  {
    id: "card-class-all",
    message: "make all the chips red",
    scope: "board",
    seed: "chipRow",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "class",
      resolution: 4,
    },
  },
  {
    id: "card-class-bare-plural",
    message: "make the chips red",
    scope: "board",
    seed: "chipRow",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "class",
      resolution: 4,
    },
  },
  {
    id: "card-class-every",
    message: "give every chip a bigger corner radius",
    scope: "board",
    seed: "chipRow",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "class",
      resolution: 4,
    },
  },
  {
    id: "card-class-each",
    message: "hide each of the chips",
    scope: "board",
    seed: "chipRow",
    known: "classifier answers outside the vocabulary; plural phrasing dies at the intent stage",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "class",
      resolution: 4,
    },
  },

  // Originally authored as the class-x-1 cell, mislabeled: the button board
  // holds nine text nodes, so "all the text" correctly matches all nine. A
  // true class-x-1 case needs a seed with exactly one member of some class --
  // follow-up, tracked in the cardinality issue.
  {
    id: "card-class-one-match",
    message: "make all the text red",
    scope: "board",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "class",
      resolution: 9,
    },
  },

  // Distractor: "all" inside a phrase that still names one element. Reference
  // intent here is single -- the text is one node, not a class.
  {
    id: "card-all-of-the-text",
    message: "translate all of the text in this button into Dutch",
    scope: "instance",
    selectText: true,
    expected: {
      intent: "translate",
      referenceIntent: "single",
    },
  },

  // Single-intent controls. Without these the reference axis can be passed by
  // a classifier that answers "class" every time -- which is exactly what the
  // first probe prompt did.
  {
    id: "ref-single-plain",
    message: "make the label bold",
    scope: "board",
    expected: { intent: "set_node_properties", referenceIntent: "single" },
  },
  {
    id: "ref-single-pronoun",
    message: "make it wider",
    scope: "instance",
    selectText: true,
    expected: { intent: "set_node_properties", referenceIntent: "single" },
  },
  {
    id: "ref-single-among-many",
    message: "make the first chip green",
    scope: "board",
    seed: "chipRow",
    expected: { intent: "set_node_properties", referenceIntent: "single" },
  },

  // Container + class, the shape translate hardcodes today. Kept separate on
  // purpose: this is a subtree-scoped class query, not a board-wide predicate.
  {
    id: "card-class-in-container",
    message: "make all the chips in the list bold",
    scope: "board",
    seed: "chipRow",
    expected: {
      intent: "set_node_properties",
      referenceIntent: "class",
      resolution: 4,
    },
  },
]
