import { cn } from "@lib/utils/cn"
import { useEffect, useRef, useState } from "react"

export function LabelInput({
  initialValue,
  onSubmit,
}: {
  initialValue: string
  onSubmit: (newLabel: string) => void
}) {
  const [newLabel, setNewLabel] = useState(initialValue ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  return (
    <input
      className={cn(
        "-ml-1.5 flex-1 select-auto appearance-none truncate rounded-sm bg-white px-1.5 py-1 text-sm text-black",
        "focus:outline focus:outline-sky-600",
      )}
      value={newLabel ?? ""}
      onChange={(event) => setNewLabel(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur()
        } else if (event.key === "Escape") {
          event.preventDefault()

          onSubmit(newLabel.trim())
        }
      }}
      onBlur={handleInputBlur}
      ref={inputRef}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  )

  function handleInputBlur() {
    onSubmit(newLabel.trim())
  }
}
