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
 * Message: MessageThinking
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     ButtonIconic     buttonIconic      -> hariReasoningToggle
 *       Icon           icon              -> hariReasoningChevron
 *     TextDescription  textDescription   -> hariReasoningLabel
 *     TextDescription  textDescription2  -> hariReasoningClamped
 *   TextDescription    textDescription3  -> hariReasoningBody
 *
 * @example
 * ```vue
 * <MessageThinking
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textDescription="{}"
 *   textDescription2="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import Frame from "../frames/Frame.vue"
import TextDescription from "../primitives/TextDescription.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  textDescription2?: Record<string, unknown> | null
  textDescription3?: Record<string, unknown> | null
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
    className: "sdn-frame sdn-frame--ieew",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--iklu",
    "data-seldon-ref": "hariReasoningToggle",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kzy9",
    "data-seldon-ref": "hariReasoningChevron",
  },
  textDescription: {
    children: "Thinking...",
    className: "sdn-text-description sdn-text-description--0r1j",
    "data-seldon-ref": "hariReasoningLabel",
  },
  textDescription2: {
    children: "Clamped",
    className: "sdn-text-description sdn-text-description--aeeo",
    "data-seldon-ref": "hariReasoningClamped",
  },
  textDescription3: {
    children: "Reasoning...",
    className: "sdn-text-description sdn-text-description--choa",
    "data-seldon-ref": "hariReasoningBody",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-message-thinking", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textDescriptionProps = computed(() =>
  mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs),
)
const textDescription2Props = computed(() =>
  mergeOptionalSlot(sdn.textDescription2, props.textDescription2, props.seldonRefs),
)
const textDescription3Props = computed(() =>
  mergeOptionalSlot(sdn.textDescription3, props.textDescription3, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <ButtonIconic
          v-if="buttonIconicProps !== null"
          v-bind="buttonIconicProps"
          :icon="iconProps"
        />
        <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
        <TextDescription v-if="textDescription2Props !== null" v-bind="textDescription2Props" />
      </Frame>
      <TextDescription v-if="textDescription3Props !== null" v-bind="textDescription3Props" />
    </slot>
  </div>
</template>
