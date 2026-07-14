// BESPOKE-VIEW: hand-authored framer-motion crossfade between the editor and
// preview layouts. Wraps children in AnimatePresence + motion.div.
import { AnimatePresence, motion } from "framer-motion"
import { CSSProperties, ReactNode } from "react"

interface EditorCrossfadeProps {
  /** Distinct key per layout so AnimatePresence crossfades on change. */
  transitionKey: string
  children: ReactNode
}

const crossfadeStyle: CSSProperties = { flex: 1 }
const initial = { opacity: 0, scale: 0.98 }
const animate = { opacity: 1, scale: 1 }
const exit = { opacity: 0, scale: 0.98 }
const transition = { duration: 0.25 }

/** Crossfades between the editor and preview layouts on mode change. */
export function EditorCrossfade({
  transitionKey,
  children,
}: EditorCrossfadeProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        style={crossfadeStyle}
        key={transitionKey}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
