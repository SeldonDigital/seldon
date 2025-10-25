import { useRef } from "react"
import { useEffect } from "react"

// Custom hooks
export function useFocusOnMount(shouldFocus: boolean) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (shouldFocus) {
      const timeout = setTimeout(() => ref.current?.focus(), 10)
      return () => clearTimeout(timeout)
    }
  }, [shouldFocus])

  return ref
}
