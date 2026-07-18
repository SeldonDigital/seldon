<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-button-iconic", props.className))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <button :class="rootClassName">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </button>
</template>
