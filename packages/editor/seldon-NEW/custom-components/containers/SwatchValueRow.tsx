import { CSSProperties, ReactNode } from "react"

interface SwatchValueRowProps {
  swatch: ReactNode
  children: ReactNode
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  width: "100%",
  minWidth: 0,
}

const slotStyle: CSSProperties = { flexShrink: 0 }

const valueStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

/** A swatch cluster on the left and a truncating value to its right. */
export function SwatchValueRow({ swatch, children }: SwatchValueRowProps) {
  return (
    <div style={rowStyle}>
      <div style={slotStyle}>{swatch}</div>
      <div style={valueStyle}>{children}</div>
    </div>
  )
}
