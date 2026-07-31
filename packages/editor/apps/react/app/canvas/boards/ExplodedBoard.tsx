"use client"

import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import {
  EXPLODE_BACKDROP_INK_PERCENT,
  EXPLODE_PERSPECTIVE_PX,
  EXPLODE_SHADOW_COLOR_PROPERTY,
  EXPLODE_SHADOW_INK_PERCENT,
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

// The rules do not depend on what is on the canvas. The stylesheet is therefore built
// once and mounted with the view.
const explodedCss = getExplodedCss()

// The row stretches to span the sheet instead of shrinking to fit the scene.
const wrapperStyle: CSSProperties = {
  position: "relative",
  alignSelf: "stretch",
}

/**
 * The stage keeps the scene clear of the rows around it and gives it a backdrop to stand
 * against. A turned scene reaches past its own box, so the stage never clips.
 *
 * The backdrop is a soft gradient. It stays clear through the middle, takes on ink toward
 * the sides, and is darkest in the corners.
 *
 * `ink` is the neutral swatch that contrasts with the sheet in the current interface
 * mode. The backdrop and the surface shadows both use it, so they follow the same color
 * the board already picked for its label.
 *
 * The shadow color travels through a custom property. The stylesheet is built once at
 * module load, and the interface mode is not known then.
 */
function getStageStyle(ink: string): CSSProperties {
  const backdropInk = `color-mix(in srgb, ${ink} ${EXPLODE_BACKDROP_INK_PERCENT}%, transparent)`
  const shadowColor = `color-mix(in srgb, ${ink} ${EXPLODE_SHADOW_INK_PERCENT}%, transparent)`
  const shadow = { [EXPLODE_SHADOW_COLOR_PROPERTY]: shadowColor } as CSSProperties

  return {
    ...shadow,

    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--sdn-paddings-open)",
    overflow: "visible",
    perspective: `${EXPLODE_PERSPECTIVE_PX}px`,
    perspectiveOrigin: "50% 50%",
    touchAction: "none",
    background: `radial-gradient(ellipse 78% 92% at 50% 42%, transparent 28%, ${backdropInk} 100%)`,
  }
}

// The world keeps its own size. A stack wider than the row therefore turns instead of
// being squeezed by the stage.
const worldStyle: CSSProperties = {
  flexShrink: 0,
  transformStyle: "preserve-3d",
  transform: EXPLODED_WORLD_TRANSFORM,
}

/**
 * Row showing the anchored variant as separated surfaces.
 *
 * The row draws a copy of the rendered variant. Nothing in it can be selected and no
 * overlay tracks it. The row rebuilds the copy whenever the workspace changes, and drops
 * it when the row unmounts on leaving isolation.
 */
export function ExplodedBoard({ anchorBoardKey, variantRootId, ready }: ExplodedBoardProps) {
  const { workspace } = useWorkspace()
  const resolvedMode = useResolvedInterfaceMode()
  const stageRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLElement>(null)

  // The neutral swatches swap with the interface mode, so the board picks the one that
  // contrasts with the sheet. The label, the backdrop, and the shadows all use it.
  const ink = resolvedMode === "dark" ? "var(--sdn-swatch-offWhite)" : "var(--sdn-swatch-offBlack)"
  const labelStyle = useMemo<CSSProperties>(() => ({ color: ink }), [ink])
  const stageStyle = useMemo<CSSProperties>(() => getStageStyle(ink), [ink])

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
