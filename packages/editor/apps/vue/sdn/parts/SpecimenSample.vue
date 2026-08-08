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
 * Part: SpecimenSample
 * Level: Part
 * Intent: Various samples and pieces for building specimen components
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   Frame                frame             -> typeSpecimenPreview
 *     Frame              frame2            -> typeSpecimenFamily
 *       TextLabel        textLabel         -> typeSpecimenFamilyLabel
 *       TextLabel        textLabel2        -> typeSpecimenFamilyWeights
 *     Frame              frame3            -> typeSpecimenGlyphs
 *       TextDescription  textDescription   -> typeSpecimenName
 *       TextDescription  textDescription2  -> typeSpecimenUppercase
 *       TextDescription  textDescription3  -> typeSpecimenLowercase
 *       TextDescription  textDescription4  -> typeSpecimenNumbers
 *   Hr                   hr
 *
 * @example
 * ```vue
 * <SpecimenSample
 *   aria-hidden="false"
 *   frame="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   frame2="{}"
 *   textDescription="{}"
 *   textDescription2="{}"
 *   textDescription3="{}"
 *   textDescription4="{}"
 *   hr="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Frame from "../frames/Frame.vue"
import Hr from "../primitives/Hr.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  textDescription2?: Record<string, unknown> | null
  textDescription3?: Record<string, unknown> | null
  textDescription4?: Record<string, unknown> | null
  hr?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--uqd5",
    "data-seldon-ref": "typeSpecimenPreview",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--vxea",
    "data-seldon-ref": "typeSpecimenFamily",
  },
  textLabel: {
    children: "Font Family",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--t17u",
    "data-seldon-ref": "typeSpecimenFamilyLabel",
  },
  textLabel2: {
    children:
      "100, 200, 300, 400, 500, 600, 700, 100 Italic, 200 Italic, 300 Italic, 400 Italic, 500 Italic, 600 Italic, 700 Italic",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s2lk",
    "data-seldon-ref": "typeSpecimenFamilyWeights",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--kpqc",
    "data-seldon-ref": "typeSpecimenGlyphs",
  },
  textDescription: {
    children: "IBM Plex San",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--tnd9",
    "data-seldon-ref": "typeSpecimenName",
  },
  textDescription2: {
    children: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--i3zd",
    "data-seldon-ref": "typeSpecimenUppercase",
  },
  textDescription3: {
    children: "abcdefghijklmnopqrstuvwxyz",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--i3zd",
    "data-seldon-ref": "typeSpecimenLowercase",
  },
  textDescription4: {
    children: "0123456789 ¿ ? ¡ ! & @ ‘ ’ “ ” « » % * ^ # $ £ € ¢ / ( ) [ ] { } . , ® ©",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--i3zd",
    "data-seldon-ref": "typeSpecimenNumbers",
  },
  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--p83j",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-specimen", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const textDescriptionProps = computed(() =>
  mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs),
)
const textDescription2Props = computed(() =>
  mergeOptionalSlot(sdn.textDescription2, props.textDescription2, props.seldonRefs),
)
const textDescription3Props = computed(() =>
  mergeOptionalSlot(sdn.textDescription3, props.textDescription3, props.seldonRefs),
)
const textDescription4Props = computed(() =>
  mergeOptionalSlot(sdn.textDescription4, props.textDescription4, props.seldonRefs),
)
const hrProps = computed(() => mergeSlot(sdn.hr, props.hr, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
          <TextDescription v-if="textDescription2Props !== null" v-bind="textDescription2Props" />
          <TextDescription v-if="textDescription3Props !== null" v-bind="textDescription3Props" />
          <TextDescription v-if="textDescription4Props !== null" v-bind="textDescription4Props" />
        </Frame>
      </Frame>
      <Hr v-if="hrProps !== null" v-bind="hrProps" />
    </slot>
  </div>
</template>
