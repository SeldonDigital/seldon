<script setup lang="ts">
import { useZoomControlsStore } from "@app/stores/zoom-controls-store"

const zoom = useZoomControlsStore()
</script>

<template>
  <div class="zoom-controls">
    <button type="button" title="Zoom out ( - )" @click="zoom.zoomOut()">
      &minus;
    </button>
    <button type="button" title="Reset zoom" @click="zoom.resetZoom()">
      100%
    </button>
    <button type="button" title="Zoom in ( + )" @click="zoom.zoomIn()">
      &plus;
    </button>
  </div>
</template>

<style scoped>
.zoom-controls {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  gap: 1px;
  background: #e4e4e7;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  z-index: 20;
}
.zoom-controls button {
  border: none;
  background: #fff;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  color: #3f3f46;
  cursor: pointer;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.zoom-controls button:hover {
  background: #f4f4f5;
}
</style>
