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
 * Item: ItemNode
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```vue
 * <ItemNode
 *   role="treeitem"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ButtonIconic from "../elements/ButtonIconic.vue"
import ComboboxField from "../elements/ComboboxField.vue"

const props = defineProps<{
  className?: string
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "treeitem",
  "aria-hidden": "false",
  "className": "sdn-item-node sdn-item",
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "nodeToggle"
  },
  "icon": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "nodeToggleIcon"
  },
  "comboboxField": {
    "className": "sdn-combobox-field sdn-combobox-field--lmje"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "nodeIcon"
  },
  "input": {
    "placeholder": "Component Name",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--pzcf",
    "data-seldon-ref": "nodeLabel"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "nodeDisplay"
  },
  "icon3": {
    "icon": "seldon-display",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "buttonIconic3": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "nodeActions"
  },
  "icon4": {
    "icon": "seldon-more",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-item-node", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const comboboxFieldProps = computed(() => mergeSlot(sdn.comboboxField, props.comboboxField))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const buttonIconic3Props = computed(() => mergeSlot(sdn.buttonIconic3, props.buttonIconic3))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
</script>

<template>
    <li :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
        <ComboboxField v-if="comboboxField && comboboxFieldProps" v-bind="comboboxFieldProps" :icon="icon2Props" :input="inputProps" :buttonIconic="buttonIconic2Props" :icon2="icon3Props" />
        <ButtonIconic v-if="buttonIconic3 && buttonIconic3Props" v-bind="buttonIconic3Props" :icon="icon4Props" />
      </slot>
    </li>
</template>
