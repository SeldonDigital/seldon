import { cn } from "@lib/utils/cn"
import { Command } from "cmdk"
import React from "react"
import { HSL } from "@seldon/core"

interface ComboboxOptionProps<ItemT> {
  handleSelect: (value: string) => void
  option: ItemT
  value?: string
  renderIcon?: ((option: ItemT) => React.ReactNode) | React.ReactNode
  hidden?: boolean
  disabled?: boolean
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
}: ComboboxOptionProps<ItemT>) {
  return (
    <Command.Item
      key={option.value}
      value={option.value}
      onSelect={handleSelect}
      data-active={option.value.toLowerCase() === value?.toLowerCase()}
      disabled={disabled}
      className={cn(
        "text-sm font-medium text-neutral-100",
        "relative flex h-8 w-full items-center gap-[6px] px-1.5 outline-none",
        "data-[active=false]:not([data-disabled=true]):hover:bg-white/10",
        "data-[selected=true]:bg-white/10",
        "data-[active=true]:text-blue focus:data-[active=true]:text-blue",
        "data-[disabled=true]:opacity-50 focus:bg-neutral-600",
        "cursor-pointer",
        hidden && "hidden",
      )}
    >
      <span className="shrink-0">
        {renderIcon &&
          (typeof renderIcon === "function" ? renderIcon(option) : renderIcon)}
      </span>
      <span className="truncate overflow-ellipsis">{option.name}</span>
    </Command.Item>
  )
}
