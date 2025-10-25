"use client"

import { cn } from "@lib/utils/cn"
import * as SelectPrimitive from "@radix-ui/react-select"
import { IconChevronDown } from "../icons/ChevronDown"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value
const SelectPortal = SelectPrimitive.Portal

const SelectTrigger = ({
  className,
  children,
  ...props
}: SelectPrimitive.SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    className={cn(
      "ring-1 ring-inset ring-gray",
      "group relative rounded",
      "hover:ring-white",
      "focus-visible:outline-none focus-visible:ring-sky-600",
      "text-left text-sm font-medium text-neutral-100",
      "flex h-7 w-full items-center justify-between gap-1 whitespace-nowrap bg-transparent px-1.5",
      "data-[state=open]:ring-1 data-[state=open]:!ring-sky-600",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "truncate [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon
      asChild
      className="absolute right-1 text-base text-neutral-100 opacity-0 group-hover:opacity-100 group-data-[state=open]:rotate-180"
    >
      <IconChevronDown />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)

const SelectContent = ({
  className,
  children,
  position = "popper",
  ...props
}: SelectPrimitive.SelectContentProps) => (
  <SelectPrimitive.Content
    className={cn(
      "border-px relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border-thin border-black/10 bg-gray text-neutral-100 shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className,
    )}
    position={position}
    {...props}
  >
    <SelectPrimitive.Viewport
      className={cn(
        position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
      )}
    >
      {children}
    </SelectPrimitive.Viewport>
  </SelectPrimitive.Content>
)

const SelectItem = ({
  className,
  children,
  ...props
}: SelectPrimitive.SelectItemProps) => (
  <SelectPrimitive.Item
    className={cn(
      "text-sm font-medium text-neutral-100",
      "relative flex h-8 w-full cursor-default select-none items-center px-1.5 outline-none",
      "data-[highlighted]:bg-white/10",
      " data-[state=checked]:text-blue",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-neutral-600",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)

const SelectSeparator = ({
  className,
  ...props
}: SelectPrimitive.SelectSeparatorProps) => (
  <SelectPrimitive.Separator
    className={cn("-mx-1 h-px bg-neutral-500", className)}
    {...props}
  />
)

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
