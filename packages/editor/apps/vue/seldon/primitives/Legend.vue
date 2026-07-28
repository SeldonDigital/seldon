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

/**
 * Legend: Legend
 * Level: Primitive
 * Intent: Provides a caption for a group of related form controls.
 * Tags: legend, form, group, caption, fieldset, primitive, text
 * Type: Default
 *
 * @example
 * ```vue
 * <Legend
 *   children="Legend"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "children": "Legend",
  "aria-hidden": "false"
}

const rootClassName = computed(() => combineClassNames("sdn-legend", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <legend :class="rootClassName" v-bind="rootAttrs">{{ (props.children ?? sdn.children) }}</legend>
</template>
