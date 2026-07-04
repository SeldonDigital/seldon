/**
 * Curated set of workspace action types the agent may emit. This is a subset of
 * the full `WorkspaceAction` union. The reducer validates payloads deeply, so
 * the schema below only constrains the response envelope shape and the allowed
 * action `type` strings. Payload details are described in the system prompt.
 */
export const ALLOWED_ACTION_TYPES = [
  "add_component_and_insert_default_instance",
  "insert_variant_instance",
  "set_node_properties",
  "set_component_properties",
  "remove_component",
  "remove_instance",
  "set_theme_override",
  "set_board_label",
] as const

export type AllowedActionType = (typeof ALLOWED_ACTION_TYPES)[number]

/**
 * JSON Schema passed to Ollama as `format`. It forces schema-valid decode of a
 * response envelope: a short natural-language `reply` plus an `actions` array of
 * `{ type, payload }` objects whose `type` is one of the allowed action types.
 */
export const RESPONSE_FORMAT = {
  type: "object",
  properties: {
    reply: {
      type: "string",
      description: "Short natural-language summary of the actions taken.",
    },
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [...ALLOWED_ACTION_TYPES],
          },
          payload: {
            type: "object",
            description: "Payload matching the action type, per the system prompt.",
          },
        },
        required: ["type", "payload"],
      },
    },
  },
  required: ["reply", "actions"],
} as const
