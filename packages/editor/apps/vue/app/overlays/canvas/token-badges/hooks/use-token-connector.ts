import { useSharedStore } from "@app/canvas/use-shared-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useCanvasSize } from "@app/overlays/hooks/use-canvas-size"
import { useSelection } from "@app/workspace/use-selection"
import { BOARD_EDGE_GUTTER } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import {
  buildTokenConnectorGeometry,
  layoutTokenColumn,
} from "@seldon/editor/lib/canvas/connectors/token-connectors"
import { buildTokenSources } from "@seldon/editor/lib/canvas/connectors/token-sources"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { useConnectorMetrics } from "../../ref-badges/hooks/use-connector-metrics"
import { useFollowCanvasTransform } from "../../ref-badges/hooks/use-follow-canvas-transform"
import { useTokenProperties } from "./use-token-property-row"

import type { CanvasSize } from "@app/overlays/hooks/use-canvas-size"
import type { GutterSide } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type {
  TokenBadgePlacement,
  TokenConnectorGeometry,
} from "@seldon/editor/lib/canvas/connectors/token-connectors"
import type { TokenBadgeGroup } from "@seldon/editor/lib/canvas/connectors/token-groups"
import type { TokenSource } from "@seldon/editor/lib/canvas/connectors/token-sources"
import type { ComputedRef, Ref } from "vue"

export interface PlacedToken {
  placement: TokenBadgePlacement
  source: TokenSource
}

interface TokenConnectorState {
  entries: ComputedRef<PlacedToken[]>
  /** The stubs and per-group trunks the connectors draw, grouped off the badges. */
  geometry: ComputedRef<TokenConnectorGeometry>
  canvasSize: Ref<CanvasSize>
  /** The dot where a connector meets its node, `0` until the metrics are read. */
  anchorRadius: ComputedRef<number>
  /** Every badge's source, and the element the metrics are read from. */
  sources: ComputedRef<TokenSource[]>
  measureRef: Ref<{ $el?: HTMLElement } | null>
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
 *
 * Mirrors the React `useTokenConnector`.
 */
export function useTokenConnector(): TokenConnectorState {
  const { selectedNodeId } = useSelection()
  const canvasSize = useCanvasSize()
  const config = useEditorConfigStore()
  const {
    showLayoutBadges,
    showSpaceBadges,
    showDimensionBadges,
    showAppearanceBadges,
    showTypographyBadges,
    showEffectsBadges,
    propertiesFloating,
  } = storeToRefs(config)

  const { flatProperties, theme } = useTokenProperties()

  // The rect map is written in place, so its version is what says the node has moved.
  const rectsVersion = useSharedStore(nodeRectsStore, (state) => state.version)

  const enabledGroups = computed(() => {
    const groups = new Set<TokenBadgeGroup>()

    if (showLayoutBadges.value) groups.add("layout")
    if (showSpaceBadges.value) groups.add("space")
    if (showDimensionBadges.value) groups.add("dimension")
    if (showAppearanceBadges.value) groups.add("appearance")
    if (showTypographyBadges.value) groups.add("typography")
    if (showEffectsBadges.value) groups.add("effects")

    return groups
  })

  const scopedNodeIds = computed(() =>
    selectedNodeId.value ? new Set([selectedNodeId.value]) : new Set<string>(),
  )

  useFollowCanvasTransform(scopedNodeIds)

  const sources = computed<TokenSource[]>(() => {
    // Read so the sources are rebuilt whenever the tracked node moves.
    void rectsVersion.value

    const rect = selectedNodeId.value
      ? (nodeRectsStore.getState().rects.get(selectedNodeId.value) ?? null)
      : null

    return buildTokenSources(rect, flatProperties.value, enabledGroups.value, theme.value)
  })

  const labels = computed(() => sources.value.map((source) => `${source.name}\u0000${source.value}`))
  const { metrics, measureRef } = useConnectorMetrics(labels, "tokenChip")

  // Grouped and seated on the selection: badges cluster by group with a wider gap between
  // groups, and the stack is offset so the group nearest its middle reads straight across
  // while the rest spread above and below.
  //
  // A floating properties palette leaves the canvas edge far from the design, so the column
  // then hangs off the selection's own right edge instead. Docked, it hangs off the canvas
  // edge beside the sidebar as before.
  const placements = computed<TokenBadgePlacement[]>(() => {
    const measured = metrics.value
    const rect = sources.value[0]?.rect

    if (!measured || !rect || sources.value.length === 0) return NO_PLACEMENTS

    return layoutTokenColumn(sources.value, {
      canvasWidth: canvasSize.value.width,
      canvasHeight: canvasSize.value.height,
      badgeWidth: measured.badgeWidth,
      badgeHeight: measured.badgeHeight,
      badgeGap: measured.badgeGap,
      margin: measured.badgeGap,
      gutter: propertiesFloating.value ? BOARD_EDGE_GUTTER : measured.gutter,
      side: TOKEN_GUTTER_SIDE,
      selectionCenterY: rect.top + rect.height / 2,
      boardEdgeX: propertiesFloating.value ? rect.left + rect.width : undefined,
    })
  })

  const entries = computed(() => buildPlacedTokens(placements.value, sources.value))

  // One connector per group: short stubs off each badge into a shared bus, then a single
  // trunk to the node at the corner the seated stack put the group against.
  const geometry = computed<TokenConnectorGeometry>(() => {
    const measured = metrics.value
    const rect = sources.value[0]?.rect

    if (!rect || !measured || placements.value.length === 0) return NO_GEOMETRY

    return buildTokenConnectorGeometry(placements.value, {
      side: TOKEN_GUTTER_SIDE,
      rect,
      canvasWidth: canvasSize.value.width,
      canvasHeight: canvasSize.value.height,
      margin: measured.badgeGap,
      boardAnchored: propertiesFloating.value,
    })
  })

  return {
    entries,
    geometry,
    canvasSize,
    anchorRadius: computed(() => metrics.value?.anchorRadius ?? 0),
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
