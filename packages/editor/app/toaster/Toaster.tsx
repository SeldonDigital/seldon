"use client"

import { AnimatePresence } from "framer-motion"
import { useShallow } from "zustand/react/shallow"
import { useToastStore } from "./hooks/use-toast-store"
import { Toast, ToastStack } from "@seldon/components/custom-components"

export function Toasts() {
  const toasts = useToastStore(useShallow((state) => state.toasts))

  return (
    <ToastStack>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} />
        ))}
      </AnimatePresence>
    </ToastStack>
  )
}
