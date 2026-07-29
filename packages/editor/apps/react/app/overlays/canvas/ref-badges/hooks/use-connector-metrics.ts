"use client"

import { CONNECTOR_TOKENS } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getTokenPixels } from "@seldon/editor/lib/themes/token-pixels"
import { useLayoutEffect, useRef, useState } from "react"

import type { RefObject } from "react"

/** The pixels the column is laid out from, none of them stated here. */
export interface ConnectorMetrics {
  /** The width the widest badge needs, which every badge then takes. */
  badgeWidth: number
  badgeHeight: number
  /** The badge's own gap, which spaces the column and holds it off the canvas edge. */
  badgeGap: number
  /** The gap the column keeps from whichever canvas edge it hangs off. */
  gutter: number
  anchorRadius: number
}

interface ConnectorMetricsState {
  metrics: ConnectorMetrics | null
  measureRef: RefObject<HTMLElement | null>
}

/**
 * The pixels the overlay draws with, taken from the badges and the theme rather than
 * stated as numbers.
 *
 * The badge schema decides how tall a badge is, how much space it keeps, and how wide its
 * label makes it, and the theme decides what the column keeps clear. Restating any of
 * that here would leave the overlay drawing to values those two had moved on from. Badges
 * are placed absolutely and cannot size to each other, so a hidden copy of the set is
 * what reports the widest, and it doubles as the themed scope the variables are read in.
 *
 * Read when the labels change, which is when a column is drawn afresh, and before paint,
 * so a column never draws at one size and then jumps. `null` until the first read lands,
 * which is when the overlay has nothing to place badges by.
 */
export function useConnectorMetrics(labels: string[]): ConnectorMetricsState {
  const measureRef = useRef<HTMLElement>(null)
  const [metrics, setMetrics] = useState<ConnectorMetrics | null>(null)
  const signature = labels.join("\n")

  useLayoutEffect(() => {
    const scope = measureRef.current
    // `refChip` is the schema's name for the badge, until the workspace renames it.
    const badges = scope?.querySelectorAll<HTMLElement>('[data-seldon-ref="refChip"]')

    if (!scope || !badges || badges.length === 0) return

    let badgeWidth = 0

    badges.forEach((badge) => {
      badgeWidth = Math.max(badgeWidth, badge.offsetWidth)
    })

    const first = badges[0]
    const badgeGap = Number.parseFloat(window.getComputedStyle(first).rowGap)
    const { gutter, anchorRadius } = getTokenPixels(CONNECTOR_TOKENS, scope)

    setMetrics({
      badgeWidth,
      badgeHeight: first.offsetHeight,
      badgeGap: Number.isNaN(badgeGap) ? 0 : badgeGap,
      gutter,
      anchorRadius,
    })
  }, [signature])

  return { metrics, measureRef }
}
