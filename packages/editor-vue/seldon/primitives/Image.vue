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
 * Image: Image
 * Level: Primitive
 * Intent: Renders an image asset within the UI, supporting alt text and sizing.
 * Tags: image, media, photo, UI, primitive, asset, visual
 * Type: Default
 *
 * @example
 * ```vue
 * <Image
 *   src="https://static.seldon.app/background-default-dark.jpg"
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
  src?: unknown
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "src": "https://static.seldon.app/background-default-dark.jpg",
  "aria-hidden": "false",
  "className": "sdn-image"
}

const rootClassName = computed(() => combineClassNames("sdn-image", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
</script>

<template>
    <img :class="rootClassName" :src="(props.src as string) ?? sdn.src" v-bind="rootAttrs" />
</template>
