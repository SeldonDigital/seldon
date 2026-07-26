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
 * Textarea: Textarea
 * Level: Primitive
 * Intent: Multi-line text input control for collecting longer user input.
 * Tags: textarea, form, text, primitive, field, user entry, control, multiline
 * Type: Default
 *
 * @example
 * ```vue
 * <Textarea
 *   placeholder="Placeholder text"
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
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "placeholder": "Placeholder text",
  "className": "sdn-textarea"
}

const rootClassName = computed(() => combineClassNames("sdn-textarea", props.className))
</script>

<template>
    <textarea :class="rootClassName" :placeholder="(props.placeholder as string) ?? sdn.placeholder"><slot /></textarea>
</template>
