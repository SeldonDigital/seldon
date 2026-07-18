import { defineStore } from "pinia"
import { ref } from "vue"

export type Toast = {
  id: string
  message: string
}

// Mirrors the React editor's toast store. Dispatch surfaces validation errors
// here; the Toaster component renders the stack.
export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([])

  function addToast(message: string): void {
    const id = crypto.randomUUID()
    toasts.value = [...toasts.value, { id, message }]
    setTimeout(() => removeToast(id), 5000)
  }

  function removeToast(id: string): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return { toasts, addToast, removeToast }
})
