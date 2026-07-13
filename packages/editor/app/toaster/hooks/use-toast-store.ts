import { nanoid } from "nanoid"
import { create } from "zustand"

interface Toast {
  id: string
  message: string
  intent: ToastIntent
}

export type ToastIntent = "status" | "success" | "error"

interface AddToastOptions {
  durationMs?: number
  intent?: ToastIntent
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, options?: AddToastOptions) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, options) => {
    const id = nanoid(8)
    const durationMs = options?.durationMs ?? 5000
    set((state) => ({
      toasts: [
        ...state.toasts,
        { message, id, intent: options?.intent ?? "status" },
      ],
    }))
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, durationMs)
  },
}))
