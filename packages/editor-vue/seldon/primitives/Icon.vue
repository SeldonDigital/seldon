<script setup lang="ts">
import { computed } from "vue"
import { ICONS } from "../icons/index"
import { combineClassNames } from "../utils/class-names"
import { getRegisteredIcon } from "../utils/icon-registry"

const props = defineProps<{
  className?: string
  icon?: string
}>()

const iconClassName = computed(() => combineClassNames("sdn-icon", props.className))
const geometry = computed(
  () =>
    ICONS[props.icon ?? "__default__"] ??
    getRegisteredIcon(props.icon) ??
    ICONS.__default__,
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="geometry.viewBox"
    :fill="geometry.fill ?? 'currentColor'"
    height="1em"
    width="1em"
    :class="iconClassName"
    aria-hidden="true"
    v-html="geometry.body"
  />
</template>
