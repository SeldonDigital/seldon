import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { HSL } from "@seldon/core"

export type OptionsType<ItemT> = ItemT[] | Array<ItemT[]>

interface ComboboxStateProps<ItemT> {
  value?: string
  options: OptionsType<ItemT>
  onValueChange: (value: string) => void
  validateCustomValue?: (value: string) => boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

export function useComboboxState<
  ItemT extends { name: string; value: string; color?: HSL },
>({
  value,
  options,
  onValueChange,
  validateCustomValue,
  inputRef,
}: ComboboxStateProps<ItemT>) {
  const [open, setOpen] = useState(false)
  const [shouldFilter, setShouldFilter] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(
    undefined,
  )
  const hasSections = Array.isArray(options[0])
  const isManualSubmit = useRef(false)
  // True while the highlight is being driven by Arrow-key navigation, so Enter
  // selects the highlighted option instead of matching the typed text.
  const keyboardNavRef = useRef(false)
  const flatOptions = useMemo(() => {
    return hasSections
      ? (options as Array<ItemT[]>).flat()
      : (options as ItemT[])
  }, [hasSections, options])

  const isNavigable = (option: ItemT) =>
    !("hidden" in option && option.hidden) &&
    !("disabled" in option && option.disabled)

  const navigableOptions = useMemo(
    () => flatOptions.filter(isNavigable),
    [flatOptions],
  )

  const currentValueOption = flatOptions.find((o) => o.value === value)

  const filteredOptions = useMemo(() => {
    if (!inputValue || !shouldFilter) return options

    function filterGroup(group: ItemT[]) {
      return group.filter(function (option) {
        return option.name.toLowerCase().includes(inputValue.toLowerCase())
      })
    }

    if (hasSections) {
      return (options as Array<ItemT[]>).map(filterGroup)
    } else {
      return filterGroup(options as ItemT[])
    }
  }, [options, inputValue, shouldFilter, hasSections])

  // The currently visible, selectable options. Arrow navigation walks these so a
  // filtered combo only steps through results that are actually on screen.
  const navigableFilteredOptions = useMemo(() => {
    const flat = hasSections
      ? (filteredOptions as ItemT[][]).flat()
      : (filteredOptions as ItemT[])
    return flat.filter(isNavigable)
  }, [filteredOptions, hasSections])

  useEffect(() => {
    if (!open) {
      setHighlightedValue(undefined)
      return
    }

    keyboardNavRef.current = false
    const currentIndex = navigableOptions.findIndex(
      (option) => option.value === value,
    )
    setHighlightedValue(
      navigableOptions[currentIndex >= 0 ? currentIndex : 0]?.value,
    )
  }, [open, value, navigableOptions])

  const moveHighlight = useCallback(
    (direction: 1 | -1) => {
      const items = navigableFilteredOptions
      if (items.length === 0) return
      keyboardNavRef.current = true
      if (!open) setOpen(true)
      setHighlightedValue((current) => {
        const currentIndex = items.findIndex((o) => o.value === current)
        if (currentIndex === -1) {
          return items[direction === 1 ? 0 : items.length - 1]?.value
        }
        const nextIndex =
          (currentIndex + direction + items.length) % items.length
        return items[nextIndex]?.value
      })
    },
    [navigableFilteredOptions, open],
  )

  const highlightNext = useCallback(() => moveHighlight(1), [moveHighlight])
  const highlightPrev = useCallback(() => moveHighlight(-1), [moveHighlight])

  function handleSelect(selectedValue: string) {
    if (isManualSubmit.current) {
      isManualSubmit.current = false
      return
    }

    const option = flatOptions.find((o) => o.value === selectedValue)
    if (option) {
      setInputValue(option.name)
      handleValueChange(option.value)
    }

    setOpen(false)
  }

  function handleInputChange(newValue: string) {
    setShouldFilter(true)
    // Typing expresses custom intent, so Enter should match the text, not the
    // option last reached by Arrow keys.
    keyboardNavRef.current = false
    setInputValue(newValue)
  }

  // `keepFocus` commits the value without blurring the input, so Tab can apply
  // the value and still let the browser move focus to the next control.
  function handleSubmitInput(options?: { keepFocus?: boolean }) {
    isManualSubmit.current = true
    const keepFocus = options?.keepFocus ?? false

    // After Arrow navigation, Enter commits the highlighted option even when the
    // input still shows the previously selected name.
    if (keyboardNavRef.current && highlightedValue) {
      const highlightedOption = navigableFilteredOptions.find(
        (o) => o.value === highlightedValue,
      )
      if (highlightedOption) {
        setInputValue(highlightedOption.name)
        handleValueChange(highlightedOption.value)
        setOpen(false)
        if (!keepFocus) inputRef.current?.blur()
        setTimeout(() => {
          isManualSubmit.current = false
        }, 0)
        return
      }
    }

    const nextSelectedOption = flatOptions.find(
      (o) => o.name.toLowerCase() === inputValue.toLowerCase(),
    )

    const currentlySelectedOption = flatOptions.find(
      (o) => o.value.toLowerCase() === value?.toLowerCase(),
    )

    if (nextSelectedOption) {
      handleValueChange(nextSelectedOption.value)
    } else if (validateCustomValue && validateCustomValue(inputValue)) {
      handleValueChange(inputValue)
    } else {
      setInputValue(currentlySelectedOption?.name || "")
    }
    setOpen(false)

    if (!keepFocus) inputRef.current?.blur()

    setTimeout(() => {
      isManualSubmit.current = false
    }, 0)
  }

  function handleValueChange(nextValue: string) {
    onValueChange(nextValue)
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setShouldFilter(false)
    }

    document.addEventListener("keydown", handleKeyDown)

    return function () {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  return {
    open,
    setOpen,
    inputValue,
    setInputValue,
    filteredOptions,
    handleSelect,
    handleInputChange,
    handleSubmitInput,
    highlightedValue,
    setHighlightedValue,
    highlightNext,
    highlightPrev,
    currentValueOption,
    flatOptions,
  }
}
