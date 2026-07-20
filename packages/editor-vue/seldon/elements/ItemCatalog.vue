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
 * Item: ItemCatalog
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
 *
 * @example
 * ```vue
 * <ItemCatalog
 *   aria-hidden="false"
 *   icon="material-star"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
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
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-item-catalog sdn-item",
  "icon": {
    "className": "sdn-icon sdn-icon--mene",
    "data-seldon-ref": "catalogIcon"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nhfs"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--noun",
    "data-seldon-ref": "catalogLabel"
  },
  "textSubtitle": {
    "className": "sdn-text-subtitle sdn-text-subtitle--r4ot",
    "data-seldon-ref": "catalogVariant"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-item-catalog", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const textSubtitleProps = computed(() => mergeSlot(sdn.textSubtitle, props.textSubtitle))
</script>

<template>
    <li :class="rootClassName" v-bind="rootAttrs" data-seldon-ref="catalogItem">
      <slot>
        <Icon v-if="icon && iconProps" v-bind="iconProps" />
        <Frame v-bind="frameProps">
          <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          <TextSubtitle v-if="textSubtitle && textSubtitleProps" v-bind="textSubtitleProps" />
        </Frame>
      </slot>
    </li>
</template>
