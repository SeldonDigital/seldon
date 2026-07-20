import { useCallback } from "react"

import { parseWorkspace } from "@seldon/core/workspace/helpers/parse-workspace"

/**
 * Returns a stable parser that turns serialized workspace text into a workspace.
 * @returns A callback that parses workspace JSON text
 */
export function useParseWorkspace() {
  return useCallback((text: string) => parseWorkspace(text), [])
}
