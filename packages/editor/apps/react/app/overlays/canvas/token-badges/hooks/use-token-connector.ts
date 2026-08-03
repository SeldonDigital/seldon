"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import {
  buildTokenConnectorGeometry,
  layoutTokenColumn,
} from "@seldon/editor/lib/canvas/connectors/token-connectors"
import { BOARD_EDGE_GUTTER } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { buildTokenSources } from "@seldon/editor/lib/canvas/connectors/token-sources"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { useMemo } from "react"

import { useCanvasSize } from "../../../hooks/use-canvas-size"
import { useConnectorMetrics } from "../../ref-badges/hooks/use-connector-metrics"
import { useFollowCanvasTransform } from "../../ref-badges/hooks/use-follow-canvas-transform"
import { useTokenProperties } from "./use-token-property-row"

import type { GutterSide } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type {
  TokenBadgePlacement,
  TokenConnectorGeometry,
} from "@seldon/editor/lib/canvas/connectors/token-connectors"
import type { TokenBadgeGroup } from "@seldon/editor/lib/canvas/connectors/token-groups"
import type { TokenSource } from "@seldon/editor/lib/canvas/connectors/token-sources"
import type { RefObject } from "react"

export interface PlacedToken {
  placement: TokenBadgePlacement
  source: TokenSource
}

interface TokenConnectorState {
  entries: PlacedToken[]
  /** The stubs and per-group trunks the connectors draw, grouped off the badges. */
  geometry: TokenConnectorGeometry
  canvasSize: { width: number; height: number }
  /** The dot where a connector meets its node, `0` until the metrics are read. */
  anchorRadius: number
  /** Every badge's source, and the element the metrics are read from. */
  sources: TokenSource[]
  measureRef: RefObject<HTMLElement | null>
}

const NO_GEOMETRY: TokenConnectorGeometry = { stubs: [], trunks: [] }

const NO_PLACEMENTS: TokenBadgePlacement[] = []

/** Tokens hang off the right edge, nearest the properties sidebar, opposite the refs. */
const TOKEN_GUTTER_SIDE: GutterSide = "right"

/**
 * The token badges to draw for the current selection, already laid out.
 *
 * Scoped to the selected node's own properties, one badge per enabled group's rows.
 * Every badge anchors to that node, so the column reads as a cluster of the tokens the
 * component carries. The column hangs off the right edge, opposite the reference column.
 */
export function useTokenConnector(): TokenConnectorState {
  const selectedNodeId = useSelectedNodeId()
  const canvasSize = useCanvasSize()
  const {
    showLayoutBadges,
    showSpaceBadges,
    showDimensionBadges,
    showAppearanceBadges,
    showTypographyBadges,
    showEffectsBadges,
    propertiesFloating,
  } = useEditorConfig()

  const { flatProperties, theme } = useTokenProperties()

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

    return buildTokenSources(rect, flatProperties, enabledGroups, theme)
    // rectsVersion is read through the store so a move re-runs this.
  }, [selectedNodeId, flatProperties, enabledGroups, theme, rectsVersion])

  const labels = useMemo(() => sources.map((source) => `${source.name}\u0000${source.value}`), [
    sources,
  ])
  const { metrics, measureRef } = useConnectorMetrics(labels, "tokenChip")

  // Grouped and seated on the selection: badges cluster by group with a wider gap between
  // groups, and the stack is offset so the group nearest its middle reads straight across
  // while the rest spread above and below.
  //
  // A floating properties palette leaves the canvas edge far from the design, so the column
  // then hangs off the selection's own right edge instead. Docked, it hangs off the canvas
  // edge beside the sidebar as before.
  const placements = useMemo(() => {
    const rect = sources[0]?.rect

    if (!metrics || !rect || sources.length === 0) return NO_PLACEMENTS

    return layoutTokenColumn(sources, {
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      badgeWidth: metrics.badgeWidth,
      badgeHeight: metrics.badgeHeight,
      badgeGap: metrics.badgeGap,
      margin: metrics.badgeGap,
      gutter: propertiesFloating ? BOARD_EDGE_GUTTER : metrics.gutter,
      side: TOKEN_GUTTER_SIDE,
      selectionCenterY: rect.top + rect.height / 2,
      boardEdgeX: propertiesFloating ? rect.left + rect.width : undefined,
    })
  }, [sources, canvasSize.width, canvasSize.height, metrics, propertiesFloating])

  const entries = useMemo(() => buildPlacedTokens(placements, sources), [placements, sources])

  // One connector per group: short stubs off each badge into a shared bus, then a single
  // trunk to the node at the corner the seated stack put the group against.
  const geometry = useMemo(() => {
    const rect = sources[0]?.rect

    if (!rect || !metrics || placements.length === 0) return NO_GEOMETRY

    return buildTokenConnectorGeometry(placements, {
      side: TOKEN_GUTTER_SIDE,
      rect,
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      margin: metrics.badgeGap,
    })
  }, [placements, sources, metrics, canvasSize.width, canvasSize.height])

  return {
    entries,
    geometry,
    canvasSize,
    anchorRadius: metrics?.anchorRadius ?? 0,
    sources,
    measureRef,
  }
}

/** Pairs each placement back to the token source it was built from. */
function buildPlacedTokens(
  placements: TokenBadgePlacement[],
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
