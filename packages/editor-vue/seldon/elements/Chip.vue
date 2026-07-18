<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-chip",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lug5"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-chip", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <span :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </span>
</template>
