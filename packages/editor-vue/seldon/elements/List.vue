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
 * List: List
 * Level: Element
 * Intent: Displays a list of items. Renders as an unordered bulleted list or an ordered numbered list.
 * Tags: list, ul, ol, element, bulleted, numbered, sequence, text, UI
 * Type: Default
 *
 * @example
 * ```vue
 * <List
 *   htmlElement="ul"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ListItem from "../primitives/ListItem.vue"

const props = defineProps<{
  className?: string
  htmlElement?: unknown
  listItem?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "htmlElement": "ul",
  "aria-hidden": "false",
  "className": "sdn-list",
  "listItem": {
    "className": "sdn-list-item sdn-list-item--uvyv"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-list", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const listItemProps = computed(() => mergeSlot(sdn.listItem, props.listItem))
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>
        <ListItem v-if="listItem && listItemProps" v-bind="listItemProps" />
      </slot></component>
</template>
