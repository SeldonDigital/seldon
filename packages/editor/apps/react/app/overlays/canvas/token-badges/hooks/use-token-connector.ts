"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import { setTokenGutterSide } from "@seldon/editor/lib/canvas/connectors/badge-gutter-store"
import {
  getGutterSide,
  layoutConnectors,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { buildTokenSources } from "@seldon/editor/lib/canvas/connectors/token-sources"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { useEffect, useMemo, useRef } from "react"

import { useCanvasSize } from "../../../hooks/use-canvas-size"
import { useConnectorMetrics } from "../../ref-badges/hooks/use-connector-metrics"
import { useFollowCanvasTransform } from "../../ref-badges/hooks/use-follow-canvas-transform"
import { useTokenProperties } from "./use-token-property-row"

import type {
  ConnectorLayoutResult,
  ConnectorPlacement,
  GutterSide,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { TokenBadgeGroup } from "@seldon/editor/lib/canvas/connectors/token-groups"
import type { TokenSource } from "@seldon/editor/lib/canvas/connectors/token-sources"
import type { RefObject } from "react"

export interface PlacedToken {
  placement: ConnectorPlacement
  source: TokenSource
}

interface TokenConnectorState {
  entries: PlacedToken[]
  canvasSize: { width: number; height: number }
  /** The dot where a connector meets its node, `0` until the metrics are read. */
  anchorRadius: number
  /** Every badge's source, and the element the metrics are read from. */
  sources: TokenSource[]
  measureRef: RefObject<HTMLElement | null>
}

/** Stands in until the badges have been measured, which is what the column places by. */
const NOTHING_PLACED: ConnectorLayoutResult = {
  placements: [],
  omitted: 0,
  omittedBadge: null,
}

/**
 * The token badges to draw for the current selection, already laid out.
 *
 * Scoped to the selected node's own properties, one badge per enabled group's rows.
 * Every badge anchors to that node, so the column reads as a cluster of the tokens the
 * component carries. The edge the column hangs off is published so the reference badges
 * can favor the opposite one.
 */
export function useTokenConnector(): TokenConnectorState {
  const selectedNodeId = useSelectedNodeId()
  const canvasSize = useCanvasSize()
  const gutterSide = useRef<GutterSide>("left")
  const {
    showLayoutBadges,
    showSpaceBadges,
    showDimensionBadges,
    showAppearanceBadges,
    showTypographyBadges,
    showEffectsBadges,
  } = useEditorConfig()

  const { flatProperties } = useTokenProperties()

  // The rect map is written in place, so its version is what says the node has moved.
  const rectsVersion = useSharedStore(nodeRectsStore, (state) => state.version)

  const enabledGroups = useMemo(() => {
    const groups = new Set<TokenBadgeGroup>()

    if (showLayoutBadges) groups.add("layout")
    if (showSpaceBadges) groups.add("space")
    if (showDimensionBadges) groups.add("dimension")
    if (showAppearanceBadges) groups.add("appearance")
    if (showTypographyBadges) groups.add("typography")
    if (showEffectsBadges) groups.add("effects")

    return groups
  }, [
    showLayoutBadges,
    showSpaceBadges,
    showDimensionBadges,
    showAppearanceBadges,
    showTypographyBadges,
    showEffectsBadges,
  ])

  const scopedNodeIds = useMemo(
    () => (selectedNodeId ? new Set([selectedNodeId]) : new Set<string>()),
    [selectedNodeId],
  )

  useFollowCanvasTransform(scopedNodeIds)

  const sources = useMemo(() => {
    const rect = selectedNodeId ? (nodeRectsStore.getState().rects.get(selectedNodeId) ?? null) : null

    return buildTokenSources(rect, flatProperties, enabledGroups)
    // rectsVersion is read through the store so a move re-runs this.
  }, [selectedNodeId, flatProperties, enabledGroups, rectsVersion])

  const labels = useMemo(() => sources.map((source) => `${source.name}\u0000${source.value}`), [
    sources,
  ])
  const { metrics, measureRef } = useConnectorMetrics(labels, "tokenChip")

  const layout = useMemo(() => {
    if (!metrics) return NOTHING_PLACED

    const side = getGutterSide(
      sources,
      { canvasWidth: canvasSize.width, gutter: metrics.gutter },
      gutterSide.current,
    )

    gutterSide.current = side

    return layoutConnectors(sources, {
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      badgeWidth: metrics.badgeWidth,
      badgeHeight: metrics.badgeHeight,
      badgeGap: metrics.badgeGap,
      margin: metrics.badgeGap,
      gutter: metrics.gutter,
      side,
    })
  }, [sources, canvasSize.width, canvasSize.height, metrics])

  // The reference column reads this to favor the opposite edge. Cleared when no token
  // badges draw, so the reference column falls back to picking its own edge.
  useEffect(() => {
    setTokenGutterSide(sources.length > 0 ? gutterSide.current : null)
  }, [sources.length, layout])

  useEffect(() => {
    return () => setTokenGutterSide(null)
  }, [])

  const entries = useMemo(() => buildPlacedTokens(layout.placements, sources), [
    layout.placements,
    sources,
  ])

  return {
    entries,
    canvasSize,
    anchorRadius: metrics?.anchorRadius ?? 0,
    sources,
    measureRef,
  }
}

/** Pairs each placement back to the token source it was built from. */
function buildPlacedTokens(
  placements: ConnectorPlacement[],
  sources: TokenSource[],
): PlacedToken[] {
  const byKey = new Map(sources.map((source) => [source.key, source]))
  const entries: PlacedToken[] = []

  for (const placement of placements) {
    const source = byKey.get(placement.key)

    if (source) {
      entries.push({ placement, source })
    }
  }

  return entries
}
