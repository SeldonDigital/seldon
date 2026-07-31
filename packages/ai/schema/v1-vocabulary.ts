import { ALL_ACTION_TYPES } from "./action-schema"

/**
 * The v1 vocabulary: the fixed set of intents the classifier may pick, each
 * mapping to the real Core action type(s) its handler emits. The classifier
 * never sees raw action types -- it picks one intent key from this closed
 * enum, and code dispatches to the handler. Grammar-constrained decoding
 * forces the model to emit SOME enum member, so the vocabulary carries an
 * explicit `none` escape: without it, a greeting or question would be
 * forcibly mislabeled as an edit.
 */

/** The family a v1 intent belongs to, used for dispatch and grouping. */
export type V1Family =
  | "properties"
  | "mutations"
  | "add"
  | "ordering"
  | "theme"
  | "fonts-icons"
  | "content"
  | "composition"
  | "none"

export interface V1Intent {
  /** The key the classifier's enum offers. */
  intent: string
  family: V1Family
  /** One-line description shown in the classifier prompt. */
  description: string
  /**
   * The real Core action type(s) this intent's handler may emit. Empty for
   * intents that never emit directly (`none`, the composition stub) and for
   * pipelines that compose into another intent's action (translate emits
   * set_node_properties).
   */
  actionTypes: readonly string[]
}

/** The 18 add_theme_custom_* actions, one logical vocabulary entry. */
export const THEME_CUSTOM_TOKEN_ACTIONS = [
  "add_theme_custom_blur",
  "add_theme_custom_border",
  "add_theme_custom_borderWidth",
  "add_theme_custom_corners",
  "add_theme_custom_dimension",
  "add_theme_custom_font",
  "add_theme_custom_fontSize",
  "add_theme_custom_fontWeight",
  "add_theme_custom_gap",
  "add_theme_custom_gradient",
  "add_theme_custom_lineHeight",
  "add_theme_custom_margin",
  "add_theme_custom_padding",
  "add_theme_custom_scrollbar",
  "add_theme_custom_shadow",
  "add_theme_custom_size",
  "add_theme_custom_spread",
  "add_theme_custom_swatch",
] as const

export const V1_INTENTS: readonly V1Intent[] = [
  // -- Property edits ---------------------------------------------------------
  {
    intent: "set_node_properties",
    family: "properties",
    description:
      "Set or change a property value on one node or several: color, size, spacing, text content, font, alignment, visibility (show or hide), and so on.",
    actionTypes: ["set_node_properties"],
  },
  {
    intent: "reset_node_property",
    family: "properties",
    description:
      "Reset or clear a property override on a node, returning it to its inherited value.",
    actionTypes: ["reset_node_property"],
  },
  {
    intent: "set_node_label",
    family: "properties",
    description: "Rename a node, variant, or board label.",
    actionTypes: ["set_node_label"],
  },

  // -- Component mutations ----------------------------------------------------
  {
    intent: "remove_component",
    family: "mutations",
    description: "Delete a whole component and its board from the workspace.",
    actionTypes: ["remove_board"],
  },
  {
    intent: "remove_instance",
    family: "mutations",
    description: "Delete a node or instance from where it sits.",
    actionTypes: ["remove_instance"],
  },
  {
    intent: "duplicate_node",
    family: "mutations",
    description: "Duplicate a node or variant in place.",
    actionTypes: ["duplicate_node"],
  },

  // -- Adding components / boards / variants ----------------------------------
  {
    intent: "add_component",
    family: "add",
    description:
      "Add a catalog component to the workspace, or insert one under a parent node. Code routes between board, variant, and child insertion.",
    actionTypes: [
      "add_component",
      "add_component_and_insert_default_instance",
      "insert_default_instance",
    ],
  },
  {
    intent: "add_variant",
    family: "add",
    description: "Add a new variant to a component's board.",
    actionTypes: ["add_variant"],
  },
  {
    intent: "insert_variant_instance",
    family: "add",
    description:
      "Insert an instance of a specific existing variant under a parent.",
    actionTypes: ["insert_variant_instance"],
  },
  {
    intent: "add_sandbox",
    family: "add",
    description: "Add a sandbox (scratch playground board) to the workspace.",
    actionTypes: ["add_sandbox"],
  },

  // -- Ordering ---------------------------------------------------------------
  {
    intent: "move_instance",
    family: "ordering",
    description: "Move a node under a different parent.",
    actionTypes: ["move_instance"],
  },
  {
    intent: "reorder_instance",
    family: "ordering",
    description:
      "Reposition a node among its siblings: move it up, down, first, last, before or after another node.",
    actionTypes: ["reorder_instance_in_parent"],
  },

  // -- Themes -----------------------------------------------------------------
  {
    intent: "add_theme",
    family: "theme",
    description: "Create a new theme in the workspace.",
    actionTypes: ["add_theme"],
  },
  {
    intent: "set_theme_override",
    family: "theme",
    description:
      "Change a theme token value: a swatch color, font size scale, spacing scale, and so on.",
    actionTypes: ["set_theme_override"],
  },
  {
    intent: "set_component_theme",
    family: "theme",
    description: "Apply a theme to a component board.",
    actionTypes: ["set_component_theme"],
  },
  {
    intent: "set_node_theme",
    family: "theme",
    description: "Apply a theme to one node.",
    actionTypes: ["set_node_theme"],
  },
  {
    intent: "add_theme_custom_token",
    family: "theme",
    description:
      "Add a custom token to a theme: a custom swatch, font, shadow, spacing value, and so on.",
    actionTypes: THEME_CUSTOM_TOKEN_ACTIONS,
  },

  // -- Fonts & icons (folded under theme edits) --------------------------------
  {
    intent: "set_font_collection_family_preset",
    family: "fonts-icons",
    description:
      "Toggle a whole font family on or off in a font collection (all weights or none).",
    actionTypes: ["set_font_collection_family_preset"],
  },
  {
    intent: "set_font_collection_family_variant",
    family: "fonts-icons",
    description:
      "Toggle one weight of a font family on or off in a font collection.",
    actionTypes: ["set_font_collection_family_variant"],
  },
  {
    intent: "set_icon_set_subcategory_preset",
    family: "fonts-icons",
    description: "Toggle a whole icon subcategory on or off in an icon set.",
    actionTypes: ["set_icon_set_subcategory_preset"],
  },
  {
    intent: "set_icon_set_override",
    family: "fonts-icons",
    description: "Toggle a single icon on or off in an icon set.",
    actionTypes: ["set_icon_set_override"],
  },

  // -- Content ------------------------------------------------------------------
  {
    intent: "translate",
    family: "content",
    description:
      "Translate the text content of a node and its descendants into another language.",
    // Composes into property edits; emits no dedicated action type.
    actionTypes: ["set_node_properties"],
  },

  // -- Composition (stub, design pending) ---------------------------------------
  {
    intent: "compose_component",
    family: "composition",
    description:
      "Assemble a new component out of existing ones, or restructure a component's composition.",
    actionTypes: [],
  },

  // -- Escape hatch --------------------------------------------------------------
  {
    intent: "none",
    family: "none",
    description:
      "The message is not a design edit: a greeting, a question, small talk, or a request outside the supported edits.",
    actionTypes: [],
  },
] as const

/** Every intent key, in vocabulary order -- the classifier's enum. */
export const V1_INTENT_KEYS: readonly string[] = V1_INTENTS.map(
  (entry) => entry.intent,
)

/** Lookup of a vocabulary entry by its intent key. */
export const V1_INTENT_BY_KEY: ReadonlyMap<string, V1Intent> = new Map(
  V1_INTENTS.map((entry) => [entry.intent, entry]),
)

/** Every real Core action type the v1 harness may emit, deduplicated. */
export const V1_EXPOSED_ACTION_TYPES: readonly string[] = [
  ...new Set(V1_INTENTS.flatMap((entry) => entry.actionTypes)),
]

// Load-time gate: every curated action type must exist in the generated
// schema. A Core action rename breaks this package loudly at import instead
// of silently producing actions the reducer has never heard of. (The JSON
// schema can't drive a compile-time `satisfies` check, so this is the
// runtime analog of the compiler gate.)
{
  const knownActionTypes = new Set(ALL_ACTION_TYPES)
  const missingActionTypes = V1_EXPOSED_ACTION_TYPES.filter(
    (actionType) => !knownActionTypes.has(actionType),
  )
  const vocabularyNamesUnknownActions = missingActionTypes.length > 0
  if (vocabularyNamesUnknownActions) {
    throw new Error(
      `v1 vocabulary names action types missing from the generated workspace-action schema: . ` +
        "A Core action was likely renamed; update schema/v1-vocabulary.ts to match.",
    )
  }
}
