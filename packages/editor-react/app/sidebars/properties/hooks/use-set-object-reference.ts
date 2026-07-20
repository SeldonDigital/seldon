import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useCallback } from "react"

import { Instance, Variant } from "@seldon/core"

/**
 * Reference-assignment command. Sets a node's unique `ref` handle. Owns the
 * dispatch so property controls stay binding shells. Boards have no ref, so
 * only nodes are accepted.
 */
export function useSetObjectReference() {
  const { dispatch } = useWorkspace({ usePreview: false })

  return useCallback(
    (subject: Variant | Instance, ref: string) => {
      dispatch({
        type: "set_node_ref",
        payload: {
          nodeId: subject.id,
          ref,
        },
      })
    },
    [dispatch],
  )
}
