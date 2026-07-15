// BESPOKE-VIEW: hand-authored expand/collapse animation for sidebar tree nodes.
import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"

interface FramerExpandableProps {
  isExpanded: boolean
  children: ReactNode
}

const collapsed = { height: 0, opacity: 0 }
const expanded = { height: "auto", opacity: 1 }
const transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }

/**
 * Provides smooth expand/collapse animations for tree nodes. Uses Framer
 * Motion's AnimatePresence and motion.div for height and opacity transitions.
 */
export function FramerExpandable({
  isExpanded,
  children,
}: FramerExpandableProps) {
  const panel = isExpanded ? (
    <motion.div
      initial={collapsed}
      animate={expanded}
      exit={collapsed}
      transition={transition}
    >
      {children}
    </motion.div>
  ) : null

  return <AnimatePresence initial={false}>{panel}</AnimatePresence>
}
