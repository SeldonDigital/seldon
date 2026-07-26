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
 * Avatar: AvatarRounded
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * @example
 * ```vue
 * <AvatarRounded
 *   aria-hidden="false"
 *   image="/image.jpg"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Image from "../primitives/Image.vue"

const props = defineProps<{
  className?: string
  image?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-avatar",
  "image": {
    "src": "/avatar-user.png",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--zjyq"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-avatar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Image v-if="imageProps !== null" v-bind="imageProps" />
      </slot>
    </div>
</template>
