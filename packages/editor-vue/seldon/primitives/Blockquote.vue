<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
}>()

const sdn: Record<string, any> = {
  "children": "Blockquote",
  "aria-hidden": "false",
  "className": "sdn-blockquote"
}

const rootClassName = computed(() => combineClassNames("sdn-blockquote", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <blockquote :class="rootClassName" v-bind="rootAttrs">{{ (props.children ?? sdn.children) }}</blockquote>
</template>
