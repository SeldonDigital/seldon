/***** * * This code was generated using Seldon (https://github.com/SeldonDigital/seldon) * *
License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md * Do not redistribute or
sublicense without permission. * * You may not use this software, or any derivative works of it, in
whole or in part, * for the purposes of training, fine-tuning, or otherwise improving (directly or
indirectly) * any machine learning or artificial intelligence system without written permission. *
*****/

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
 * Item: ItemSection
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> sectionDisclosure
 *     Icon               icon                 -> sectionDisclosureIcon
 *   FormControlCombobox  formControlCombobox
 *     TextLabel          textLabel            -> sectionLabel
 *   ButtonIconic         buttonIconic2        -> sectionAdd
 *     Icon               icon2
 *   ButtonIconic         buttonIconic3        -> sectionActions
 *     Icon               icon3
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
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import FormControlCombobox from "../elements/FormControlCombobox.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionDisclosure",
  },
  icon: {
    icon: "material-unfoldMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
    "data-seldon-ref": "sectionDisclosureIcon",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--gqrl",
  },
  textLabel: {
    children: "Section Name",
    className: "sdn-text-label sdn-text-label--z34z",
    "data-seldon-ref": "sectionLabel",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
    "data-seldon-ref": "sectionAdd",
  },
  icon2: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--0qvc",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--0qvc",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-item-section", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const formControlComboboxProps = computed(() =>
  mergeOptionalSlot(sdn.formControlCombobox, props.formControlCombobox, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const buttonIconic2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const buttonIconic3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic3, props.buttonIconic3, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
</script>

<template>
  <li :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <ButtonIconic
        v-if="buttonIconicProps !== null"
        v-bind="buttonIconicProps"
        :icon="iconProps"
      />
      <FormControlCombobox
        v-if="formControlComboboxProps !== null"
        v-bind="formControlComboboxProps"
      >
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      </FormControlCombobox>
      <ButtonIconic
        v-if="buttonIconic2Props !== null"
        v-bind="buttonIconic2Props"
        :icon="icon2Props"
      />
      <ButtonIconic
        v-if="buttonIconic3Props !== null"
        v-bind="buttonIconic3Props"
        :icon="icon3Props"
      />
    </slot>
  </li>
</template>
