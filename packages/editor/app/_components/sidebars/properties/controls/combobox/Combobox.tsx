import { cnMerge } from "@lib/utils/cn"
import { RefObject, useEffect, useRef, useState } from "react"
import { useKeyboardNavigation } from "./hooks/use-keyboard-navigation"
import { Frame } from "../../../../../seldon/frames/Frame"
import { InputEditor } from "../../../../../seldon/primitives/InputEditor"
import { IconChevronDown } from "@components/icons/ChevronDown"

export interface InputProps {
  mode?: "combobox" | "standalone"
  value?: string
  onValueChange?: (value: string) => void
  initialValue?: string
  onSubmit?: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
  open?: boolean
  setOpen?: (open: boolean) => void
  handleSubmit?: () => void
  isValid?: boolean
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  validate?: (value: string) => boolean
  isRequired?: boolean
  className?: string
  style?: React.CSSProperties
  hideChevron?: boolean
  options?:
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
  onOptionSelect?: (value: string) => void
  onHighlightedValueChange?: (value: string | undefined) => void
  [key: string]: unknown
}

function getOriginalValue(
  initialValue?: string,
  externalValue?: string,
): string {
  return initialValue ?? externalValue ?? ""
}

function notifyValueChange(
  value: string,
  onValueChange?: (value: string) => void,
  onSubmit?: (value: string) => void,
) {
  onSubmit?.(value)
  onValueChange?.(value)
}

export function Combobox({
  mode = "standalone",
  value: externalValue,
  onValueChange,
  initialValue,
  onSubmit,
  inputRef: externalInputRef,
  open,
  setOpen,
  handleSubmit,
  isValid,
  placeholder,
  disabled = false,
  autoFocus = true,
  validate,
  isRequired = false,
  className,
  style,
  hideChevron = false,
  options,
  onOptionSelect,
  onHighlightedValueChange,
  ...inputProps
}: InputProps) {
  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef || internalInputRef
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Sync external ref by finding the input element inside the wrapper
  useEffect(() => {
    if (wrapperRef.current) {
      const inputElement = wrapperRef.current.querySelector(
        "input",
      ) as HTMLInputElement | null
      if (inputElement) {
        internalInputRef.current = inputElement
        if (externalInputRef && "current" in externalInputRef) {
          ;(
            externalInputRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = inputElement
        }
      }
    }
  }, [externalInputRef])

  const originalValue = getOriginalValue(initialValue, externalValue)
  const [internalValue, setInternalValue] = useState(originalValue)
  const shouldCancelRef = useRef(false)
  const originalValueRef = useRef<string>(originalValue)
  const isProgrammaticFocusRef = useRef(false)
  const handledEnterRef = useRef(false)

  const inputPropsStyle = inputProps?.style as React.CSSProperties | undefined
  const restInputProps = { ...inputProps }
  if (restInputProps.style) {
    delete restInputProps.style
  }

  // In combobox mode, prioritize internalValue when user is typing (it differs from externalValue)
  // This ensures the input shows typed text immediately, even before externalValue updates
  const displayValue =
    mode === "combobox" && externalValue !== undefined
      ? internalValue !== externalValue
        ? internalValue
        : externalValue
      : internalValue

  // Track original value when menu opens in combobox mode
  useEffect(() => {
    if (
      mode === "combobox" &&
      open &&
      originalValueRef.current !== displayValue
    ) {
      originalValueRef.current = displayValue
    }
  }, [mode, open, displayValue])

  // Keyboard navigation for combobox mode
  const keyboardNavigation = useKeyboardNavigation({
    open: mode === "combobox" ? (open ?? false) : false,
    options: options ?? [],
    currentValue: displayValue,
    onSelect: (value) => {
      // onOptionSelect will handle the selection and close the menu
      onOptionSelect?.(value)
    },
    onClose: () => {
      setOpen?.(false)
    },
    inputRef,
  })

  // Notify parent of highlighted value changes
  useEffect(() => {
    onHighlightedValueChange?.(keyboardNavigation.highlightedValue)
  }, [keyboardNavigation.highlightedValue, onHighlightedValueChange])

  // Sync internalValue to externalValue
  useEffect(() => {
    if (mode === "standalone" && initialValue !== undefined) {
      setInternalValue(initialValue)
    } else if (mode === "combobox" && externalValue !== undefined) {
      // Sync when menu is closed (external value changed from outside)
      // Don't sync while menu is open and user is typing
      if (!open) {
        setInternalValue(externalValue)
      }
    }
  }, [mode, initialValue, externalValue, open])

  // Sync to externalValue when menu opens to show current value
  useEffect(() => {
    if (mode === "combobox" && open && externalValue !== undefined) {
      setInternalValue(externalValue)
    }
  }, [mode, open, externalValue])

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget
    if (mode === "combobox") {
      setOpen?.(true)
    }

    // If this is a programmatic focus, use requestAnimationFrame to ensure
    // selection happens after all effects and re-renders complete
    if (isProgrammaticFocusRef.current) {
      isProgrammaticFocusRef.current = false
      // Use double requestAnimationFrame to ensure it happens after all rendering
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          input.select()
        })
      })
    } else {
      // Normal focus - select immediately
      input.select()
    }
  }

  function handleEscape(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const resetValue = getOriginalValue(initialValue, externalValue)

    shouldCancelRef.current = true
    setInternalValue(resetValue)

    if (mode === "combobox") {
      onValueChange?.(resetValue)
    }

    event.currentTarget.blur()
    setOpen?.(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      if (mode === "combobox" && handleSubmit) {
        // In combobox mode, always call handleSubmit on Enter
        // This handles both keyboard navigation (when option is highlighted) and custom input
        event.preventDefault()
        handleSubmit()
        return
      } else if (mode === "standalone") {
        event.preventDefault()
        // In standalone mode, read value directly from input and submit immediately
        const inputValue = event.currentTarget.value.trim()
        const trimmedValue = inputValue

        // Update internal state to match input
        setInternalValue(trimmedValue)

        // Mark that we've handled Enter so blur doesn't process again
        // Keep this flag set - blur handler will reset it
        handledEnterRef.current = true

        // Validate if validation function exists
        if (validate) {
          const isEmptyAndNotRequired = !isRequired && !trimmedValue
          if (!isEmptyAndNotRequired && !validate(trimmedValue)) {
            // Validation failed - reset to original value
            setInternalValue(originalValue)
            notifyValueChange(originalValue, onValueChange, onSubmit)
            // Reset flag after a brief delay to allow blur to check it
            setTimeout(() => {
              handledEnterRef.current = false
            }, 0)
            event.currentTarget.blur()
            return
          }
        }

        // Validation passed or no validation - submit the value
        // Always submit if there's a value, even if no validation function
        if (trimmedValue !== originalValue || !trimmedValue) {
          notifyValueChange(trimmedValue, onValueChange, onSubmit)
        }
        // Reset flag after a brief delay to allow blur to check it
        setTimeout(() => {
          handledEnterRef.current = false
        }, 0)
        event.currentTarget.blur()
      } else {
        event.currentTarget.blur()
      }
      return
    }

    if (event.key === "Escape") {
      handleEscape(event)
    }
  }

  function handleCancel() {
    shouldCancelRef.current = false
    const resetValue = getOriginalValue(initialValue, externalValue)

    if (mode === "combobox") {
      onValueChange?.(resetValue)
    } else {
      onSubmit?.(resetValue)
    }
  }

  function handleBlur() {
    if (shouldCancelRef.current) {
      handleCancel()
      return
    }

    // In combobox mode, don't process blur - let handleClose handle cancel logic
    // This prevents blur from interfering with option selection
    if (mode === "combobox") {
      return
    }

    // If Enter was just pressed, we've already handled the submission
    // Don't process blur again to avoid double-processing
    if (handledEnterRef.current) {
      handledEnterRef.current = false
      return
    }

    const currentValue = mode === "standalone" ? internalValue : displayValue
    const trimmedValue = currentValue.trim()

    if (trimmedValue === originalValue) {
      notifyValueChange(trimmedValue, onValueChange, onSubmit)
      return
    }

    if (mode === "standalone" && validate) {
      const isEmptyAndNotRequired = !isRequired && !trimmedValue
      if (!isEmptyAndNotRequired && !validate(trimmedValue)) {
        setInternalValue(originalValue)
        notifyValueChange(originalValue, onValueChange, onSubmit)
        return
      }
    }

    notifyValueChange(trimmedValue, onValueChange, onSubmit)
  }

  const baseInputStyle: React.CSSProperties = {
    flex: 1,
    padding: 0,
    border: "none",
    borderRadius: 0,
    outline: "none",
    backgroundColor: "transparent",
    lineHeight: "var(--sdn-line-height-solid)",
    fontSize: "var(--sdn-font-size-xsmall)",
    ...style,
  }

  const inputPropsCommon = {
    autoComplete: "off" as const,
    autoCorrect: "off" as const,
    autoCapitalize: "off" as const,
    spellCheck: "false" as const,
  }

  if (mode === "combobox") {
    return (
      <Frame
        className="sdn-frame"
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          ...style,
        }}
        onClick={(e) => {
          if (setOpen && !open && !disabled) {
            e.stopPropagation()
            setOpen(true)
            // Mark as programmatic focus so handleFocus can handle selection properly
            isProgrammaticFocusRef.current = true
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }
        }}
      >
        <div
          ref={wrapperRef}
          style={{ flex: 1, display: "flex", cursor: "pointer" }}
        >
          <InputEditor
            value={internalValue}
            onChange={(event) => {
              const newValue = event.target.value
              setInternalValue(newValue)
              onValueChange?.(newValue)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={(e) => {
              e.stopPropagation()
              if (setOpen && !open) {
                setOpen(true)
              }
            }}
            onKeyDown={handleKeyDown}
            className={cnMerge(
              "bg-transparent border-none outline-none",
              className,
            )}
            style={{
              ...baseInputStyle,
              ...(inputPropsStyle as React.CSSProperties | undefined),
            }}
            placeholder={placeholder}
            disabled={disabled}
            {...inputPropsCommon}
            {...restInputProps}
          />
        </div>
        {!disabled && setOpen && !hideChevron && (
          <button
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              if (!open) {
                // Mark as programmatic focus so handleFocus can handle selection properly
                isProgrammaticFocusRef.current = true
                if (inputRef.current) {
                  inputRef.current.focus()
                }
              }
              setOpen(!open)
            }}
          >
            <IconChevronDown />
          </button>
        )}
      </Frame>
    )
  }

  return (
    <InputEditor
      autoFocus={autoFocus}
      value={internalValue}
      onChange={(event) => setInternalValue(event.target.value)}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      placeholder={placeholder}
      disabled={disabled}
      className={cnMerge(className)}
      style={baseInputStyle}
      {...inputPropsCommon}
      {...inputProps}
    />
  )
}
