"use client"

import { AnimatePresence } from "framer-motion"
import { useShallow } from "zustand/react/shallow"
import { Toast } from "./Toast"
import { useToastStore } from "./hooks/use-toast-store"

export function Toasts() {
  const toasts = useToastStore(useShallow((state) => state.toasts))

  return (
    <div
      style={{
        position: "absolute",
        bottom: "3rem",
        left: "50%",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "var(--sdn-gap-compact)",
        transform: "translateX(-50%)",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
