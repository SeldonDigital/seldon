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
 * Link: Link
 * Level: Primitive
 * Intent: A clickable link component that can be used for navigation, external links, or any clickable text. Supports various styling and accessibility options.
 * Tags: link, text, navigation, clickable, primitive, interactive
 * Type: Default
 *
 * @example
 * ```vue
 * <Link
 *   children="Link"
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
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "children": "Link",
  "aria-hidden": "false",
  "className": "sdn-link"
}

const rootClassName = computed(() => combineClassNames("sdn-link", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <a :class="rootClassName" v-bind="rootAttrs">{{ (props.children ?? sdn.children) }}</a>
</template>
