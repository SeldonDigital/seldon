import React, { FC, useCallback, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import {
  TransformWrapper as ReactTransformWrapper,
  useControls,
} from "react-zoom-pan-pinch"
import { usePreview } from "@lib/hooks/use-preview"
import { useTextFieldFocus } from "@lib/hooks/use-text-field-focus"
import { useZoomControlsStore } from "@lib/hooks/use-zoom-controls"

export const TRANSFORM_WRAPPER_INITIAL_POSITION_X = 0
export const TRANSFORM_WRAPPER_INITIAL_POSITION_Y = 30

type Props = {
  children: React.ReactNode
}

export const TransformWrapper: FC<Props> = ({ children }) => {
  const isTextFieldFocused = useTextFieldFocus()
  const [metaPressed, setMetaPressed] = useState(false)
  const { isInPreviewMode } = usePreview()
  const activateShortCuts = !isInPreviewMode

  useHotkeys("meta", (event) => setMetaPressed(event.type === "keydown"), {
    keyup: true,
    keydown: true,
  })

  return (
    <ReactTransformWrapper
      initialPositionY={TRANSFORM_WRAPPER_INITIAL_POSITION_Y}
      initialPositionX={TRANSFORM_WRAPPER_INITIAL_POSITION_X}
      initialScale={1}
      minScale={isInPreviewMode ? 1 : 2 ** -5}
      maxScale={isInPreviewMode ? 1 : 2 ** 5}
      limitToBounds={false}
      zoomAnimation={{ disabled: true }}
      doubleClick={{ disabled: true }}
      wheel={{
        wheelDisabled: !metaPressed,
      }}
      panning={{
        lockAxisX: isInPreviewMode,
        wheelPanning: !metaPressed,
        activationKeys: [" "],
        allowMiddleClickPan: false,
        allowRightClickPan: false,
      }}
      disabled={isTextFieldFocused}
    >
      <>
        {children}
        {activateShortCuts && <ZoomControls />}
      </>
    </ReactTransformWrapper>
  )
}

const ZoomControls = () => {
  const { zoomIn, zoomOut, setTransform } = useControls()
  const { zoomInCounter, zoomOutCounter, resetZoomCounter } =
    useZoomControlsStore()

  const resetZoom = useCallback(() => {
    setTransform(
      TRANSFORM_WRAPPER_INITIAL_POSITION_X,
      TRANSFORM_WRAPPER_INITIAL_POSITION_Y,
      1,
      0,
    )
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
