<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "role": "menuitem",
  "aria-hidden": "false",
  "className": "sdn-menu-item",
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--fdei"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-menu-item", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
</script>

<template>
    <button :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
      </slot>
    </button>
</template>
