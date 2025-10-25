import { cn, cnMerge } from "@lib/utils/cn"
import { useEffect, useRef, useState } from "react"

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onValueChange" | "onClick"
  > {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  value?: string
  validate?: (value: string) => boolean
  onValueChange?: (value: string) => void
  iconLeft?: React.ReactNode
  handleClickIconLeft?: () => void
  iconRight?: React.ReactNode
  handleClickIconRight?: () => void
  isRequired?: boolean
  showBorder?: boolean
  adornment?: string
  ref?: React.RefObject<HTMLInputElement>
}

export function Input({
  className,
  value,
  validate,
  onValueChange,
  placeholder = "None",
  onClick,
  iconLeft,
  handleClickIconLeft,
  iconRight,
  handleClickIconRight,
  isRequired = false,
  disabled = false,
  showBorder = false,
  adornment,
  ref,
  ...inputProps
}: InputProps) {
  const [currentValue, setCurrentValue] = useState(value ?? "")
  const [adornmentWidth, setAdornmentWidth] = useState(0)
  const adornmentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentValue(value ?? "")
  }, [value])

  useEffect(() => {
    if (adornmentRef.current) {
      const width = adornmentRef.current.getBoundingClientRect().width
      setAdornmentWidth(width)
    }
  }, [adornment])

  return (
    <div
      className={cn(
        "group relative rounded text-inherit",
        onClick && "cursor-pointer",
        showBorder ? "ring-1 ring-gray" : "hover:ring-1 hover:ring-gray",
      )}
      onClick={onClick}
    >
      {iconLeft ? (
        <div
          className={cn(
            "absolute left-[5px] top-[6px] flex h-4 w-4 items-center justify-center",
            disabled && "opacity-50",
            handleClickIconLeft
              ? "hover:text-pearl cursor-pointer"
              : "pointer-events-none",
          )}
          onClick={handleClickIconLeft}
        >
          {iconLeft}
        </div>
      ) : null}
      <input
        className={cnMerge(
          "no-spinner flex h-7 w-full cursor-pointer truncate rounded-md bg-transparent py-1.5 pr-1.5 text-sm ring-inset transition-colors placeholder:text-inherit",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-600 focus:cursor-text",
          iconLeft ? "pl-[26px]" : "pl-1.5",
          disabled && "cursor-auto opacity-50",
          className,
        )}
        value={currentValue}
        onKeyDown={handleKeyDown}
        onBlur={submit}
        onChange={(e) => setCurrentValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          paddingRight: `${adornmentWidth + 10}px`,
        }}
        ref={ref}
        {...inputProps}
      />
      <div
        ref={adornmentRef}
        className="pointer-events-none absolute right-2 top-1/2 max-w-[50px] -translate-y-1/2 truncate text-[9px] text-neutral-100/60"
      >
        {adornment}
      </div>
      {iconRight ? (
        <div
          className={cn(
            "absolute right-[5px] top-[6px] flex h-4 w-4 items-center justify-center",
            handleClickIconRight
              ? "hover:text-pearl cursor-pointer"
              : "pointer-events-none",
          )}
          onClick={handleClickIconRight}
        >
          {iconRight}
        </div>
      ) : null}
    </div>
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
      setCurrentValue(value ?? "")
      e.currentTarget.blur()
    }
  }

  function submit() {
    // currentValue might be an empty string (""),
    // we should only call onValueChange with this if a value is not required for this field (if the field can be null as well)
    // -- otherwise, we should resort to the previous value (like in Size, that accepts custom values, but not null)
    const isNotRequiredAndEmpty = !isRequired && !currentValue
    if (isNotRequiredAndEmpty || !validate || validate(currentValue.trim())) {
      onValueChange?.(currentValue.trim())
    } else {
      setCurrentValue(value ?? "")
    }
  }
}
