import { useEffect, useState } from "react"

export function useTextFieldFocus() {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false)

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      setIsTextFieldFocused(
        ["input", "textarea"].includes(target.tagName.toLowerCase()),
      )
    }

    const handleBlur = () => {
      setIsTextFieldFocused(false)
    }

    document.addEventListener("focusin", handleFocus)
    document.addEventListener("focusout", handleBlur)

    return () => {
      document.removeEventListener("focusin", handleFocus)
      document.removeEventListener("focusout", handleBlur)
    }
  }, [])

  return isTextFieldFocused
}
