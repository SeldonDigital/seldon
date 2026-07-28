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
 * Form Control: FormControlDropdownControl
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Custom
 *
 * Structure:
 *   TextLabel     textLabel
 *   Select        select
 *     TextOption  textOption
 *     TextOption  textOption2
 *     TextOption  textOption3
 *
 * @example
 * ```vue
 * <FormControlDropdownControl
 *   aria-hidden="false"
 *   textLabel="{}"
 *   select="{}"
 *   textOption="{}"
 *   textOption2="{}"
 *   textOption3="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"
import Select from "../elements/Select.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextOption from "../primitives/TextOption.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  select?: Record<string, unknown> | null
  textOption?: Record<string, unknown> | null
  textOption2?: Record<string, unknown> | null
  textOption3?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--fwkw"
  },
  "select": {
    "aria-hidden": "false",
    "className": "sdn-select sdn-select--7bom"
  },
  "textOption": {
    "className": "sdn-text-option sdn-text-label--yqnd"
  },
  "textOption2": {
    "className": "sdn-text-option sdn-text-label--yqnd"
  },
  "textOption3": {
    "className": "sdn-text-option sdn-text-label--yqnd"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const selectProps = computed(() => mergeSlot(sdn.select, props.select, props.seldonRefs))
const textOptionProps = computed(() => mergeOptionalSlot(sdn.textOption, props.textOption, props.seldonRefs))
const textOption2Props = computed(() => mergeOptionalSlot(sdn.textOption2, props.textOption2, props.seldonRefs))
const textOption3Props = computed(() => mergeOptionalSlot(sdn.textOption3, props.textOption3, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <Select v-if="selectProps !== null" v-bind="selectProps">
          <TextOption v-if="textOptionProps !== null" v-bind="textOptionProps" />
          <TextOption v-if="textOption2Props !== null" v-bind="textOption2Props" />
          <TextOption v-if="textOption3Props !== null" v-bind="textOption3Props" />
        </Select>
      </slot>
    </div>
</template>
