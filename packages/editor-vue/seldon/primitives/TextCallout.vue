<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
  htmlElement?: unknown
}>()

const sdn: Record<string, any> = {
  "children": "Callout",
  "htmlElement": "h6",
  "aria-hidden": "false",
  "className": "sdn-text-callout sdn-text"
}

const rootClassName = computed(() => combineClassNames("sdn-text-callout", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>{{ (props.children ?? sdn.children) }}</slot></component>
</template>
