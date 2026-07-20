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
 * Text: TextTagline
 * Level: Primitive
 * Intent: Base text component for general-purpose inline content.
 * Tags: text, inline, paragraph, primitive, typography, UI
 * Type: Custom
 *
 * @example
 * ```vue
 * <TextTagline
 *   children="Tagline"
 *   htmlElement="p"
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
  "children": "Tagline",
  "htmlElement": "p",
  "aria-hidden": "false",
  "className": "sdn-text-tagline sdn-text"
}

const rootClassName = computed(() => combineClassNames("sdn-text-tagline", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>{{ (props.children ?? sdn.children) }}</slot></component>
</template>
