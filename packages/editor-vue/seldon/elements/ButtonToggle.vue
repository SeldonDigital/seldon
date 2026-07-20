<script lang="ts">
/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

/*****
 * Button: Toggle
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```vue
 * <ButtonToggle
 *   icon="material-star"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Icon from "../primitives/Icon.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-button-toggle", props.className))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
</script>

<template>
    <button :class="rootClassName">
      <slot>
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
      </slot>
    </button>
</template>
