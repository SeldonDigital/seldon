import { COLORS } from "@lib/utils/colors"
import { CSSProperties } from "react"
import { IconCatalog } from "@components/icons/Catalog"

type LabelProps = {
  label: string
  style: CSSProperties
}

export function Label({ label, style }: LabelProps) {
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
    color: COLORS.white,
    background: COLORS.accent[500],
    borderColor: COLORS.accent[600],
  }

  return (
    <div style={Object.assign({}, buttonStyle, style)}>
      <IconCatalog />
      {label}
    </div>
  )
}
