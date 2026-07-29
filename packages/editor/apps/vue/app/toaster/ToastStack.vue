<script setup lang="ts">
// BESPOKE-VIEW: hand-authored transitional View with inline token styling.
// Replace with a generated workspace component once one covers the toast stack.
// Vue port of the React `ToastStack.bespoke`.
import type { CSSProperties } from "vue"

/** Above the canvas and its overlays, below the window layer that owns dialogs. */
const STACK_Z_INDEX = 50

const stackStyle: CSSProperties = {
  position: "absolute",
  bottom: "var(--sdn-sizes-xxlarge)",
  left: "50%",
  zIndex: STACK_Z_INDEX,
  display: "flex",
  flexDirection: "column",
  gap: "var(--sdn-gaps-compact)",
  transform: "translateX(-50%)",
}
</script>

<template>
  <div :style="stackStyle">
    <slot />
  </div>
</template>
