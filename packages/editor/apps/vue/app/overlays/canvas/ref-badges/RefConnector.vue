<script setup lang="ts">
import ConnectorPaths from "@app/overlays/primitives/ConnectorPaths.vue"
import { toElbowPath } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { computed } from "vue"

import RefBadge from "./RefBadge.vue"
import RefBadgeMeasure from "./RefBadgeMeasure.vue"
import RefOmitted from "./RefOmitted.vue"
import RefSummaryBadge from "./RefSummaryBadge.vue"
import {
  connectorAnchorStyle,
  connectorMutedAnchorStyle,
  connectorMutedStrokeStyle,
  connectorStrokeStyle,
  connectorSvgStyle,
} from "./connector-style"
import { useRefConnector } from "./hooks/use-ref-connector"

import type { ConnectorShape } from "@app/overlays/primitives/ConnectorPaths.vue"

/**
 * Draws the refs inside the selected component out to named badges.
 *
 * A ref with no consumers still draws, faint and dashed. That a ref reached generated
 * code but nothing drives it is the useful thing to see.
 *
 * The hidden measured set stays mounted whether or not a column drew. Badges are placed
 * from what that set reports, so unmounting it with the column would leave the next
 * selection with nothing to measure.
 *
 * Mirrors the React `RefConnector`.
 */
const { entries, canvasSize, omitted, omittedBadge, anchorRadius, labels, measureRef } =
  useRefConnector()

const shapes = computed<ConnectorShape[]>(() =>
  entries.value.map(({ placement }) => ({
    key: placement.key,
    d: toElbowPath(placement.points),
    anchorX: placement.anchor.x,
    anchorY: placement.anchor.y,
    anchorRadius: anchorRadius.value,
    strokeStyle: placement.muted ? connectorMutedStrokeStyle : connectorStrokeStyle,
    anchorStyle: placement.muted ? connectorMutedAnchorStyle : connectorAnchorStyle,
  })),
)

const hasColumn = computed(() => entries.value.length > 0)
</script>

<template>
  <template v-if="hasColumn">
    <ConnectorPaths
      :shapes="shapes"
      :width="canvasSize.width"
      :height="canvasSize.height"
      :style="connectorSvgStyle"
    />
    <template v-for="entry in entries" :key="entry.placement.key">
      <RefSummaryBadge
        v-if="entry.kind === 'summary'"
        :placement="entry.placement"
        :node-id="entry.nodeId"
      />
      <RefBadge v-else :placement="entry.placement" :binding="entry.binding" />
    </template>
    <RefOmitted v-if="omittedBadge" :badge="omittedBadge" :count="omitted" />
  </template>
  <RefBadgeMeasure ref="measureRef" :labels="labels" />
</template>
