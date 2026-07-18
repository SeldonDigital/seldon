<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
  htmlElement?: unknown
}>()

const sdn: Record<string, any> = {
  "children": "Description",
  "htmlElement": "p",
  "aria-hidden": "false",
  "className": "sdn-text-description sdn-text"
}

const rootClassName = computed(() => combineClassNames("sdn-text-description", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>{{ (props.children ?? sdn.children) }}</slot></component>
</template>
