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
 * Message: MessageRefController
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * Structure:
 *   Text  text   -> refCardControllerName
 *   Text  text2  -> refCardControllerPath
 *   Text  text3  -> refCardControllerPass
 *   Text  text4  -> refCardControllerFrom
 *   Hr    hr
 *
 * @example
 * ```vue
 * <MessageRefController
 *   aria-hidden="false"
 *   text="{}"
 *   text2="{}"
 *   text3="{}"
 *   text4="{}"
 *   hr="{}"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import Hr from "../primitives/Hr.vue"
import Text from "../primitives/Text.vue"
import { combineClassNames, mergeOptionalSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  text?: Record<string, unknown> | null
  text2?: Record<string, unknown> | null
  text3?: Record<string, unknown> | null
  text4?: Record<string, unknown> | null
  hr?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  text: {
    children: "ImageUploadDialog",
    className: "sdn-text sdn-text--ydup",
    "data-seldon-ref": "refCardControllerName",
  },
  text2: {
    children: "app/dialogs/image-upload/ImageUploadController.tsx:129",
    className: "sdn-text sdn-text--55ws",
    "data-seldon-ref": "refCardControllerPath",
  },
  text3: {
    children: "{ onClick: onSave }",
    className: "sdn-text sdn-text--y6np",
    "data-seldon-ref": "refCardControllerPass",
  },
  text4: {
    children: "onSave (parameter, line 169)",
    className: "sdn-text sdn-text--ir92",
    "data-seldon-ref": "refCardControllerFrom",
  },
  hr: {
    className: "sdn-hr sdn-hr--e6dj",
  },
}

const rootClassName = computed(() =>
  combineClassNames("sdn-message-ref-controller", props.className),
)
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textProps = computed(() => mergeOptionalSlot(sdn.text, props.text, props.seldonRefs))
const text2Props = computed(() => mergeOptionalSlot(sdn.text2, props.text2, props.seldonRefs))
const text3Props = computed(() => mergeOptionalSlot(sdn.text3, props.text3, props.seldonRefs))
const text4Props = computed(() => mergeOptionalSlot(sdn.text4, props.text4, props.seldonRefs))
const hrProps = computed(() => mergeOptionalSlot(sdn.hr, props.hr, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs" data-seldon-ref="refCardControllerItem">
    <slot>
      <Text v-if="textProps !== null" v-bind="textProps" />
      <Text v-if="text2Props !== null" v-bind="text2Props" />
      <Text v-if="text3Props !== null" v-bind="text3Props" />
      <Text v-if="text4Props !== null" v-bind="text4Props" />
      <Hr v-if="hrProps !== null" v-bind="hrProps" />
    </slot>
  </div>
</template>
