<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  wrapperElement?: unknown
  textLabel?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "wrapperElement": "div",
  "aria-hidden": "false",
  "className": "sdn-calendar-day-grid-cell sdn-calendar-day",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar-day-grid-cell", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </div>
</template>
