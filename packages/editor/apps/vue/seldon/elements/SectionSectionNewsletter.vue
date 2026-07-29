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
 * Section: SectionNewsletter
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * Structure:
 *   TextTitle        textTitle
 *   TextDescription  textDescription
 *   Input            input
 *   Button           button
 *     Icon           icon
 *     TextLabel      textLabel
 *
 * @example
 * ```vue
 * <SectionSectionNewsletter
 *   aria-hidden="false"
 *   textTitle="Product Title"
 *   textDescription2="{}"
 *   input="{}"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"
import Button from "../elements/Button.vue"
import Icon from "../primitives/Icon.vue"
import Input from "../primitives/Input.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  textTitle?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  button?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "textTitle": {
    "children": "Stay Updated",
    "className": "sdn-text-title sdn-text-title--a5sd"
  },
  "textDescription": {
    "children": "Subscribe to our newsletter for the latest updates.",
    "className": "sdn-text-description sdn-text-description--tjnl"
  },
  "input": {
    "placeholder": "Enter your email",
    "type": "email",
    "className": "sdn-input sdn-input--rfy8"
  },
  "button": {
    "className": "sdn-button sdn-button--x8e4"
  },
  "icon": {
    "icon": "material-notifications",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--eyw9"
  },
  "textLabel": {
    "children": "Subscribe",
    "className": "sdn-text-label sdn-text-label--zk5o"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-section", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textTitleProps = computed(() => mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs))
const textDescriptionProps = computed(() => mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonProps = computed(() => mergeSlot(sdn.button, props.button, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
        <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
        <Input v-if="inputProps !== null" v-bind="inputProps" />
        <Button v-if="buttonProps !== null" v-bind="buttonProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        </Button>
      </slot>
    </div>
</template>
