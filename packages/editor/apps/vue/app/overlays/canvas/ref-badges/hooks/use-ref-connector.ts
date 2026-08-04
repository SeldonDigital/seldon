import { useActiveBoard } from "@app/canvas/use-active-board"
import { useSharedStore } from "@app/canvas/use-shared-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useCanvasSize } from "@app/overlays/hooks/use-canvas-size"
import { useRefBindings } from "@app/refs/use-ref-bindings"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { setAnchoredNodes } from "@seldon/editor/lib/canvas/connectors/anchored-nodes-store"
import {
  BOARD_EDGE_GUTTER,
  layoutConnectors,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import {
  buildConnectorSources,
  buildPlacedConnectors,
  collectAnchoredNodeIds,
  collectReferencedNodeIds,
  collectScopedNodeIds,
  collectSummaryNodes,
} from "@seldon/editor/lib/canvas/connectors/ref-connectors"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { storeToRefs } from "pinia"
import { computed, onScopeDispose, watch } from "vue"

import { useConnectorMetrics } from "./use-connector-metrics"
import { useFollowCanvasTransform } from "./use-follow-canvas-transform"

import type { CanvasSize } from "@app/overlays/hooks/use-canvas-size"
import type {
  ConnectorLayoutResult,
  GutterSide,
} from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { PlacedConnector } from "@seldon/editor/lib/canvas/connectors/ref-connectors"
import type { ComputedRef, Ref } from "vue"

interface RefConnectorState {
  entries: ComputedRef<PlacedConnector[]>
  canvasSize: Ref<CanvasSize>
  omitted: ComputedRef<number>
  omittedBadge: ComputedRef<ConnectorLayoutResult["omittedBadge"]>
  /** The dot where a connector meets its node, `0` until the metrics are read. */
  anchorRadius: ComputedRef<number>
  /** Every badge's label, and the hidden set the metrics are read from. */
  labels: ComputedRef<string[]>
  measureRef: Ref<{ $el?: HTMLElement } | null>
}

/** Stands in until the badges have been measured, which is what the column places by. */
const NOTHING_PLACED: ConnectorLayoutResult = {
  placements: [],
  omitted: 0,
  omittedBadge: null,
}

/** Refs hang off the left edge, nearest the objects sidebar, opposite the tokens. */
const REF_GUTTER_SIDE: GutterSide = "left"

/**
 * The connectors to draw for the current selection, already laid out.
 *
 * Scoped to the selection rather than the whole board. A board can carry dozens of
 * refs, and a column of dozens of badges reads as noise, so selecting a component in
 * the objects sidebar is what asks the question "what is wired up in here".
 *
 * Mirrors the React `useRefConnector`.
 */
export function useRefConnector(): RefConnectorState {
  const { refBindings } = useRefBindings()
  const { selectedNodeId } = useSelection()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace()
  const { propertiesFloating } = storeToRefs(useEditorConfigStore())
  // The rect map is written in place, so its version is what says a node has moved.
  const rectsVersion = useSharedStore(nodeRectsStore, (state) => state.version)
  const canvasSize = useCanvasSize()

  const scopedNodeIds = computed(() =>
    collectScopedNodeIds(activeBoard.value, selectedNodeId.value),
  )
  const referencedNodeIds = computed(() => collectReferencedNodeIds(refBindings.value))
  const summaryNodes = computed(() =>
    collectSummaryNodes(
      activeBoard.value,
      workspace.value,
      selectedNodeId.value,
      scopedNodeIds.value,
      referencedNodeIds.value,
    ),
  )

  useFollowCanvasTransform(scopedNodeIds)

  const sources = computed(() => {
    // Read so the sources are rebuilt whenever a tracked node moves.
    void rectsVersion.value

    return buildConnectorSources(
      refBindings.value,
      nodeRectsStore.getState().rects,
      scopedNodeIds.value,
      summaryNodes.value,
    )
  })

  const labels = computed(() => sources.value.map((source) => source.label))
  const { metrics, measureRef } = useConnectorMetrics(labels)

  // The badge's own gap spaces the column as well, both between badges and off the canvas
  // top and bottom, so the spacing follows the badge rather than a number kept here.
  //
  // A floating properties palette leaves the canvas edge far from the design, so the column
  // then hangs off the selection's own left edge instead. Docked, it hangs off the canvas
  // edge beside the sidebar as before.
  const layout = computed<ConnectorLayoutResult>(() => {
    const measured = metrics.value

    if (!measured) return NOTHING_PLACED

    // Read so a move re-runs this.
    void rectsVersion.value

    const boardRect =
      propertiesFloating.value && selectedNodeId.value
        ? (nodeRectsStore.getState().rects.get(selectedNodeId.value) ?? null)
        : null
    const onBoardEdge = boardRect !== null

    return layoutConnectors(sources.value, {
      canvasWidth: canvasSize.value.width,
      canvasHeight: canvasSize.value.height,
      badgeWidth: measured.badgeWidth,
      badgeHeight: measured.badgeHeight,
      badgeGap: measured.badgeGap,
      margin: measured.badgeGap,
      gutter: onBoardEdge ? BOARD_EDGE_GUTTER : measured.gutter,
      side: REF_GUTTER_SIDE,
      boardEdgeX: onBoardEdge ? boardRect.left : undefined,
    })
  })

  const entries = computed(() => buildPlacedConnectors(layout.value.placements, refBindings.value))

  // Published for the wireframe overlay, which draws a box per node and colors the ones a
  // connector meets. It reads a set of ids and stays clear of anything about refs.
  watch(
    () => collectAnchoredNodeIds(entries.value),
    (nodeIds) => setAnchoredNodes(nodeIds),
    { immediate: true },
  )

  // Cleared on the way out rather than alongside each write, which happens every frame of
  // a pan and would flicker every colored box back and forth.
  onScopeDispose(() => setAnchoredNodes([]))

  return {
    entries,
    canvasSize,
    omitted: computed(() => layout.value.omitted),
    omittedBadge: computed(() => layout.value.omittedBadge),
    anchorRadius: computed(() => metrics.value?.anchorRadius ?? 0),
    labels,
    measureRef,
  }
}
