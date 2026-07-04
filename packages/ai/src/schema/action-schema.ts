import rawActionSchema from "@seldon/core/workspace/reducers/workspace-action-schema.json"

/**
 * Loose view over the generated `workspace-action-schema.json`. The file is the
 * draft-07 schema for the whole `WorkspaceAction` union: a top-level `anyOf`
 * where each entry describes one action `type` and its `payload`. We read only
 * the action `type` const and the payload key list, so we type it minimally.
 */
interface RawActionEntry {
  properties?: {
    type?: { const?: string }
    payload?: {
      properties?: Record<string, unknown>
      required?: string[]
    }
  }
}

const anyOf =
  (rawActionSchema as unknown as { anyOf?: RawActionEntry[] }).anyOf ?? []

/**
 * Actions the agent must not emit. These are internal or meta operations: the
 * editor already uses `set_workspace` to apply the agent's result as one undo
 * step, and version/timestamp/migration actions are bookkeeping the agent should
 * never drive.
 */
const EXCLUDED_ACTION_TYPES = new Set<string>([
  "set_workspace",
  "set_workspace_version",
  "set_workspace_last_update",
  "normalize_metadata_version",
])

interface ActionMeta {
  type: string
  payloadKeys: string[]
  requiredKeys: string[]
}

/** Every action entry from the generated schema, minus the excluded set. */
const ACTION_META: ActionMeta[] = anyOf
  .map((entry): ActionMeta | null => {
    const type = entry.properties?.type?.const
    if (typeof type !== "string") return null
    const payload = entry.properties?.payload
    return {
      type,
      payloadKeys: payload?.properties ? Object.keys(payload.properties) : [],
      requiredKeys: payload?.required ?? [],
    }
  })
  .filter(
    (meta): meta is ActionMeta =>
      meta !== null && !EXCLUDED_ACTION_TYPES.has(meta.type),
  )

/** The full set of action type strings the agent may emit. */
export const ALL_ACTION_TYPES: string[] = ACTION_META.map((meta) => meta.type)

/** Groups an action type into a human-readable domain for the prompt catalog. */
function actionDomain(type: string): string {
  if (type.includes("theme")) return "Themes"
  if (type.includes("font_collection")) return "Fonts"
  if (type.includes("icon_set")) return "Icons"
  if (type.includes("media")) return "Media"
  if (type.includes("playground") || type.includes("sandbox"))
    return "Playgrounds"
  if (type.includes("workspace") || type.includes("metadata"))
    return "Workspace"
  if (type.includes("board") || type.includes("component"))
    return "Boards & Components"
  if (
    type.includes("node") ||
    type.includes("instance") ||
    type.includes("variant") ||
    type.includes("layer") ||
    type.includes("custom_state")
  )
    return "Nodes, Variants & Instances"
  return "Other"
}

const DOMAIN_ORDER = [
  "Nodes, Variants & Instances",
  "Boards & Components",
  "Themes",
  "Fonts",
  "Icons",
  "Media",
  "Playgrounds",
  "Workspace",
  "Other",
]

/**
 * Builds a compact catalog of every allowed action for the system prompt. Each
 * line is `type(requiredKeys)` so the model learns the vocabulary and the
 * required payload shape without inlining the full JSON schema. Grouped by
 * domain to keep it scannable.
 */
export function buildActionReference(): string {
  const byDomain = new Map<string, string[]>()
  for (const meta of ACTION_META) {
    const domain = actionDomain(meta.type)
    const keys =
      meta.requiredKeys.length > 0
        ? meta.requiredKeys.join(", ")
        : meta.payloadKeys.join(", ")
    const line = `- ${meta.type}(${keys})`
    const list = byDomain.get(domain) ?? []
    list.push(line)
    byDomain.set(domain, list)
  }

  const sections: string[] = []
  for (const domain of DOMAIN_ORDER) {
    const lines = byDomain.get(domain)
    if (!lines || lines.length === 0) continue
    sections.push(`${domain}:`, ...lines, "")
  }
  return sections.join("\n").trimEnd()
}

/**
 * JSON Schema passed to Ollama as `format`. It forces schema-valid decode of a
 * response envelope: a short natural-language `reply` plus an `actions` array of
 * `{ type, payload }` objects whose `type` is one of the allowed action types.
 * The payload stays a free-form object; the reducer validates it deeply when the
 * editor applies each action.
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
            enum: ALL_ACTION_TYPES,
          },
          payload: {
            type: "object",
            description:
              "Payload matching the action type, per the system prompt.",
          },
        },
        required: ["type", "payload"],
      },
    },
  },
  required: ["reply", "actions"],
} as const
