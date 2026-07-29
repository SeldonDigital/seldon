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
 * Calendar Day: CalendarDaySelected
 * Level: Element
 * Intent: A single day cell for a calendar grid. The default renders a plain number; variants cover muted out-of-month days, the selected day, and the current day.
 * Tags: calendar, day, date, cell, ui, grid
 * Type: Custom
 *
 * Structure:
 *   TextLabel  textLabel
 *
 * @example
 * ```vue
 * <CalendarDaySelected
 *   wrapperElement="div"
 *   aria-hidden="false"
 *   aria-selected="true"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  wrapperElement?: unknown
  textLabel?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "wrapperElement": "div",
  "aria-hidden": "false",
  "aria-selected": "true",
  "textLabel": {
    "children": "00",
    "className": "sdn-text-label sdn-text-label--fye8"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar-day-selected", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"], "aria-selected": sdn["aria-selected"] }
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      </slot>
    </div>
</template>
