import * as Portal from "@radix-ui/react-portal"
import { motion } from "framer-motion"
import { CSSProperties } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { HeaderPanelsClose } from "../../../seldon/chrome/elements/HeaderPanelsClose"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "../../constants"
import { useFloatingPanel } from "./use-floating-panel"

export type FloatingPanelProps = {
  handleClose: () => void
  children: React.ReactNode
  initialPosition?: { x?: number; y?: number }
  initialWidth?: number
  initialHeight?: number
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  preventInteractionOutside?: boolean
  title?: string
  testId?: string
  isOpen?: boolean
}

export function FloatingPanel({
  handleClose,
  children,
  initialPosition = {},
  initialWidth = PANEL_INITIAL_WIDTH,
  initialHeight = PANEL_INITIAL_HEIGHT,
  closeOnClickOutside = false,
  closeOnEscape = true,
  preventInteractionOutside = false,
  title,
  testId,
  isOpen = true,
}: FloatingPanelProps) {
  const {
    x,
    y,
    width,
    height,
    handleResizeStart,
    handleResize,
    moveControls,
    dragConstraints,
  } = useFloatingPanel({
    initialPosition: {
      x: initialPosition.x ?? 0.5 * window.innerWidth - 0.5 * initialWidth,
      y: initialPosition.y ?? 0.5 * window.innerHeight - 0.5 * initialHeight,
    },
    initialSize: { width: initialWidth, height: initialHeight },
    handleClose,
    closeOnEscape,
  })

  useHotkeys("esc", handleClose, { enabled: isOpen })

  if (!isOpen) return null

  return (
    <>
      {(closeOnClickOutside || preventInteractionOutside) && (
        <div
          onClick={closeOnClickOutside ? handleClose : undefined}
          style={{ position: "fixed", inset: 0, zIndex: 30 }}
        />
      )}
      <Portal.Root>
        <motion.div
          drag
          style={{
            x,
            y,
            width,
            height,
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 40,
          }}
          dragControls={moveControls}
          dragMomentum={false}
          dragElastic={false}
          dragConstraints={dragConstraints}
          dragListener={false}
          data-testid={testId}
          className="variant-dialog-default"
        >
          <HeaderPanelsClose
            onPointerDown={(event) => moveControls.start(event)}
            titleProps={{
              children: title,
              style: styles.title,
            }}
            buttonIconicProps={{
              onClick: handleClose,
            }}
          />
          {children}
          {(
            [
              "top",
              "right",
              "bottom",
              "left",
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ] as const
          ).map((side) => (
            <motion.div
              key={side}
              onPan={(_event, info) => handleResize(side, info)}
              onPointerDown={handleResizeStart}
              style={getResizeHandleStyle(side)}
            />
          ))}
        </motion.div>
      </Portal.Root>
    </>
  )
}

const styles: Record<string, CSSProperties> = {
  title: {
    alignSelf: "center",
    color: "white",
    flex: "1 0 0",
    fontSize: "14px",
  },
}

type ResizeSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

const EDGE = "0.5rem"

function getResizeHandleStyle(side: ResizeSide): CSSProperties {
  const style: CSSProperties = { position: "absolute", touchAction: "none" }

  if (side.includes("bottom")) {
    style.bottom = 0
    style.height = EDGE
  }
  if (side.includes("left")) {
    style.left = 0
    style.width = EDGE
  }
  if (side.includes("right")) {
    style.right = 0
    style.width = EDGE
  }
  if (side.includes("top")) {
    style.top = 0
    style.height = EDGE
  }

  switch (side) {
    case "top":
    case "bottom":
      style.left = EDGE
      style.right = EDGE
      style.cursor = "ns-resize"
      break
    case "left":
    case "right":
      style.top = EDGE
      style.bottom = EDGE
      style.cursor = "ew-resize"
      break
    case "top-left":
    case "bottom-right":
      style.cursor = "nwse-resize"
      break
    case "top-right":
    case "bottom-left":
      style.cursor = "nesw-resize"
      break
  }

  return style
}
