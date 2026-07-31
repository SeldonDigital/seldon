import { useDragStateStore } from "@app/canvas/hooks/use-drag-state"
import { useCallback, useEffect, useRef } from "react"

import { useApplyMove } from "./use-apply-move"
import { useWorkspace } from "./use-workspace"

import type { MoveRequest } from "./use-apply-move"

/**
 * How long the hovered target must stay settled before the preview is written.
 * Sweeping the cursor across several targets keeps resetting this timer, so the
 * ones merely passed over never reach the canvas and the dragged node animates
 * to the slot the cursor pauses on in a single move.
 */
const PREVIEW_SETTLE_MS = 150

/**
 * The live preview an objects-sidebar drag writes while it is in flight, so the
 * canvas lays the reorder out under the cursor.
 *
 * A drag calls `begin` once, reports where it currently points with `target`, and
 * ends with `finish`. The row's own drop indicator updates immediately; the
 * preview written here lags behind by the settle delay.
 */
export function useMovePreviewSession() {
  const applyMove = useApplyMove()
  const { startPreviewSession, rollbackPreview } = useWorkspace()
  const setIsDragging = useDragStateStore((state) => state.setIsDragging)

  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settledRequest = useRef<MoveRequest | null>(null)

  const clearSettleTimer = useCallback(() => {
    if (settleTimer.current === null) return

    clearTimeout(settleTimer.current)
    settleTimer.current = null
  }, [])

  const begin = useCallback(() => {
    settledRequest.current = null
    setIsDragging(true)
    startPreviewSession()
  }, [setIsDragging, startPreviewSession])

  /**
   * Points the session at a slot, or at nothing. A repeat of the current slot is
   * ignored, so a caller may report on every pointer move. Losing the slot rolls
   * the preview back at once, without waiting on the settle delay, so the canvas
   * returns to the committed order as soon as the cursor leaves.
   */
  const target = useCallback(
    (request: MoveRequest | null) => {
      if (isSameRequest(settledRequest.current, request)) return

      settledRequest.current = request
      clearSettleTimer()

      if (!request) {
        rollbackPreview()

        return
      }

      settleTimer.current = setTimeout(() => {
        settleTimer.current = null
        applyMove(request, true)
      }, PREVIEW_SETTLE_MS)
    },
    [applyMove, clearSettleTimer, rollbackPreview],
  )

  /**
   * Commits the drop, if it lands on a slot, and ends the session. The commit
   * runs while the preview is still active and the rollback follows it, because
   * the preview already holds the reordered state and both render the same order.
   * Rolling back first would flash the node back to its origin before animating
   * forward again.
   */
  const finish = useCallback(
    (request: MoveRequest | null) => {
      clearSettleTimer()
      settledRequest.current = null

      if (request) {
        applyMove(request, false)
      }

      rollbackPreview()
      setIsDragging(false)
    },
    [applyMove, clearSettleTimer, rollbackPreview, setIsDragging],
  )

  useEffect(() => clearSettleTimer, [clearSettleTimer])

  return {
    begin,
    target,
    finish,
  }
}

function isSameRequest(left: MoveRequest | null, right: MoveRequest | null): boolean {
  if (!left || !right) return left === right

  return (
    left.targetNode.id === right.targetNode.id &&
    left.subjectNode.id === right.subjectNode.id &&
    left.placement === right.placement &&
    left.duplicate === right.duplicate
  )
}
