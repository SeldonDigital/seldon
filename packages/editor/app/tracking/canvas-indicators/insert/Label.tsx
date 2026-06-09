import { COLORS } from "@lib/helpers/colors"
import { CSSProperties } from "react"
import { PillLabel } from "@seldon/components/custom-components"

type LabelProps = {
  label: string
  style: CSSProperties
}

export function Label({ label, style }: LabelProps) {
  return (
    <PillLabel
      label={label}
      style={style}
      textColor={COLORS.white}
      background={COLORS.accent[500]}
      borderColor={COLORS.accent[600]}
    />
  )
}
