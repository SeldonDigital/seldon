<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-chip-filter sdn-chip",
  "icon": {
    "icon": "material-check",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lug5"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-chip-filter", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <span :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </span>
</template>
