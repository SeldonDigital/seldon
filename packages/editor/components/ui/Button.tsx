import { IconChevronLeft } from "@components/icons/ChevronLeft"
import { IconChevronRight } from "@components/icons/ChevronRight"
import { IconPlus } from "@components/icons/Plus"
import { IconRefresh } from "@components/icons/Retry"
import { cn, cnMerge } from "@lib/utils/cn"
import { ButtonHTMLAttributes } from "react"
import { Link, type LinkProps } from "wouter"

type BaseButtonProps = {
  variant?: "primary" | "secondary" | "critical"
  icon?: "back" | "refresh" | "next" | "plus"
  children: string
  testId?: string
  className?: string
}

export type ButtonAsButtonProps = BaseButtonProps & {
  as?: "button"
} & ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonAsLinkProps = BaseButtonProps & {
  as: "link"
  href: string
} & LinkProps

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

export function Button({
  variant = "primary",
  className,
  children,
  icon,
  testId,
  as = "button",
  ...props
}: ButtonProps) {
  const buttonClassName = cnMerge(
    "inline-flex h-6 items-center justify-center gap-2 rounded-[20px] truncate",
    icon ? "px-2" : "px-3",
    "text-sm font-semibold",
    "select-none",
    getVariantClassName(),
    className,
  )

  const baseProps = {
    className: buttonClassName,
    "data-testid": testId,
  }

  if (as === "link") {
    return (
      <Link {...baseProps} {...(props as ButtonAsLinkProps)}>
        <Contents>{children}</Contents>
      </Link>
    )
  }

  const buttonProps = props as ButtonAsButtonProps

  return (
    <button {...baseProps} {...buttonProps} type={buttonProps.type ?? "button"}>
      <Contents>{children}</Contents>
    </button>
  )

  function Contents({ children }: { children: string }) {
    return (
      <>
        {icon === "back" && <IconChevronLeft />}
        {icon === "refresh" && <IconRefresh />}
        {icon === "plus" && <IconPlus />}
        <span className="leading-none">{children}</span>
        {icon === "next" && <IconChevronRight />}
      </>
    )
  }

  function getVariantClassName() {
    if (variant === "secondary") {
      return cn(
        "text-pearl",
        "border border-white/10",
        "hover:enabled:border-white/20",
        "disabled:opacity-70",
      )
    }

    if (variant === "primary") {
      return cn(
        "text-pearl",
        "bg-blue bg-gradient-to-b from-black/0 to-black/20 shadow-dieter-rams-button",
        "hover:enabled:to-black/0",
        "disabled:opacity-70",
      )
    }

    if (variant === "critical") {
      return cn(
        "text-red",
        "border border-red",
        "hover:enabled:bg-red-700",
        "disabled:opacity-70",
      )
    }

    throw new Error(`Unknown variant: ${variant}`)
  }
}
