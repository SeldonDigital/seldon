<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
}>()

const sdn: Record<string, any> = {
  "role": "switch",
  "aria-checked": "false",
  "className": "sdn-toggle-switch"
}

const rootClassName = computed(() => combineClassNames("sdn-toggle-switch", props.className))
const rootAttrs = { "role": sdn["role"], "aria-checked": sdn["aria-checked"] }
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs"><slot /></div>
</template>
