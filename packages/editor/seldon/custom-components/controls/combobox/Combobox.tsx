import { RefObject, useEffect, useRef } from "react"
import { Box } from "@seldon/components/custom-components"
import { Frame } from "@seldon/components/frames/Frame"
import { InputEditor } from "@seldon/components/custom-components"
import {
  comboboxFrameStyle,
  comboboxInputStyle,
  comboboxWrapperStyle,
} from "./combobox-styles"

export interface InputProps {
  mode?: "combobox" | "standalone"
  value: string
  onValueChange: (value: string) => void
  onSubmit?: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
  open?: boolean
  setOpen?: (open: boolean) => void
  handleSubmit?: () => void
  onCancel?: () => void
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

export function Combobox({
  mode = "standalone",
  value,
  onValueChange,
  onSubmit,
  inputRef: externalInputRef,
  open,
  setOpen,
  handleSubmit,
  onCancel,
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

        if (trimmedValue !== commitValueRef.current || !trimmedValue) {
          notifyCommit(trimmedValue, onValueChange, onSubmit)
        }
        setTimeout(() => {
          handledEnterRef.current = false
        }, 0)
        event.currentTarget.blur()
        return
      }

      event.currentTarget.blur()
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
