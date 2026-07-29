<script setup lang="ts">
import { computed } from "vue"

import { outlineBoxStyle } from "./outline-box-style"

import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { OutlineColors } from "@seldon/editor/lib/canvas/overlay/outline-colors"

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
    ? outlineBoxStyle(props.rect, "selection", props.wireframe, props.colors?.selection)
    : null,
)
</script>

<template>
  <div v-if="style" :style="style" />
</template>
