import { motion } from "framer-motion"

interface ToastProps {
  id: string
  message: string
}

export function Toast({ message }: ToastProps) {
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  }

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        padding: "1rem 1.5rem",
        backgroundColor: "#F5F5F5",
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
