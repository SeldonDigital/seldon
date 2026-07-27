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
 * Message: MessageAssistant
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * Structure:
 *   TextDescription  textDescription
 *
 * @example
 * ```vue
 * <MessageAssistant
 *   aria-hidden="false"
 *   textDescription="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"
import TextDescription from "../primitives/TextDescription.vue"

const props = defineProps<{
  className?: string
  textDescription?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "textDescription": {
    "className": "sdn-text-description sdn-text-description--welb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-message-assistant", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textDescriptionProps = computed(() => mergeOptionalSlot(sdn.textDescription, props.textDescription, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextDescription v-if="textDescriptionProps !== null" v-bind="textDescriptionProps" />
      </slot>
    </div>
</template>
