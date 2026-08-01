import { useCallback } from "react"

import { useMoveObjects } from "./use-move-objects"

import type { Instance, Variant } from "@seldon/core"
import type { Placement } from "@seldon/editor/lib/types"

export interface MoveRequest {
  targetNode: Variant | Instance
  subjectNode: Variant | Instance
  placement: Placement
  duplicate: boolean
}

/**
 * Applies a move request, as a preview or as a commit.
 *
 * Every drag that ends in a move goes through here, so the choice between moving
 * and copying, and between placing inside a node and beside one, is made once.
 */
export function useApplyMove() {
  const { moveNodeNextTo, moveNodeInside, duplicateNodeInside, duplicateNodeNextTo } =
    useMoveObjects()

  return useCallback(
    (request: MoveRequest, isPreview: boolean) => {
      const { targetNode, subjectNode, placement, duplicate } = request

      if (placement === "inside") {
        if (duplicate) {
          duplicateNodeInside({ targetNode, subjectNode, isPreview })
        } else {
          moveNodeInside({ targetNode, subjectNode, isPreview })
        }

        return
      }

      if (duplicate) {
        duplicateNodeNextTo({ targetNode, subjectNode, position: placement, isPreview })

        return
      }

      moveNodeNextTo({ targetNode, subjectNode, position: placement, isPreview })
    },
    [moveNodeNextTo, moveNodeInside, duplicateNodeInside, duplicateNodeNextTo],
  )
}
