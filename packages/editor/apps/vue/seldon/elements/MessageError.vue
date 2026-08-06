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
 * Message: MessageError
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     Icon             icon             -> hariErrorIcon
 *     TextDescription  textDescription  -> hariErrorText
 *   ButtonSimple       buttonSimple     -> hariErrorRetry
 *     TextLabel        textLabel        -> hariErrorRetryLabel
 *
 * @example
 * ```vue
 * <MessageError
 *   aria-hidden="false"
 *   frame="{}"
 *   icon="material-star"
 *   textDescription="{}"
 *   buttonSimple={() => {}}
 *   textLabel="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonSimple from "../elements/ButtonSimple.vue"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
  buttonSimple?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
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
  icon: {
    icon: "material-error",
    className: "sdn-icon sdn-icon--gm8j",
    "data-seldon-ref": "hariErrorIcon",
  },
  textDescription: {
    children: "Something went wrong",
    className: "sdn-text-description sdn-text-label--xohb",
    "data-seldon-ref": "hariErrorText",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-iconic--iklu",
    "data-seldon-ref": "hariErrorRetry",
  },
  textLabel: {
    children: "Retry",
    className: "sdn-text-label sdn-text-label--aftu",
    "data-seldon-ref": "hariErrorRetryLabel",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-message-error", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const textDescriptionProps = computed(() =>
  mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs),
)
const buttonSimpleProps = computed(() =>
  mergeSlot(sdn.buttonSimple, props.buttonSimple, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <Icon v-if="iconProps !== null" v-bind="iconProps" />
        <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
      </Frame>
      <ButtonSimple v-if="buttonSimpleProps !== null" v-bind="buttonSimpleProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
      </ButtonSimple>
    </slot>
  </div>
</template>
