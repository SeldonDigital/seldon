<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-hr"
}

const rootClassName = computed(() => combineClassNames("sdn-hr", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <hr :class="rootClassName" v-bind="rootAttrs"><slot /></hr>
</template>
