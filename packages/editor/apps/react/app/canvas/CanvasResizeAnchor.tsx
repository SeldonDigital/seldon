"use client"

import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { useEffect, useRef } from "react"
import { useControls, useTransformContext } from "react-zoom-pan-pinch"

/**
 * Holds the board still when the canvas pane changes width.
 *
 * The board is flex-centered in the canvas pane, so its base position is halfway across it.
 * Toggling a sidebar or the properties palette changes the pane's width, which moves that
 * center and slides the board even though nothing panned. This watches the pane's width and
 * shifts the pan by half the change the other way, so the board keeps its place on screen.
 * Vertical needs no such fix: the board is top-anchored, so a height change does not move it.
 */
export function CanvasResizeAnchor() {
  const { setTransform } = useControls()
  const context = useTransformContext()

  // `useControls` and `useTransformContext` return a fresh object each render, so both are held
  // in a ref. The observer is then set up once on mount rather than torn down and rebuilt every
  // render, which would keep resetting the width baseline and drop the very change it exists to
  // catch.
  const setTransformRef = useRef(setTransform)
  const contextRef = useRef(context)
  setTransformRef.current = setTransform
  contextRef.current = context

  useEffect(() => {
    const canvas = getCanvasElement()

    if (!canvas) return

    // The board is centered by CSS at whatever width the pane settles to on launch, so the
    // initial layout is not a move to hold against. Observing is deferred past the mount
    // settle, and the baseline is then taken from the first callback rather than measured up
    // front. Compensating for the settle would push the board offscreen on launch; only a
    // later change, from toggling a sidebar or the palette, is a real move to hold.
    let width: number | null = null
    let observer: ResizeObserver | null = null

    const start = (): void => {
      observer = new ResizeObserver((entries) => {
        const next = entries[0]?.contentRect.width

        if (next === undefined) return

        if (width === null) {
          width = next

          return
        }

        const delta = next - width

        width = next

        if (delta === 0) return

        const { positionX, positionY, scale } = contextRef.current.transformState

        setTransformRef.current(positionX - delta / 2, positionY, scale, 0)
      })

      observer.observe(canvas)
    }

    let innerRaf = 0
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(start)
    })

    return () => {
      cancelAnimationFrame(outerRaf)
      cancelAnimationFrame(innerRaf)
      observer?.disconnect()
    }
  }, [])

  return null
}
