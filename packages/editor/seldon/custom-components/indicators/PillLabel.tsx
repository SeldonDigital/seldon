import { CSSProperties } from "react"
import { IconSeldonCatalog } from "@seldon/components/icons"

interface PillLabelProps {
  label: string
  style?: CSSProperties
  textColor: string
  background: string
  borderColor: string
}

/** Rounded pill carrying a catalog icon and a label. Colors arrive via props. */
export function PillLabel({
  label,
  style,
  textColor,
  background,
  borderColor,
}: PillLabelProps) {
  const pillStyle: CSSProperties = {
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
    color: textColor,
    background,
    borderColor,
  }

  return (
    <div style={Object.assign({}, pillStyle, style)}>
      <IconSeldonCatalog />
      {label}
    </div>
  )
}
