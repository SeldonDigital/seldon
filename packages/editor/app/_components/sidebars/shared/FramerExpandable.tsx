import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"

interface FramerExpandableProps {
  isExpanded: boolean
  children: ReactNode
}

/**
 * FramerExpandable provides smooth expand/collapse animations for tree nodes.
 * Uses Framer Motion's AnimatePresence and motion.div for height and opacity transitions.
 */
export function FramerExpandable({
  isExpanded,
  children,
}: FramerExpandableProps) {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
