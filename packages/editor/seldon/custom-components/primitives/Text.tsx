import { CSSProperties, HTMLAttributes } from "react"

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

type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: Variant
  as?: As
  htmlFor?: string
}

const variantStyles: Record<Variant, CSSProperties> = {
  "label-small": { fontSize: "11px", fontWeight: 600 },
  callout: { fontSize: "12px", fontWeight: 600 },
  label: { fontSize: "13px", fontWeight: 600 },
  "body-small": { fontSize: "13px", fontWeight: 400 },
  body: { fontSize: "14px", fontWeight: 400 },
  title: { fontSize: "16px", fontWeight: 600 },
  headline: { fontSize: "18px", fontWeight: 700 },
  display: {
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.025em",
  },
}

export function Text({
  variant = "regular" as Variant,
  children,
  className = "",
  as: Component = "p",
  style,
  ...rest
}: TextProps) {
  return (
    <Component
      className={className}
      style={{ ...variantStyles[variant], ...style }}
      {...rest}
    >
      {children}
    </Component>
  )
}
