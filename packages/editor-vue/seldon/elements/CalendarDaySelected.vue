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
  "aria-selected": "true",
  "className": "sdn-calendar-day-selected sdn-calendar-day",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--fye8"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar-day-selected", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"], "aria-selected": sdn["aria-selected"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </div>
</template>
