import { motion } from "framer-motion"

import type { DragControls } from "framer-motion"
import type { CSSProperties } from "react"

/** Zero-size and non-interactive: the agent hosts the gesture and never paints. */
const agentStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  pointerEvents: "none",
}

/** Pinned to its origin, so the gesture reports movement without moving anything. */
const agentConstraints = { top: 0, left: 0, right: 0, bottom: 0 }

interface CanvasDragAgentProps {
  controls: DragControls
  onDragStart: () => void
  onDrag: (event: MouseEvent | TouchEvent | PointerEvent) => void
  onDragEnd: () => void
}

/**
 * Hosts a canvas node drag for Framer. A canvas node is a rendered component, not
 * a motion element, so the press on it starts the drag through `controls` and this
 * agent reports the gesture. It carries no appearance of its own, because the
 * lifted copy of the node and the drop marks are the feedback.
 */
export function CanvasDragAgent({
  controls,
  onDragStart,
  onDrag,
  onDragEnd,
}: CanvasDragAgentProps) {
  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={agentConstraints}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      style={agentStyle}
    />
  )
}
