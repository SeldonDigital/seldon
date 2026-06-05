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
  const [isValid, setIsValid] = useState(true)
  const [shouldFilter, setShouldFilter] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const hasSections = Array.isArray(options[0])
  const isManualSubmit = useRef(false)
  const flatOptions = useMemo(() => {
    return hasSections
      ? (options as Array<ItemT[]>).flat()
      : (options as ItemT[])
  }, [hasSections, options])

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

  function handleSelect(selectedValue: string) {
    // Due to the nature of the CMDK library, a ComboboxOption will emit a select event
    // even if we've manually submitted the input value, so we need to ignore the event if that's the case
    // to prevent double submission. Not ideal, but constraints of the CMDK library for now.
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
    // Only start filtering after user input
    setShouldFilter(true)
    const option = flatOptions.find((o) =>
      o.name.toLowerCase().includes(newValue.toLowerCase()),
    )
    // Input is valid if the input value is close to a standard option,
    // or if the input value is a valid value according to the validate function.
    setIsValid(
      option
        ? true
        : validateCustomValue
          ? validateCustomValue(newValue)
          : false,
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

    // 1. If the input value is a valid standard option, use it
    // 2. If the input value is valid according to the validate function, use it
    // 3. Else, the value is invalid, so set the input value to the original value
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

  function handleValueChange(value: string) {
    onValueChange(value)
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
    isValid,
    inputValue,
    setInputValue,
    filteredOptions,
    handleSelect,
    handleInputChange,
    handleSubmitInput,
    currentValueOption,
    flatOptions,
  }
}
