import { Frame } from "@seldon/components/frames/Frame"
import { useMemo } from "react"

import { connectionChipStyle } from "./connection-style"

import type { ConnectionChipBox } from "@seldon/editor/lib/canvas/connections/connection-layout"

interface OmittedChipProps {
  chip: ConnectionChipBox
  count: number
}

/**
 * Reports the refs that did not fit the gutter.
 *
 * Drawn rather than dropped silently, so a selection with more refs than the column
 * holds says so instead of appearing to have fewer.
 */
export function OmittedChip({ chip, count }: OmittedChipProps) {
  const chipStyle = useMemo(() => connectionChipStyle(chip, true), [chip])
  const label = `+${count} more`

  return <Frame style={chipStyle}>{label}</Frame>
}
