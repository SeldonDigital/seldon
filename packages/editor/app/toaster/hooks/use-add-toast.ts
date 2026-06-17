import { useShallow } from "zustand/react/shallow"
import { useToastStore } from "./use-toast-store"

export function useAddToast() {
  return useToastStore(useShallow((state) => state.addToast))
}
