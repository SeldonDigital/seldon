<script lang="ts">
// BESPOKE-VIEW: hand-authored SVG overlay layer. Raw svg markup, not a generated
// View. Elbow connectors are one path per line, which no Frame-based primitive
// can express. Vue port of the React `ConnectorPaths.bespoke`.
import type { CSSProperties } from "vue"

/**
 * One connector line and the dot at its origin, fully resolved. The caller does
 * the geometry so this view only draws.
 *
 * Paint arrives as a style object, not as loose stroke and fill values, because a
 * `var()` token reference resolves in CSS and is dropped in an SVG presentation
 * attribute. Geometry stays numeric, since an attribute is the only place it goes.
 */
export interface ConnectorShape {
  key: string
  d: string
  anchorX: number
  anchorY: number
  anchorRadius: number
  strokeStyle: CSSProperties
  anchorStyle: CSSProperties
}
</script>

<script setup lang="ts">
defineProps<{
  shapes: ConnectorShape[]
  width: number
  height: number
}>()
</script>

<template>
  <svg :width="width" :height="height">
    <g v-for="shape in shapes" :key="shape.key">
      <path :d="shape.d" :style="shape.strokeStyle" />
      <circle
        :cx="shape.anchorX"
        :cy="shape.anchorY"
        :r="shape.anchorRadius"
        :style="shape.anchorStyle"
      />
    </g>
  </svg>
</template>
