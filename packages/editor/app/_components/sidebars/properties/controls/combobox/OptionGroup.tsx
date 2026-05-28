import React from "react"
import { getOptionGroupStyle } from "./combobox-styles"

type ComboboxOptionGroupProps = {
  isLast: boolean
  children: React.ReactNode
}

export function ComboboxOptionGroup({
  isLast,
  children,
}: ComboboxOptionGroupProps) {
  return <div style={getOptionGroupStyle(isLast)}>{children}</div>
}
