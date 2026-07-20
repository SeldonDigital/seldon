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
 * Calendar Day: CalendarDayGridCell
 * Level: Element
 * Intent: A single day cell for a calendar grid. The default renders a plain number; variants cover muted out-of-month days, the selected day, and the current day.
 * Tags: calendar, day, date, cell, ui, grid
 * Type: Custom
 *
 * @example
 * ```vue
 * <CalendarDayGridCell
 *   wrapperElement="div"
 *   aria-hidden="false"
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
  wrapperElement?: unknown
  textLabel?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "wrapperElement": "div",
  "aria-hidden": "false",
  "className": "sdn-calendar-day-grid-cell sdn-calendar-day",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar-day-grid-cell", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
      </slot>
    </div>
</template>
