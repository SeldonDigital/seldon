import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FlatProperty } from "../helpers/properties-data"
import type { PropertyPickerResult } from "../helpers/options-utils"
import { useComboboxState } from "../controls/combobox/hooks/use-combobox-state"
import type {
  ComboboxOptionItem,
  ComboboxOptionItems,
} from "../controls/combobox/types"
import { useComboboxPosition } from "./use-combobox-position"

type ControlType = FlatProperty["controlType"]

interface Position {
  x: number
  y: number
  w: number
  positionAbove?: boolean
}

interface UsePropertyComboboxInput {
  property: FlatProperty
  effectiveControlType: ControlType
  options: PropertyPickerResult["options"] | undefined
  comboboxControlValue: string
  comboboxStoredValue: string
  displayValue: string
  validationFunction: ((value: string) => boolean) | undefined
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onEditChange?: (editing: boolean) => void
  onBlur?: () => void
  frameRef?: RefObject<HTMLDivElement | null>
  commit: (newValue: string) => void
}

interface UsePropertyComboboxResult {
  inputRef: RefObject<HTMLInputElement | null>
  comboboxRef: RefObject<HTMLDivElement | null>
  open: boolean
  setOpen: (open: boolean) => void
  inputValue: string
  isValid: boolean
  filteredOptions: ComboboxOptionItems
  handleSelect: (value: string) => void
  handleInputChange: (value: string) => void
  handleSubmitInput: () => void
  highlightedValue: string | undefined
  setHighlightedValue: (value: string | undefined) => void
  hasSections: boolean
  hasFilteredOptions: boolean
  position: Position
  handleControlClick: (event: React.MouseEvent) => void
  handleComboboxClose: () => void
  openComboboxWithFocus: () => void
}

/**
 * Controller for a property combobox. Owns the open/input/highlight state, the
 * focus-and-open choreography, and the original-value cancel tracking, so the
 * control component stays a binding shell. Returns typed options so call sites
 * need no casts.
 */
export function usePropertyCombobox({
  property,
  effectiveControlType,
  options,
  comboboxControlValue,
  comboboxStoredValue,
  displayValue,
  validationFunction,
  isEditing,
  setIsEditing,
  onEditChange,
  onBlur,
  frameRef,
  commit,
}: UsePropertyComboboxInput): UsePropertyComboboxResult {
  const inputRef = useRef<HTMLInputElement>(null)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(
    undefined,
  )
  const originalValueRef = useRef<string | undefined>(undefined)
  const hasSelectionRef = useRef(false)

  const isMenuOrComboType =
    effectiveControlType === "menu" || effectiveControlType === "combo"

  const comboOptions: ComboboxOptionItems = isMenuOrComboType
    ? ((options ?? []) as ComboboxOptionItem[][])
    : []

  const {
    open: comboboxOpen,
    setOpen: setComboboxOpen,
    inputValue,
    setInputValue,
    filteredOptions,
    handleSelect,
    handleInputChange,
    handleSubmitInput,
    flatOptions,
    isValid,
  } = useComboboxState<ComboboxOptionItem>({
    value: comboboxControlValue,
    options: comboOptions,
    onValueChange: (value) => {
      hasSelectionRef.current = true
      commit(value)
      if (effectiveControlType === "menu") {
        onBlur?.()
      }
    },
    inputRef,
    validateCustomValue:
      effectiveControlType === "combo" ? validationFunction : undefined,
  })

  // Track original value when combobox opens
  useEffect(() => {
    if (comboboxOpen && originalValueRef.current === undefined) {
      originalValueRef.current = comboboxStoredValue
      hasSelectionRef.current = false
    } else if (!comboboxOpen) {
      originalValueRef.current = undefined
      hasSelectionRef.current = false
    }
  }, [comboboxOpen, comboboxStoredValue])

  const hasSections =
    filteredOptions.length > 0 && Array.isArray(filteredOptions[0])

  const hasFilteredOptions = useMemo(() => {
    if (!filteredOptions || filteredOptions.length === 0) return false
    if (hasSections) {
      return (filteredOptions as ComboboxOptionItem[][]).some(
        (group) => group.length > 0,
      )
    }
    return (filteredOptions as ComboboxOptionItem[]).length > 0
  }, [filteredOptions, hasSections])

  // Sync input value with display value. Don't sync while the menu is open:
  // the user is typing and we don't want to overwrite their input.
  useEffect(() => {
    if (!comboboxOpen) {
      const option = flatOptions.find((o) => o.value === comboboxControlValue)
      setInputValue(option ? option.name : displayValue || "")
    }
  }, [
    comboboxControlValue,
    displayValue,
    flatOptions,
    setInputValue,
    comboboxOpen,
  ])

  // Sync editing state with combobox open state
  useEffect(() => {
    if (onEditChange) return

    setIsEditing(comboboxOpen)
  }, [comboboxOpen, setIsEditing, onEditChange])

  // Focus and select the input, then open the menu. Double requestAnimationFrame
  // ensures selection happens after all rendering, matching Combobox.handleFocus.
  const openComboboxWithFocus = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
        setComboboxOpen(true)
      })
    })
  }, [setComboboxOpen])

  useEffect(() => {
    if (isEditing && isMenuOrComboType) {
      openComboboxWithFocus()
    }
  }, [isEditing, isMenuOrComboType, property.key, openComboboxWithFocus])

  const position = useComboboxPosition({
    open: comboboxOpen,
    frameRef,
    comboboxRef,
  })

  const handleControlClick = (event: React.MouseEvent) => {
    if (isMenuOrComboType && !comboboxOpen && !property.isDimmed) {
      event.stopPropagation()
      openComboboxWithFocus()
    }
  }

  const handleComboboxClose = () => {
    // If no selection was made, restore the original value (cancel).
    if (!hasSelectionRef.current && originalValueRef.current !== undefined) {
      const option = flatOptions.find(
        (o) => o.value === originalValueRef.current,
      )
      setInputValue(option ? option.name : originalValueRef.current || "")
    }
    setComboboxOpen(false)
    if (effectiveControlType === "menu") {
      onBlur?.()
    }
  }

  return {
    inputRef,
    comboboxRef,
    open: comboboxOpen,
    setOpen: setComboboxOpen,
    inputValue,
    isValid,
    filteredOptions,
    handleSelect,
    handleInputChange,
    handleSubmitInput,
    highlightedValue,
    setHighlightedValue,
    hasSections,
    hasFilteredOptions,
    position,
    handleControlClick,
    handleComboboxClose,
    openComboboxWithFocus,
  }
}
