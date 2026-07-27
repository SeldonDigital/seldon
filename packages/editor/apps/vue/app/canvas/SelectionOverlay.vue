<script setup lang="ts">
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { OutlineColors } from "@seldon/editor/lib/canvas/overlay/outline-colors"
import { computed } from "vue"

import { outlineBoxStyle } from "./overlay-box-style"

const props = withDefaults(
  defineProps<{
    rect: NodeRect | null
    colors: OutlineColors | null
    wireframe?: boolean
  }>(),
  { wireframe: false },
)

const style = computed(() =>
  props.rect
    ? outlineBoxStyle(
        props.rect,
        "selection",
        props.wireframe,
        props.colors?.selection,
      )
    : null,
)
</script>

<template>
  <div v-if="style" :style="style" />
</template>
