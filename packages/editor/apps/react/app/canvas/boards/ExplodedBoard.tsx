"use client"

import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { getRenderedScale } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { useCallback, useMemo } from "react"

import { ExplodedStage } from "../../exploded/ExplodedStage"

import type { ExplodedSource } from "../../exploded/ExplodedStage"
import type { CSSProperties } from "react"

/**
 * What the row draws. `anchorBoardKey` is the board the gallery is anchored to, which
 * holds the variant to copy. `variantRootId` is the variant root frozen on entering
 * isolation.
 *
 * `ready` tells the row that the gallery has finished measuring. The copy comes from the
 * rendered variant, so the row waits until the anchored board reaches its final width.
 */
export interface ExplodedBoardProps {
  anchorBoardKey: string
  variantRootId: string
  ready: boolean
}

const EXPLODED_LABEL = "Isolation Mode"

// The row stretches to span the sheet instead of shrinking to fit the scene.
const wrapperStyle: CSSProperties = {
  position: "relative",
  alignSelf: "stretch",
}

/**
 * Row showing the anchored variant as separated surfaces.
 *
 * The row finds the variant on the canvas and hands it to the stage, which draws the copy.
 * The copy is rebuilt whenever the workspace changes, and dropped when the row unmounts on
 * leaving isolation.
 */
export function ExplodedBoard({ anchorBoardKey, variantRootId, ready }: ExplodedBoardProps) {
  const { workspace } = useWorkspace()
  const resolvedMode = useResolvedInterfaceMode()

  // The neutral swatches swap with the interface mode, so the board picks the one that
  // contrasts with the sheet, the same way every other board caption does.
  const ink = resolvedMode === "dark" ? "var(--sdn-swatch-offWhite)" : "var(--sdn-swatch-offBlack)"
  const labelStyle = useMemo<CSSProperties>(() => ({ color: ink }), [ink])

  // Rebuilt on every workspace change, since the copy is taken from what the anchored
  // board rendered and an edit leaves it showing the design before that edit.
  const resolveSource = useCallback((): ExplodedSource | null => {
    if (!ready) return null

    const board = document.querySelector<HTMLElement>(
      `[data-board-id="${CSS.escape(anchorBoardKey)}"]`,
    )
    const element = board?.querySelector<HTMLElement>(
      `[data-selection-root-id="${CSS.escape(variantRootId)}"]`,
    )

    if (!board || !element) return null

    // Read the zoom off the board rather than the variant, so a variant that turns
    // itself does not enter into it.
    return { element, scale: getRenderedScale(board) }
  }, [ready, anchorBoardKey, variantRootId, workspace])

  return (
    <Frame style={wrapperStyle}>
      <Frame className="isolation-board-label" style={labelStyle}>
        {EXPLODED_LABEL}
      </Frame>
      <ExplodedStage resolveSource={resolveSource} />
    </Frame>
  )
}
