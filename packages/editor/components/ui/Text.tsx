import { cnMerge } from "@lib/utils/cn"
import { HTMLAttributes } from "react"

type As =
  | "div"
  | "p"
  | "span"
  | "label"
  | "li"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
type Variant =
  | "label-small"
  | "callout"
  | "label"
  | "body-small"
  | "body"
  | "title"
  | "headline"
  | "display"

export type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: Variant
  as?: As
  htmlFor?: string
}

export function Text({
  variant = "regular" as Variant,
  children,
  className = "",
  as: Component = "p",
  ...rest
}: TextProps) {
  return (
    <Component
      className={cnMerge(
        variant === "label-small" && "text-[11px] font-semibold",
        variant === "callout" && "text-[12px] font-semibold",
        variant === "label" && "text-[13px] font-semibold",
        variant === "body-small" && "text-[13px] font-normal",
        variant === "body" && "text-[14px] font-normal",
        variant === "title" && "text-[16px] font-semibold",
        variant === "headline" && "text-[18px] font-bold",
        variant === "display" &&
          "text-[20px] font-extrabold leading-none tracking-tight",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}
