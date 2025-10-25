import { nanoid } from "nanoid"
import { create } from "zustand"

interface Toast {
  id: string
  message: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message) => {
    const id = nanoid(8)
    set((state) => ({
      toasts: [...state.toasts, { message, id }],
    }))
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)
  },
}))
