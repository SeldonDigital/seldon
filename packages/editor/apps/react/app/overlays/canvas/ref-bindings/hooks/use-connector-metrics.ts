"use client"

import { CONNECTOR_TOKENS } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { useLayoutEffect, useRef, useState } from "react"

import type { RefObject } from "react"

/** The pixels the column is laid out from, none of them stated here. */
export interface ConnectorMetrics {
  /** The width the widest chip needs, which every chip then takes. */
  chipWidth: number
  chipHeight: number
  /** The chip's own gap, which spaces the column and holds it off the canvas edge. */
  chipGap: number
  /** The gap the column keeps from whichever canvas edge it hangs off. */
  gutter: number
  anchorRadius: number
}

interface ConnectorMetricsState {
  metrics: ConnectorMetrics | null
  measureRef: RefObject<HTMLElement | null>
}

/**
 * The pixels the overlay draws with, taken from the chips and the theme rather than
 * stated as numbers.
 *
 * The chip schema decides how tall a chip is, how much space it keeps, and how wide its
 * label makes it, and the theme decides what the column keeps clear. Restating any of
 * that here would leave the overlay drawing to values those two had moved on from. Chips
 * are placed absolutely and cannot size to each other, so a hidden copy of the set is
 * what reports the widest, and it doubles as the themed scope the variables are read in.
 *
 * Read when the labels change, which is when a column is drawn afresh, and before paint,
 * so a column never draws at one size and then jumps. `null` until the first read lands,
 * which is when the overlay has nothing to place chips by.
 */
export function useConnectorMetrics(labels: string[]): ConnectorMetricsState {
  const measureRef = useRef<HTMLElement>(null)
  const [metrics, setMetrics] = useState<ConnectorMetrics | null>(null)
  const signature = labels.join("\n")

  useLayoutEffect(() => {
    const scope = measureRef.current
    const chips = scope?.querySelectorAll<HTMLElement>('[data-seldon-ref="refChip"]')

    if (!scope || !chips || chips.length === 0) return

    let chipWidth = 0

    chips.forEach((chip) => {
      chipWidth = Math.max(chipWidth, chip.offsetWidth)
    })

    const first = chips[0]
    const chipGap = Number.parseFloat(window.getComputedStyle(first).rowGap)
    const { gutter, anchorRadius } = getTokenPixels(CONNECTOR_TOKENS, scope)

    setMetrics({
      chipWidth,
      chipHeight: first.offsetHeight,
      chipGap: Number.isNaN(chipGap) ? 0 : chipGap,
      gutter,
      anchorRadius,
    })
  }, [signature])

  return { metrics, measureRef }
}
