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
  "aria-disabled": "true",
  "className": "sdn-calendar-day-muted sdn-calendar-day",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--k3ye"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar-day-muted", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"], "aria-disabled": sdn["aria-disabled"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </div>
</template>
