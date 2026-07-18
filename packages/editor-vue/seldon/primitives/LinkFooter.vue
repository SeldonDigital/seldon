<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
}>()

const sdn: Record<string, any> = {
  "children": "Link",
  "aria-hidden": "false",
  "className": "sdn-link-footer sdn-link"
}

const rootClassName = computed(() => combineClassNames("sdn-link-footer", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <a :class="rootClassName" v-bind="rootAttrs">{{ (props.children ?? sdn.children) }}</a>
</template>
