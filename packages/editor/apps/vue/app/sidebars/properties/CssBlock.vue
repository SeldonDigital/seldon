<script setup lang="ts">
import Frame from "@seldon/components/frames/Frame.vue"

defineProps<{ cssProperties: string[] }>()
</script>

<template>
  <Frame class="properties-css-block">
    <p v-if="cssProperties.length === 0" class="properties-css-block__empty">
      No authored CSS for this node.
    </p>
    <code
      v-for="(declaration, index) in cssProperties"
      :key="index"
      class="properties-css-block__line"
    >{{ declaration }}</code>
  </Frame>
</template>

<style scoped>
.properties-css-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 12px 10px;
  font-family: var(--sdn-font-mono, monospace);
  font-size: 0.72rem;
  color: var(--sdn-swatch-gray, #a1a1aa);
}
.properties-css-block__line {
  white-space: pre-wrap;
  word-break: break-word;
}
.properties-css-block__empty {
  margin: 0;
  opacity: 0.6;
}
</style>
