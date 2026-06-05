import { useCallback, useEffect, useRef, useState } from "react"

interface UseKeyboardNavigationProps {
  open: boolean
  options:
    | Array<{
        value: string
        name: string
        hidden?: boolean
        disabled?: boolean
      }>
    | Array<
        Array<{
          value: string
          name: string
          hidden?: boolean
          disabled?: boolean
        }>
      >
  currentValue?: string
  onSelect: (value: string) => void
  onClose?: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

export function useKeyboardNavigation({
  open,
  options,
  currentValue,
  onSelect,
  onClose,
  inputRef,
}: UseKeyboardNavigationProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const optionsRef = useRef<HTMLElement[]>([])

  // Flatten options for easier navigation
  const flatOptions = Array.isArray(options[0])
    ? (
        options as Array<
          Array<{
            value: string
            name: string
            hidden?: boolean
            disabled?: boolean
          }>
        >
      ).flat()
    : (options as Array<{
        value: string
        name: string
        hidden?: boolean
        disabled?: boolean
      }>)

  // Filter out hidden and disabled options for navigation
  const navigableOptions = flatOptions.filter(
    (option) => !option.hidden && !option.disabled,
  )

  // Reset highlighted index when menu opens/closes or options change
  useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1)
      return
    }

    // Find the index of the current value in navigable options
    const currentIndex = navigableOptions.findIndex(
      (option) => option.value === currentValue,
    )
    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
  }, [open, currentValue, navigableOptions])

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && open && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [highlightedIndex, open])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault()
          event.stopPropagation()
          setHighlightedIndex((prev) => {
            const next = prev < navigableOptions.length - 1 ? prev + 1 : 0
            return next
          })
          break
        }

        case "ArrowUp": {
          event.preventDefault()
          event.stopPropagation()
          setHighlightedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : navigableOptions.length - 1
            return next
          })
          break
        }

        case "Enter": {
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < navigableOptions.length
          ) {
            event.preventDefault()
            event.stopPropagation()
            const selectedOption = navigableOptions[highlightedIndex]
            if (selectedOption && !selectedOption.disabled) {
              onSelect(selectedOption.value)
            }
          }
          break
        }

        case "Escape": {
          event.preventDefault()
          event.stopPropagation()
          onClose?.()
          inputRef.current?.blur()
          break
        }
      }
    },
    [open, highlightedIndex, navigableOptions, onSelect, onClose, inputRef],
  )

  // Register option refs
  const registerOptionRef = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) {
        optionsRef.current[index] = element
      }
    },
    [],
  )

  // Get the highlighted option value
  const highlightedValue =
    highlightedIndex >= 0 && highlightedIndex < navigableOptions.length
      ? navigableOptions[highlightedIndex]?.value
      : undefined

  return {
    handleKeyDown,
    highlightedIndex,
    highlightedValue,
    registerOptionRef,
    navigableOptions,
  }
}
