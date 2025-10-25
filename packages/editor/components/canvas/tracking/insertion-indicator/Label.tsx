import { COLORS } from "@lib/ui/colors"
import { CSSProperties } from "react"
import { IconCatalog } from "@components/icons/Catalog"
import { IconDraw } from "@components/icons/Draw"

type LabelProps = {
  variant: "sketch" | "component"
  label: string
  style: CSSProperties
}

export function Label({ label, variant, style }: LabelProps) {
  const buttonStyle: CSSProperties = {
    lineHeight: "28px",
    padding: "0 12px",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: "1.25rem",
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
    display: "flex",
    gap: 4,
    border: "1px solid",
    ...(variant === "component" && {
      color: COLORS.white,
      background: COLORS.magenta[500],
      borderColor: COLORS.magenta[600],
    }),
    ...(variant === "sketch" && {
      color: COLORS.charcoal,
      background: COLORS.yellow[500],
      borderColor: COLORS.yellow[600],
    }),
  }

  return (
    <div style={Object.assign({}, buttonStyle, style)}>
      {variant === "component" ? <IconCatalog /> : <IconDraw />}
      {label}
    </div>
  )
}
