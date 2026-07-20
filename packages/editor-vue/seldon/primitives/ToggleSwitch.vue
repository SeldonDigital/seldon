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
 * Toggle Switch: ToggleSwitch
 * Level: Primitive
 * Intent: Toggles a single setting on or off with a sliding thumb.
 * Tags: toggle, switch, control, boolean, binary, on off, ui, form
 * Type: Default
 *
 * @example
 * ```vue
 * <ToggleSwitch
 *   role="switch"
 *   aria-checked="false"
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
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "switch",
  "aria-checked": "false",
  "className": "sdn-toggle-switch"
}

const rootClassName = computed(() => combineClassNames("sdn-toggle-switch", props.className))
const rootAttrs = { "role": sdn["role"], "aria-checked": sdn["aria-checked"] }
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs"><slot /></div>
</template>
