"use client"

import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { Frame } from "@seldon/components/frames/Frame"
import {
  EXPLODE_BACKDROP_INK_PERCENT,
  EXPLODE_PERSPECTIVE_PX,
  EXPLODE_SHADOW_COLOR_PROPERTY,
  EXPLODE_SHADOW_INK_PERCENT,
} from "@seldon/editor/lib/exploded/exploded-constants"
import { EXPLODED_WORLD_TRANSFORM, getExplodedCss } from "@seldon/editor/lib/exploded/exploded-css"
import { createExplodedView } from "@seldon/editor/lib/exploded/exploded-view"
import { useLayoutEffect, useMemo, useRef } from "react"

import { CssPortal } from "../canvas/CssPortal"
import { StyleTag } from "../canvas/StyleTag.bespoke"

import type { CSSProperties } from "react"

/**
 * The rendered variant to copy, and how much the surface it is rendered on magnifies it.
 * A variant rendered at its own size leaves the scale out.
 */
export interface ExplodedSource {
  element: HTMLElement
  scale?: number
}

/**
 * What the stage draws. `resolveSource` returns the variant to copy, read when the stage
 * builds rather than held, so a caller does not have to keep the element in state to hand
 * it over. It returns nothing while there is nothing to copy yet.
 *
 * The stage rebuilds whenever this callback changes. The copy is taken from what is on
 * screen, which the stage cannot watch for itself, so a caller lists whatever it wants a
 * rebuild for among the callback's own dependencies.
 */
export interface ExplodedStageProps {
  resolveSource: () => ExplodedSource | null
}

// The rules do not depend on what is on screen. The stylesheet is therefore built once
// and mounted with the stage.
const explodedCss = getExplodedCss()

/**
 * The stage keeps the scene clear of whatever is around it and gives it a backdrop to
 * stand against. A turned scene reaches past its own box, so the stage never clips.
 *
 * The backdrop is a soft gradient. It stays clear through the middle, takes on ink toward
 * the sides, and is darkest in the corners.
 *
 * `ink` is the neutral swatch that contrasts with the surface behind the stage in the
 * current interface mode. The backdrop and the surface shadows both use it.
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

// The world keeps its own size. A stack wider than the stage therefore turns instead of
// being squeezed by it.
const worldStyle: CSSProperties = {
  flexShrink: 0,
  transformStyle: "preserve-3d",
  transform: EXPLODED_WORLD_TRANSFORM,
}

/**
 * A rendered variant shown as separated surfaces the viewer can turn.
 *
 * The stage draws a copy of what is already on screen. Nothing in it can be selected and
 * no overlay tracks it, so it may be placed anywhere a variant is rendered. The copy is
 * dropped when the stage unmounts, which releases the whole view.
 */
export function ExplodedStage({ resolveSource }: ExplodedStageProps) {
  const resolvedMode = useResolvedInterfaceMode()
  const stageRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLElement>(null)

  // The neutral swatches swap with the interface mode, so the stage picks the one that
  // contrasts with the surface behind it. The backdrop and the shadows both use it.
  const ink = resolvedMode === "dark" ? "var(--sdn-swatch-offWhite)" : "var(--sdn-swatch-offBlack)"
  const stageStyle = useMemo<CSSProperties>(() => getStageStyle(ink), [ink])

  useLayoutEffect(() => {
    const stage = stageRef.current
    const world = worldRef.current

    if (!stage || !world) return

    const source = resolveSource()

    if (!source) return

    const view = createExplodedView({ source: source.element, stage, world, scale: source.scale })

    return view.destroy
  }, [resolveSource])

  return (
    <>
      <CssPortal>
        <StyleTag css={explodedCss} styleFor="exploded-view" />
      </CssPortal>
      <Frame ref={stageRef} style={stageStyle}>
        <Frame ref={worldRef} style={worldStyle} />
      </Frame>
    </>
  )
}
