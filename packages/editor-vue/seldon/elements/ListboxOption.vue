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
  "role": "option",
  "aria-hidden": "false",
  "className": "sdn-listbox-option",
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou",
    "data-seldon-ref": "optionIcon"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "optionLabel"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-listbox-option", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </div>
</template>
