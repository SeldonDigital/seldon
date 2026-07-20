<script setup lang="ts">
import type { CSSProperties } from "vue"

/** Fixed, top-most ring drawn around the focused element. Position and size arrive via style. */
defineProps<{ style: CSSProperties }>()
</script>

<template>
  <div class="editor-focus-ring" :style="style" aria-hidden="true" />
</template>
