<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
  htmlElement?: unknown
}>()

const sdn: Record<string, any> = {
  "children": "Option Name",
  "htmlElement": "option",
  "aria-hidden": "false",
  "className": "sdn-text-option sdn-text"
}

const rootClassName = computed(() => combineClassNames("sdn-text-option", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>{{ (props.children ?? sdn.children) }}</slot></component>
</template>
