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
  const flatOptions = useMemo(() => {
    return hasSections
      ? (options as Array<ItemT[]>).flat()
      : (options as ItemT[])
  }, [hasSections, options])

  const navigableOptions = useMemo(
    () =>
      flatOptions.filter(
        (option) =>
          !("hidden" in option && option.hidden) &&
          !("disabled" in option && option.disabled),
      ),
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

  useEffect(() => {
    if (!open) {
      setHighlightedValue(undefined)
      return
    }

    const currentIndex = navigableOptions.findIndex(
      (option) => option.value === value,
    )
    setHighlightedValue(
      navigableOptions[currentIndex >= 0 ? currentIndex : 0]?.value,
    )
  }, [open, value, navigableOptions])

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
    const option = flatOptions.find((o) =>
      o.name.toLowerCase().includes(newValue.toLowerCase()),
    )
    setInputValue(newValue)
  }

  function handleSubmitInput() {
    isManualSubmit.current = true

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

    inputRef.current?.blur()

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
    currentValueOption,
    flatOptions,
  }
}
