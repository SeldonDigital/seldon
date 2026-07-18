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
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--sa6t"
  },
  "icon": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--y2ct"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-button-menu", props.className))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <button :class="rootClassName">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </button>
</template>
