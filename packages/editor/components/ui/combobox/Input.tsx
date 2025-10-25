import { cn, cnMerge } from "@lib/utils/cn"
import { Command } from "cmdk"
import { RefObject, useEffect, useRef, useState } from "react"
import { isHex, isPx, isRem } from "@seldon/core/helpers/validation"
import { IconChevronDown } from "@components/icons/ChevronDown"
import { InputProps } from "../Input"

interface ComboboxInputProps
  extends Omit<InputProps, "onChange" | "validate" | "onValueChange"> {
  inputRef: RefObject<HTMLInputElement | null>
  inputValue: string
  handleInputChange: (value: string) => void
  setOpen: (open: boolean) => void
  open: boolean
  handleSubmit: () => void
  placeholder?: string
  adornment?: string
  isValid?: boolean
}

export function ComboboxInput({
  inputRef,
  inputValue,
  handleInputChange,
  open,
  setOpen,
  handleSubmit,
  placeholder,
  iconLeft,
  adornment,
  isValid,
  disabled,
  ...inputProps
}: ComboboxInputProps) {
  const [adornmentWidth, setSuffixWidth] = useState(0)
  const adornmentRef = useRef<HTMLDivElement>(null)
  const isPxValue = isPx(inputValue)
  const isHexValue = isHex(inputValue)
  const isRemValue = isRem(inputValue)

  useEffect(() => {
    if (adornmentRef.current) {
      const width = adornmentRef.current.getBoundingClientRect().width
      setSuffixWidth(width)
    }
  }, [adornment, isValid])

  return (
    <div className="relative">
      <Command.Input
        ref={inputRef}
        value={inputValue}
        onFocus={(e) => {
          setOpen(true)
          e.currentTarget?.select()
        }}
        // Prevent event from bubbling up,
        // helpful when using this component in the trigger for a collapsible for example
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit()
          }
          if (e.key === "Escape") {
            e.currentTarget?.blur()
          }
        }}
        className={cnMerge(
          "no-spinner flex h-7 w-full cursor-pointer truncate rounded bg-transparent py-1.5 text-sm text-inherit ring-inset",
          "group-hover:ring-1 group-hover:ring-gray",
          "placeholder:text-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:!ring-sky-600 focus:cursor-text",
          disabled && "cursor-auto opacity-50",
          iconLeft ? "pl-[26px]" : "pl-1.5",
        )}
        style={{
          paddingRight: `${adornmentWidth + 32}px`,
        }}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
        onValueChange={handleInputChange}
      />

      {!disabled && (
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            if (!open) {
              inputRef.current?.focus()
            }
            setOpen(!open)
          }}
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 text-base text-neutral-100 opacity-0 outline-none group-hover:opacity-100",
            open && "rotate-180 opacity-100",
          )}
        >
          <IconChevronDown />
        </button>
      )}
      {iconLeft && (
        <div
          className={cn(
            "pointer-events-none absolute left-1.5 top-[7px] flex h-[14px] w-[14px] items-center justify-center",
            disabled && "opacity-50",
          )}
        >
          {iconLeft}
        </div>
      )}
      {adornment ? (
        <div
          ref={adornmentRef}
          className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[9px] text-neutral-100/60"
        >
          {adornment}
        </div>
      ) : (
        isValid && (
          <div
            ref={adornmentRef}
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[9px]"
          >
            {isPxValue && "PX"}
            {isRemValue && "REM"}
            {isHexValue && "HEX"}
          </div>
        )
      )}
    </div>
  )
}
