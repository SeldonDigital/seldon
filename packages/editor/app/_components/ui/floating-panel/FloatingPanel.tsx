import { cn } from "@lib/utils/cn"
import * as Portal from "@radix-ui/react-portal"
import { motion } from "framer-motion"
import { CSSProperties } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { HeaderPanelsClose } from "@components/seldon/elements/HeaderPanelsClose"
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
          className="z-30 fixed inset-0"
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
          className="variant-panelDialog-default"
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
              className={cn(
                "absolute touch-none",
                side.includes("bottom") && "bottom-0 h-2",
                side.includes("left") && "left-0 w-2",
                side.includes("right") && "right-0 w-2",
                side.includes("top") && "top-0 h-2",
                side === "top" && "left-2 right-2 cursor-ns-resize",
                side === "right" && "bottom-2 top-2 cursor-ew-resize",
                side === "bottom" && " left-2 right-2 cursor-ns-resize",
                side === "left" && "bottom-2 top-2 cursor-ew-resize",
                side === "top-left" && "cursor-nwse-resize",
                side === "top-right" && "cursor-nesw-resize",
                side === "bottom-left" && "cursor-nesw-resize",
                side === "bottom-right" && "cursor-nwse-resize",
              )}
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
