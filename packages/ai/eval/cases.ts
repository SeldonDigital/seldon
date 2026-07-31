import type { SelectionScope } from "../types"

/**
 * Authored eval cases: realistic chat phrasings over a real seeded workspace
 * (the button board), each labeled with the intent the classifier must pick
 * and, for property edits, the property key(s) the name resolver must find.
 * These are measurement cases for model selection, not pass/fail CI tests --
 * the harness reports per-model accuracy so the shipping default is chosen
 * on evidence.
 */
export interface EvalCase {
  /** Short stable id for the report table. */
  id: string
  message: string
  scope?: SelectionScope
  /** Whether the seeded text child is "selected" for this case. */
  selectText?: boolean
  expected: {
    intent: string
    /** For set_node_properties cases: keys the name resolver must include. */
    propertyKeys?: string[]
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
]
