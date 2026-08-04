<script setup lang="ts">
// Draws the selection's property tokens out to named badges in the gutter.
//
// The hidden measured set stays mounted whether or not a column drew. Badges are placed
// from what that set reports, so unmounting it with the column would leave the next
// selection with nothing to measure. Vue port of the React `TokenConnector`.
import ConnectorPaths from "@app/overlays/primitives/ConnectorPaths.vue"
import { toElbowPath } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { computed } from "vue"

import TokenBadge from "./TokenBadge.vue"
import TokenBadgeMeasure from "./TokenBadgeMeasure.vue"
import {
  tokenConnectorAnchorStyle,
  tokenConnectorMutedAnchorStyle,
  tokenConnectorMutedStrokeStyle,
  tokenConnectorStrokeStyle,
  tokenConnectorSvgStyle,
} from "./token-connector-style"
import { useTokenConnector } from "./hooks/use-token-connector"

import type { ConnectorShape } from "@app/overlays/primitives/ConnectorPaths.vue"
import type {
  TokenStubGeometry,
  TokenTrunkGeometry,
} from "@seldon/editor/lib/canvas/connectors/token-connectors"

const { entries, geometry, canvasSize, anchorRadius, sources, measureRef } = useTokenConnector()

const shapes = computed<ConnectorShape[]>(() => {
  const stubShapes = geometry.value.stubs.map(toStubShape)
  const trunkShapes = geometry.value.trunks.flatMap((trunk) =>
    toTrunkShapes(trunk, anchorRadius.value),
  )

  return [...stubShapes, ...trunkShapes]
})

const hasColumn = computed(() => entries.value.length > 0)

/** A badge's stub. It carries no dot of its own, so the anchor is drawn at radius 0. */
function toStubShape(stub: TokenStubGeometry): ConnectorShape {
  return {
    key: `token-stub:${stub.key}`,
    d: toElbowPath(stub.points),
    anchorX: 0,
    anchorY: 0,
    anchorRadius: 0,
    strokeStyle: stub.muted ? tokenConnectorMutedStrokeStyle : tokenConnectorStrokeStyle,
    anchorStyle: tokenConnectorAnchorStyle,
  }
}

/**
 * A group's single connector to the object, drawn as one shape per run so each bus piece
 * keeps its own dashed or solid stroke. The dot where the trunk meets the node rides on the
 * first run, the elbow, and the rest draw the bus with no dot of their own.
 */
function toTrunkShapes(trunk: TokenTrunkGeometry, anchorRadius: number): ConnectorShape[] {
  const anchorStyle = trunk.muted ? tokenConnectorMutedAnchorStyle : tokenConnectorAnchorStyle

  return trunk.segments.map((segment, index) => {
    const strokeStyle = segment.muted ? tokenConnectorMutedStrokeStyle : tokenConnectorStrokeStyle
    const carriesAnchor = index === 0

    return {
      key: `token-trunk:${trunk.key}:${index}`,
      d: toElbowPath(segment.points),
      anchorX: trunk.anchor.x,
      anchorY: trunk.anchor.y,
      anchorRadius: carriesAnchor ? anchorRadius : 0,
      strokeStyle,
      anchorStyle,
    }
  })
}
</script>

<template>
  <template v-if="hasColumn">
    <ConnectorPaths
      :shapes="shapes"
      :width="canvasSize.width"
      :height="canvasSize.height"
      :style="tokenConnectorSvgStyle"
    />
    <TokenBadge
      v-for="entry in entries"
      :key="entry.source.key"
      :placement="entry.placement"
      :source="entry.source"
    />
  </template>
  <TokenBadgeMeasure ref="measureRef" :sources="sources" />
</template>
