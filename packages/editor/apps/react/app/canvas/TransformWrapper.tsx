import { useZoomControlsStore } from "@app/canvas/hooks/use-zoom-controls"
import React, { useCallback, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { TransformWrapper as ReactTransformWrapper, useControls } from "react-zoom-pan-pinch"

import { CanvasOverlayTracker } from "./CanvasOverlayTracker"
import { CanvasResizeAnchor } from "./CanvasResizeAnchor"
import { CanvasScrollToSelection } from "./CanvasScrollToSelection"
import { CanvasTransformRemeasure } from "./CanvasTransformRemeasure"

import type { FC } from "react"

export const TRANSFORM_WRAPPER_INITIAL_POSITION_X = 0
export const TRANSFORM_WRAPPER_INITIAL_POSITION_Y = 50

/**
 * Space held during a drag is what pans. The key is only read at the drag, so a space
 * typed into a field is still just a space, and the transform stays live while a field
 * has focus. Passing an empty list here would mean no key at all is needed, which would
 * hand every plain drag on the canvas to the pan.
 */
const PAN_ACTIVATION_KEYS = [" "]

type Props = {
  children: React.ReactNode
}

export const TransformWrapper: FC<Props> = ({ children }) => {
  const [metaPressed, setMetaPressed] = useState(false)

  useHotkeys("meta", (event) => setMetaPressed(event.type === "keydown"), {
    keyup: true,
    keydown: true,
  })

  return (
    <ReactTransformWrapper
      initialPositionY={TRANSFORM_WRAPPER_INITIAL_POSITION_Y}
      initialPositionX={TRANSFORM_WRAPPER_INITIAL_POSITION_X}
      initialScale={1}
      minScale={2 ** -5}
      maxScale={2 ** 5}
      limitToBounds={false}
      zoomAnimation={{ disabled: true }}
      doubleClick={{ disabled: true }}
      wheel={{
        wheelDisabled: !metaPressed,
      }}
      panning={{
        lockAxisX: false,
        wheelPanning: !metaPressed,
        activationKeys: PAN_ACTIVATION_KEYS,
        allowMiddleClickPan: false,
        allowRightClickPan: false,
      }}
    >
      <>
        {children}
        <ZoomControls />
        <CanvasScrollToSelection />
        <CanvasOverlayTracker />
        <CanvasResizeAnchor />
        <CanvasTransformRemeasure />
      </>
    </ReactTransformWrapper>
  )
}

const ZoomControls = () => {
  const { zoomIn, zoomOut, setTransform } = useControls()
  const { zoomInCounter, zoomOutCounter, resetZoomCounter } = useZoomControlsStore()

  const resetZoom = useCallback(() => {
    setTransform(TRANSFORM_WRAPPER_INITIAL_POSITION_X, TRANSFORM_WRAPPER_INITIAL_POSITION_Y, 1, 0)
  }, [setTransform])

  // Handle zoom from menu using the counter from the store
  useEffect(() => {
    if (zoomInCounter > 0) {
      zoomIn(0.5, 0)
    }
  }, [zoomInCounter, zoomIn])

  useEffect(() => {
    if (zoomOutCounter > 0) {
      zoomOut(0.5, 0)
    }
  }, [zoomOutCounter, zoomOut])

  useEffect(() => {
    if (resetZoomCounter > 0) {
      resetZoom()
    }
  }, [resetZoomCounter, resetZoom])

  // Keep the keyboard shortcuts
  useHotkeys("mod+equal", () => zoomIn(0.5, 0), {
    preventDefault: true,
    enableOnFormTags: true,
  })
  useHotkeys("mod+minus", () => zoomOut(0.5, 0), {
    preventDefault: true,
    enableOnFormTags: true,
  })

  // We can't use resetTransform because it doesn't respect the initialPositionY
  useHotkeys("mod+0", resetZoom, {
    preventDefault: true,
    enableOnFormTags: true,
  })

  return null
}
