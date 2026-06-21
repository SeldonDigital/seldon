import type { EntryNode } from "../../model/entry-node"

/** Key under `EntryNode.__editor` that holds the repeat preview state. */
export const REPEAT_EDITOR_KEY = "repeat"

/** Largest total render count for a single repeat, index 0 included. */
export const MAX_REPEAT_COUNT = 50

/**
 * Ceiling for the product of nested repeat counts along an ancestor chain.
 * Keeps the canvas from expanding into an unmanageable number of echoes when
 * repeats are nested inside other repeats.
 */
export const MAX_REPEAT_EXPANSION = 200

/**
 * Editor-only repeat preview state stored on a child node. The node paints
 * `count` times on the canvas. Index 0 is the single real, selectable node;
 * the rest are render-only echoes. `data` carries per-echo placeholder strings
 * keyed by a descendant node id for text/icon prototyping.
 */
export interface RepeatEditorData {
  /** Total rendered copies including index 0. Range 1..{@link MAX_REPEAT_COUNT}. */
  count: number
  /**
   * Optional prototyping strings for text/icon descendants. Keyed by a stable
   * descendant node id. Each array holds values for echoes 1..count-1; index 0
   * always renders the descendant's own value.
   */
  data?: Record<string, string[]>
}

type EditorBearing = Pick<EntryNode, "__editor">

/** Reads the repeat preview state from a node, or `undefined` when absent. */
export function getNodeRepeat(node: EditorBearing): RepeatEditorData | undefined {
  const raw = node.__editor?.[REPEAT_EDITOR_KEY]
  if (raw == null || typeof raw !== "object") return undefined
  const candidate = raw as Partial<RepeatEditorData>
  if (typeof candidate.count !== "number") return undefined
  return candidate as RepeatEditorData
}

/**
 * A repeat is meaningful only when it paints more than once or carries
 * prototyping data. A bare `count <= 1` with no data is equivalent to no repeat.
 */
export function isMeaningfulRepeat(
  repeat: RepeatEditorData | undefined,
): repeat is RepeatEditorData {
  if (!repeat) return false
  if (repeat.count > 1) return true
  return repeat.data != null && Object.keys(repeat.data).length > 0
}

/**
 * Writes the repeat preview state onto a node, preserving any other `__editor`
 * keys such as `initialOverrides`. Clears the key (and an emptied `__editor`)
 * when the repeat is not meaningful.
 */
export function applyNodeRepeat(
  node: EditorBearing,
  repeat: RepeatEditorData | undefined,
): void {
  if (!isMeaningfulRepeat(repeat)) {
    if (node.__editor) {
      delete node.__editor[REPEAT_EDITOR_KEY]
      if (Object.keys(node.__editor).length === 0) delete node.__editor
    }
    return
  }
  node.__editor = { ...node.__editor, [REPEAT_EDITOR_KEY]: repeat }
}
