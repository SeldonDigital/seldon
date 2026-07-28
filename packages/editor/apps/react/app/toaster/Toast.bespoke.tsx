// BESPOKE-VIEW: hand-authored transitional View with inline token styling.
// Replace with a generated workspace component once one covers the toast card.
import { motion } from "framer-motion"

import type { CSSProperties } from "react"

interface ToastProps {
  message: string
}

/** How far a toast rises as it arrives, in animation pixels rather than layout. */
const RISE_DISTANCE = 10

const toastVariants = {
  initial: { opacity: 0, y: RISE_DISTANCE },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: RISE_DISTANCE },
}

const toastStyle: CSSProperties = {
  padding: "var(--sdn-paddings-cozy)",
  backgroundColor: "var(--sdn-swatch-white)",
  borderRadius: "var(--sdn-corners-compact)",
  boxShadow:
    "0 var(--sdn-sizes-xsmall) var(--sdn-sizes-small) color-mix(in srgb, var(--sdn-swatch-black) 15%, transparent)",
  outline: "var(--sdn-border-width-small) solid var(--sdn-swatch-black)",
  color: "var(--sdn-swatch-black)",
}

const messageStyle: CSSProperties = { fontSize: "var(--sdn-font-size-small)" }

/** Animated toast card. */
export function Toast({ message }: ToastProps) {
  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={toastStyle}
    >
      <p style={messageStyle}>{message}</p>
    </motion.div>
  )
}
