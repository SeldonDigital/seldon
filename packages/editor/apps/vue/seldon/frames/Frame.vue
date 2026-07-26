<script setup lang="ts">
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
