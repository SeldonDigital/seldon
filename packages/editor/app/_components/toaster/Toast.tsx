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
      className={
        "px-6 py-4 bg-pearl rounded-xl shadow-lg outline outline-1 outline-black text-black"
      }
    >
      <p className="text-sm">{message}</p>
    </motion.div>
  )
}
