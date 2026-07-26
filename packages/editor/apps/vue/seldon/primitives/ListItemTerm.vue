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
 * List Item: Term
 * Level: Primitive
 * Intent: Text item inside a list. Renders as li in ordered and unordered lists, or as dt and dd in description lists.
 * Tags: list text, li, dt, dd, list item, description, primitive, text
 * Type: Custom
 *
 * @example
 * ```vue
 * <ListItemTerm
 *   children="Term"
 *   htmlElement="dt"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames } from "../utils/class-names"

const props = defineProps<{
  className?: string
  children?: unknown
  htmlElement?: unknown
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "children": "Term",
  "htmlElement": "dt",
  "aria-hidden": "false",
  "className": "sdn-list-item-term sdn-list-item"
}

const rootClassName = computed(() => combineClassNames("sdn-list-item-term", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>{{ (props.children ?? sdn.children) }}</slot></component>
</template>
