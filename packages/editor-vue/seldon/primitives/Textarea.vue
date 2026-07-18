<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  placeholder?: unknown
}>()

const sdn: Record<string, any> = {
  "placeholder": "Placeholder text",
  "className": "sdn-textarea"
}

const rootClassName = computed(() => combineClassNames("sdn-textarea", props.className))
</script>

<template>
    <textarea :class="rootClassName"><slot /></textarea>
</template>
