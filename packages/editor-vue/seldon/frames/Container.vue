<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  wrapperElement?: unknown
}>()

const sdn: Record<string, any> = {
  "wrapperElement": "div",
  "aria-hidden": "false",
  "className": "sdn-container"
}

const rootClassName = computed(() => combineClassNames("sdn-container", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.wrapperElement as string) ?? sdn.wrapperElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot></slot></component>
</template>
