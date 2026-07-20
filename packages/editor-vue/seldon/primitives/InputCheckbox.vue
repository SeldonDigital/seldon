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
 * Input: Checkbox
 * Level: Primitive
 * Intent: Low-level text input control for collecting user input.
 * Tags: input, form, text, primitive, field, user entry, control
 * Type: Custom
 *
 * @example
 * ```vue
 * <InputCheckbox
 *   placeholder="Placeholder text"
 *   type="checkbox"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  placeholder?: unknown
  type?: unknown
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "placeholder": "Placeholder text",
  "type": "checkbox",
  "className": "sdn-input-checkbox sdn-input"
}

const rootClassName = computed(() => combineClassNames("sdn-input-checkbox", props.className))
</script>

<template>
    <input :class="rootClassName" :placeholder="(props.placeholder as string) ?? sdn.placeholder" :type="(props.type as string) ?? sdn.type" />
</template>
