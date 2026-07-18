<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-chip-iconic sdn-chip",
  "icon": {
    "icon": "material-inbox",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--gh8m"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-chip-iconic", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <span :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </span>
</template>
