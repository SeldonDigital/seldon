import { cn } from "@lib/utils/cn"
import React from "react"
import { HSL } from "@seldon/core"
import { Frame } from "../../../../../seldon/frames/Frame"

interface ComboboxOptionProps<ItemT> {
  handleSelect: (value: string) => void
  option: ItemT
  value?: string
  renderIcon?: ((option: ItemT) => React.ReactNode) | React.ReactNode
  hidden?: boolean
  disabled?: boolean
  highlighted?: boolean
  onHighlight?: (value: string) => void
}

export function ComboboxOption<
  ItemT extends { name: string; value: string; color?: HSL; hidden?: boolean },
>({
  handleSelect,
  option,
  value,
  renderIcon,
  hidden,
  disabled,
  highlighted = false,
  onHighlight,
}: ComboboxOptionProps<ItemT>) {
  const fontProps: React.CSSProperties = {
    fontFamily: `var(--sdn-seldon-font-family-primary)`,
    fontSize: `var(--sdn-font-size-xsmall)`,
    fontWeight: `var(--sdn-font-weight-medium)`,
    lineHeight: `var(--sdn-line-height-solid)`,
    letterSpacing: "0.1px",
  }

  const isSelected = option.value.toLowerCase() === value?.toLowerCase()

  return (
    <Frame
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onMouseDown={(event) => {
        if (disabled) return
        event.preventDefault()
        handleSelect(option.value)
      }}
      onMouseEnter={() => !disabled && !hidden && onHighlight?.(option.value)}
      data-active={isSelected}
      data-disabled={disabled}
      className={cn(
        "text-neutral-100",
        "relative flex h-8 w-full items-center gap-[6px] px-1.5 outline-none",
        "data-[active=false]:not([data-disabled=true]):hover:bg-white/10",
        "data-[selected=true]:bg-white/10",
        "data-[active=true]:text-blue focus:data-[active=true]:text-blue",
        highlighted && "bg-white/10",
        "data-[disabled=true]:opacity-50 focus:bg-neutral-600",
        "cursor-pointer",
        hidden && "hidden",
        disabled && "cursor-not-allowed",
      )}
      style={fontProps}
    >
      <span className="shrink-0" style={fontProps}>
        {renderIcon &&
          (typeof renderIcon === "function" ? renderIcon(option) : renderIcon)}
      </span>
      <span className="truncate overflow-ellipsis" style={fontProps}>
        {option.name}
      </span>
    </Frame>
  )
}
