<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  placeholder?: unknown
  type?: unknown
}>()

const sdn: Record<string, any> = {
  "placeholder": "Placeholder text",
  "type": "radio",
  "className": "sdn-input-checkbox sdn-input"
}

const rootClassName = computed(() => combineClassNames("sdn-input-checkbox", props.className))
</script>

<template>
    <input :class="rootClassName"><slot /></input>
</template>
