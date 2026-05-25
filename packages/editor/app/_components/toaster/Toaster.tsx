"use client"

import { AnimatePresence } from "framer-motion"
import { useShallow } from "zustand/react/shallow"
import { Toast } from "./Toast"
import { useToastStore } from "./use-toast-store"

export function Toasts() {
  const toasts = useToastStore(useShallow((state) => state.toasts))

  return (
    <div className="absolute bottom-12 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
