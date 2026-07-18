<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
  htmlElement?: unknown
}>()

const sdn: Record<string, any> = {
  "children": "Heading",
  "htmlElement": "h2",
  "aria-hidden": "false",
  "className": "sdn-text-heading sdn-text"
}

const rootClassName = computed(() => combineClassNames("sdn-text-heading", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>{{ (props.children ?? sdn.children) }}</slot></component>
</template>
