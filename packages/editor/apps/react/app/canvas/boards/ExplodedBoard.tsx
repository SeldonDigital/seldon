"use client"

import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import {
  EXPLODE_PERSPECTIVE_PX,
  EXPLODE_STAGE_PADDING_PX,
} from "@seldon/editor/lib/canvas/exploded/exploded-constants"
import {
  EXPLODED_WORLD_TRANSFORM,
  getExplodedCss,
} from "@seldon/editor/lib/canvas/exploded/exploded-css"
import { createExplodedView } from "@seldon/editor/lib/canvas/exploded/exploded-view"
import { useLayoutEffect, useMemo, useRef } from "react"

import { CssPortal } from "../CssPortal"
import { StyleTag } from "../StyleTag.bespoke"

import type { CSSProperties } from "react"

export interface ExplodedBoardProps {
  /** Board the gallery is anchored to, holding the variant to copy. */
  anchorBoardKey: string
  /** Variant root frozen on entering isolation. */
  variantRootId: string
  /**
   * The gallery has finished measuring. The copy is taken from the rendered
   * variant, so it has to wait until the anchored board is at its final width.
   */
  ready: boolean
}

const EXPLODED_LABEL = "Exploded View"

// The rules do not depend on what is on the canvas, so the stylesheet is built
// once and mounted with the view.
const explodedCss = getExplodedCss()

// Stretched so the row spans the sheet rather than shrinking to the scene.
const wrapperStyle: CSSProperties = {
  position: "relative",
  alignSelf: "stretch",
}

// The stage holds the scene away from the rows around it. A turned scene reaches
// past its own box, which is why it never clips.
const stageStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `${EXPLODE_STAGE_PADDING_PX}px`,
  overflow: "visible",
  perspective: `${EXPLODE_PERSPECTIVE_PX}px`,
  perspectiveOrigin: "50% 50%",
  touchAction: "none",
}

// Held at its own size, so a stack wider than the row is turned rather than
// squeezed by the stage.
const worldStyle: CSSProperties = {
  flexShrink: 0,
  transformStyle: "preserve-3d",
  transform: EXPLODED_WORLD_TRANSFORM,
}

/**
 * Row showing the anchored variant as separated layers.
 *
 * What it draws is a copy of the rendered variant, so nothing here is selectable
 * and no overlay tracks it. The copy is rebuilt when the workspace changes, since
 * it is a picture of the variant rather than a second rendering of it, and it is
 * dropped when the row unmounts on leaving isolation.
 */
export function ExplodedBoard({ anchorBoardKey, variantRootId, ready }: ExplodedBoardProps) {
  const { workspace } = useWorkspace()
  const resolvedMode = useResolvedInterfaceMode()
  const stageRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLElement>(null)

  const labelColor =
    resolvedMode === "dark" ? "var(--sdn-swatch-offWhite)" : "var(--sdn-swatch-offBlack)"
  const labelStyle = useMemo<CSSProperties>(() => ({ color: labelColor }), [labelColor])

  useLayoutEffect(() => {
    if (!ready) return

    const stage = stageRef.current
    const world = worldRef.current

    if (!stage || !world) return

    const source = document.querySelector<HTMLElement>(
      `[data-board-id="${CSS.escape(anchorBoardKey)}"] [data-selection-root-id="${CSS.escape(variantRootId)}"]`,
    )

    if (!source) return

    const view = createExplodedView({ source, stage, world })

    return view.destroy
  }, [ready, anchorBoardKey, variantRootId, workspace])

  return (
    <>
      <CssPortal>
        <StyleTag css={explodedCss} styleFor="exploded-view" />
      </CssPortal>
      <Frame style={wrapperStyle}>
        <Frame className="isolation-board-label" style={labelStyle}>
          {EXPLODED_LABEL}
        </Frame>
        <Frame ref={stageRef} style={stageStyle}>
          <Frame ref={worldRef} style={worldStyle} />
        </Frame>
      </Frame>
    </>
  )
}
