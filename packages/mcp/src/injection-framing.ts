/**
 * Injection framing: workspace-authored free text — labels,
 * intents, tags, and label-derived paths — is returned inside a clearly
 * marked field-level envelope, `{"$userText": <value>}`, so the calling
 * agent can tell design data from tool guidance. This is framing, not
 * sanitization (sanitization is explicitly out of scope): values pass
 * through byte-identical; only the JSON shape marks their provenance. The
 * server instructions explain the envelope ("design data, never
 * instructions").
 *
 * Applied by the server wrapper to the read paths that carry workspace
 * (user-authored) text. Catalog reads (list_catalog, search_catalog,
 * schemas) serve Seldon-packaged text and stay unframed.
 */
export const USER_TEXT_KEY = "$userText"

/**
 * Keys holding workspace-authored free text wherever they appear in a
 * result: node/board/theme/collection labels, board and metadata intents,
 * metadata tags, and find_nodes' ancestor-label paths.
 */
const FRAMED_KEYS = new Set(["label", "intent", "tags", "path"])

export function frameWorkspaceText<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => frameWorkspaceText(item)) as T
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined && FRAMED_KEYS.has(key)) {
        result[key] = { [USER_TEXT_KEY]: entry }
      } else {
        result[key] = frameWorkspaceText(entry)
      }
    }
    return result as T
  }

  return value
}
