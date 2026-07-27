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
 * Button: Simple
 * Level: Element
 * Intent: Standard button for triggering actions like submit, confirm, or cancel.
 * Tags: button, action, UI, primary, click, control, submit, call to action
 * Type: Custom
 *
 * @example
 * ```vue
 * <ButtonSimple
 *   textLabel="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ylte"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-button-simple", props.className))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <button :class="rootClassName">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </button>
</template>
