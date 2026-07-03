/**
 * VMCombobox: the editable combobox VM. It owns the input behavior (focus,
 * commit, keyboard nav, blur) over the custom `InputEditor` primitive. In
 * `combobox` mode it anchors the floating `VMComboboxListbox`; in `standalone`
 * mode it is a plain commit-on-blur input used for inline rename and dialog
 * fields. Option-list rendering lives in `VMComboboxListbox`; the selection and
 * filter engine lives in `useComboboxState`.
 */
import { CSSProperties, RefObject, useEffect, useRef } from "react"
import { Box } from "@seldon/components/custom-components"
import { InputEditor } from "@seldon/components/custom-components"
import { Frame } from "@seldon/components/frames/Frame"

// Functional resets so the custom `InputEditor` primitive blends into a property
// row. Appearance theming still comes from authored CSS; these only strip the
// native input chrome the primitive would otherwise render. The type metrics
// pin the input to the row's generated tokens until a generated View owns the
// combobox input styling.
const comboboxInputStyle: CSSProperties = {
  flex: 1,
  padding: 0,
  border: "none",
  borderRadius: 0,
  outline: "none",
  backgroundColor: "transparent",
  lineHeight: "var(--sdn-line-height-solid)",
  fontSize: "var(--sdn-font-size-xsmall)",
}

const comboboxFrameStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
}

const comboboxWrapperStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  cursor: "pointer",
}

interface InputProps {
  mode?: "combobox" | "standalone"
  value: string
  onValueChange: (value: string) => void
  onSubmit?: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
  open?: boolean
  setOpen?: (open: boolean) => void
  handleSubmit?: (options?: { keepFocus?: boolean }) => void
  onCancel?: () => void
  onTabNext?: () => boolean
  onTabPrev?: () => boolean
  onHighlightNext?: () => void
  onHighlightPrev?: () => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  validate?: (value: string) => boolean
  className?: string
  style?: React.CSSProperties
  [key: string]: unknown
}

function notifyCommit(
  value: string,
  onValueChange?: (value: string) => void,
  onSubmit?: (value: string) => void,
) {
  onSubmit?.(value)
  onValueChange?.(value)
}

export function VMCombobox({
  mode = "standalone",
  value,
  onValueChange,
  onSubmit,
  inputRef: externalInputRef,
  open,
  setOpen,
  handleSubmit,
  onCancel,
  onTabNext,
  onTabPrev,
  onHighlightNext,
  onHighlightPrev,
  placeholder,
  disabled = false,
  autoFocus = true,
  validate,
  className,
  style,
  ...inputProps
}: InputProps) {
  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef || internalInputRef
  const wrapperRef = useRef<HTMLDivElement>(null)
  const commitValueRef = useRef(value)
  const isProgrammaticFocusRef = useRef(false)
  const handledEnterRef = useRef(false)

  commitValueRef.current = value

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

  const inputPropsStyle = inputProps?.style as React.CSSProperties | undefined
  const restInputProps = { ...inputProps }
  if (restInputProps.style) {
    delete restInputProps.style
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget
    if (mode === "combobox") {
      setOpen?.(true)
    }

    if (isProgrammaticFocusRef.current) {
      isProgrammaticFocusRef.current = false
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          input.select()
        })
      })
    } else {
      input.select()
    }
  }

  function handleEscape(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault()
    onCancel?.()
    event.currentTarget.blur()
    setOpen?.(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (mode === "combobox") {
      // Arrow keys move the active option (with focus staying in the input) so
      // the menu is keyboard navigable; preventDefault stops caret movement.
      if (event.key === "ArrowDown") {
        event.preventDefault()
        onHighlightNext?.()
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        onHighlightPrev?.()
        return
      }

      // Tab commits the highlighted/typed value and then moves edit focus to the
      // adjacent property row. Only suppress the native focus move when a row was
      // actually activated, so Tab can still leave the list at either end.
      if (event.key === "Tab") {
        handleSubmit?.({ keepFocus: true })
        const moved = event.shiftKey ? onTabPrev?.() : onTabNext?.()
        if (moved) event.preventDefault()
        return
      }
    }

    if (event.key === "Enter") {
      if (mode === "combobox" && handleSubmit) {
        event.preventDefault()
        handleSubmit()
        return
      }

      if (mode === "standalone") {
        event.preventDefault()
        const trimmedValue = event.currentTarget.value.trim()
        handledEnterRef.current = true

        if (validate && !validate(trimmedValue)) {
          onCancel?.()
          setTimeout(() => {
            handledEnterRef.current = false
          }, 0)
          event.currentTarget.blur()
          return
        }

        // Validation above already rejected invalid input, so commit the value.
        // The draft is fed back as `value`, so comparing against it would always
        // skip the commit and Enter would never apply the change.
        notifyCommit(trimmedValue, onValueChange, onSubmit)
        setTimeout(() => {
          handledEnterRef.current = false
        }, 0)
        event.currentTarget.blur()
        return
      }

      event.currentTarget.blur()
      return
    }

    // Standalone fields commit the typed value on Tab, then hand off edit focus
    // to the adjacent property row. When no row was activated (start or end of
    // the list) the input blurs so the browser can move focus out of the list.
    if (
      event.key === "Tab" &&
      mode === "standalone" &&
      (onTabNext || onTabPrev)
    ) {
      event.preventDefault()
      const trimmedValue = event.currentTarget.value.trim()
      handledEnterRef.current = true

      if (validate && !validate(trimmedValue)) {
        onCancel?.()
      } else {
        notifyCommit(trimmedValue, onValueChange, onSubmit)
      }

      const moved = event.shiftKey ? onTabPrev?.() : onTabNext?.()
      if (!moved) event.currentTarget.blur()

      setTimeout(() => {
        handledEnterRef.current = false
      }, 0)
      return
    }

    if (event.key === "Escape") {
      handleEscape(event)
    }
  }

  function handleBlur() {
    if (mode === "combobox") {
      return
    }

    if (handledEnterRef.current) {
      handledEnterRef.current = false
      return
    }

    const trimmedValue = value.trim()

    if (trimmedValue === commitValueRef.current) {
      notifyCommit(trimmedValue, onValueChange, onSubmit)
      return
    }

    if (validate && !validate(trimmedValue)) {
      onCancel?.()
      return
    }

    notifyCommit(trimmedValue, onValueChange, onSubmit)
  }

  const baseInputStyle: React.CSSProperties = {
    ...comboboxInputStyle,
    ...style,
  }

  const inputPropsCommon = {
    autoComplete: "off" as const,
    autoCorrect: "off" as const,
    autoCapitalize: "off" as const,
    spellCheck: "false" as const,
  }

  function focusInputProgrammatically() {
    isProgrammaticFocusRef.current = true
    inputRef.current?.focus()
  }

  function handleFrameClick(event: React.MouseEvent) {
    if (setOpen && !open && !disabled) {
      event.stopPropagation()
      setOpen(true)
      focusInputProgrammatically()
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    onValueChange(event.target.value)
  }

  function handleInputClick(event: React.MouseEvent) {
    event.stopPropagation()
    if (setOpen && !open) {
      setOpen(true)
    }
  }

  const comboboxFrameMergedStyle: React.CSSProperties = {
    ...comboboxFrameStyle,
    ...style,
  }

  const comboboxInputMergedStyle: React.CSSProperties = {
    ...baseInputStyle,
    ...(inputPropsStyle as React.CSSProperties | undefined),
  }

  if (mode === "combobox") {
    return (
      <Frame
        className="sdn-frame"
        style={comboboxFrameMergedStyle}
        onClick={handleFrameClick}
      >
        <Box ref={wrapperRef} style={comboboxWrapperStyle}>
          <InputEditor
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            className={className}
            style={comboboxInputMergedStyle}
            placeholder={placeholder}
            disabled={disabled}
            {...inputPropsCommon}
            {...restInputProps}
          />
        </Box>
      </Frame>
    )
  }

  return (
    <InputEditor
      autoFocus={autoFocus}
      value={value}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      style={baseInputStyle}
      {...inputPropsCommon}
      {...inputProps}
    />
  )
}
