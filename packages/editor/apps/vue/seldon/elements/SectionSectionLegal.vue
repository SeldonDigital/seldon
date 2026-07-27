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
 * Section: SectionLegal
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * @example
 * ```vue
 * <SectionSectionLegal
 *   aria-hidden="false"
 *   link="{}"
 *   link2="{}"
 *   link3="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Link from "../primitives/Link.vue"

const props = defineProps<{
  className?: string
  link?: Record<string, unknown> | null
  link2?: Record<string, unknown> | null
  link3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-section",
  "link": {
    "children": "Privacy Policy",
    "aria-hidden": "false",
    "className": "sdn-link sdn-link--bvcm"
  },
  "link2": {
    "children": "Terms of Service",
    "aria-hidden": "false",
    "className": "sdn-link sdn-link--bvcm"
  },
  "link3": {
    "children": "Cookie Policy",
    "aria-hidden": "false",
    "className": "sdn-link sdn-link--bvcm"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-section", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const linkProps = computed(() => mergeSlot(sdn.link, props.link))
const link2Props = computed(() => mergeSlot(sdn.link2, props.link2))
const link3Props = computed(() => mergeSlot(sdn.link3, props.link3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Link v-if="linkProps !== null" v-bind="linkProps" />
        <Link v-if="link2Props !== null" v-bind="link2Props" />
        <Link v-if="link3Props !== null" v-bind="link3Props" />
      </slot>
    </div>
</template>
