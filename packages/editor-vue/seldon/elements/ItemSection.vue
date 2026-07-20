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
 * Item: ItemSection
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```vue
 * <ItemSection
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   textLabel="{}"
 *   buttonIconic2={() => {}}
 *   buttonIconic3={() => {}}
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ButtonIconic from "../elements/ButtonIconic.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  formControlCombobox?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  buttonIconic3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-item-section sdn-item",
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionToggle"
  },
  "icon": {
    "icon": "material-unfoldMore",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--umgs",
    "data-seldon-ref": "sectionToggleIcon"
  },
  "formControlCombobox": {
    "className": "sdn-form-control sdn-form-control-combobox--gqrl"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--z34z",
    "data-seldon-ref": "sectionLabel"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--sdjv",
    "data-seldon-ref": "sectionAdd"
  },
  "icon2": {
    "icon": "material-add",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--0qvc"
  },
  "buttonIconic3": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionActions"
  },
  "icon3": {
    "icon": "seldon-more",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--0qvc"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-item-section", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const formControlComboboxProps = computed(() => mergeSlot(sdn.formControlCombobox, props.formControlCombobox))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const buttonIconic3Props = computed(() => mergeSlot(sdn.buttonIconic3, props.buttonIconic3))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
</script>

<template>
    <li :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
        <FormControlCombobox v-if="formControlCombobox && formControlComboboxProps" v-bind="formControlComboboxProps">
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </FormControlCombobox>
        <ButtonIconic v-if="buttonIconic2 && buttonIconic2Props" v-bind="buttonIconic2Props" :icon="icon2Props" />
        <ButtonIconic v-if="buttonIconic3 && buttonIconic3Props" v-bind="buttonIconic3Props" :icon="icon3Props" />
      </slot>
    </li>
</template>
