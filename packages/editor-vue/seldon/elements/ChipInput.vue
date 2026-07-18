<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-chip",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lug5"
  },
  "icon": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-chip", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <span :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </span>
</template>
