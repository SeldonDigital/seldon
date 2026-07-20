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
 * Message: MessageOutcome
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * @example
 * ```vue
 * <MessageOutcome
 *   aria-hidden="false"
 *   frame="{}"
 *   icon="material-star"
 *   textLabel="{}"
 *   textDescription="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import TextDescription from "../primitives/TextDescription.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textDescription?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-message-outcome sdn-message",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ieew"
  },
  "icon": {
    "className": "sdn-icon sdn-icon--wxt9"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "textDescription": {
    "className": "sdn-text-description sdn-text-description--choa"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-message-outcome", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Icon v-if="icon && iconProps" v-bind="iconProps" />
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        </Frame>
        <TextDescription v-if="textDescription && textDescriptionProps" v-bind="textDescriptionProps" />
      </slot>
    </div>
</template>
