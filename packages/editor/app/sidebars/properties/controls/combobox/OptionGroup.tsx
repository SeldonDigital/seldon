import React from "react"
import { Box } from "@seldon/components/custom-components"
import { getOptionGroupStyle } from "./combobox-styles"

type ComboboxOptionGroupProps = {
  isLast: boolean
  children: React.ReactNode
}

export function ComboboxOptionGroup({
  isLast,
  children,
}: ComboboxOptionGroupProps) {
  return <Box style={getOptionGroupStyle(isLast)}>{children}</Box>
}
