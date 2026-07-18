import { ExportOptions, FileToExport } from "../../types"

/**
 * Emits the shared `Frame.vue` wrapper. A Frame is the cross-level container:
 * it renders a configurable native element (`div` by default) with the merged
 * class name and forwards its default slot. This mirrors the React `Frame`
 * component's role in generated output.
 */
export function generateFrameComponent(options: ExportOptions): FileToExport {
  const folder = options.output.componentsFolder
  const content = `<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  wrapperElement?: string
}>()

const tag = computed(() => props.wrapperElement ?? "div")
const rootClassName = computed(() => combineClassNames(props.className))
</script>

<template>
  <component :is="tag" :class="rootClassName">
    <slot />
  </component>
</template>
`
  return {
    path: `${folder}/frames/Frame.vue`.replaceAll("//", "/"),
    content,
  }
}
