import type { Workspace } from "@seldon/core/workspace/types"

export interface TextEditArrowCaret {
  start: number
  end: number
  value: string
}

export interface TextEditArrowLines {
  atFirstLine: boolean
  atLastLine: boolean
}

export interface TextEditArrowTarget {
  nodeId: string
  offset: number
}

/**
 * Arrows stay inside the session primitive. Sibling jumps are not used.
 */
export function resolveTextEditArrow(
  _workspace: Workspace,
  _nodeId: string,
  _key: string,
  _caret: TextEditArrowCaret,
  _edges: TextEditArrowLines,
): TextEditArrowTarget | null {
  return null
}
