// BESPOKE-VIEW: hand-authored transitional View with inline token styling.
// Replace with a generated workspace component once one covers the toast card.
import { motion } from "framer-motion"

interface ToastProps {
  message: string
}

const toastVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

/** Animated toast card. */
export function Toast({ message }: ToastProps) {
  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        padding: "1rem 1.5rem",
        backgroundColor: "var(--sdn-swatch-white)",
        borderRadius: "0.75rem",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        outline: "1px solid var(--sdn-swatch-black)",
        color: "var(--sdn-swatch-black)",
      }}
    >
      <p style={{ fontSize: "var(--sdn-font-size-small)" }}>{message}</p>
    </motion.div>
  )
}
