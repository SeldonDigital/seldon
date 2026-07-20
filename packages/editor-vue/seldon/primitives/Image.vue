<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  src?: unknown
}>()

const sdn: Record<string, any> = {
  "src": "https://static.seldon.app/background-default-dark.jpg",
  "aria-hidden": "false",
  "className": "sdn-image"
}

const rootClassName = computed(() => combineClassNames("sdn-image", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <img :class="rootClassName" :src="(props.src as string) ?? sdn.src" v-bind="rootAttrs" />
</template>
