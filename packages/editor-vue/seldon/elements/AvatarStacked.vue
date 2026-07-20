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
 * Avatar: AvatarStacked
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * @example
 * ```vue
 * <AvatarStacked
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   image2="/image.jpg"
 *   image3="/image.jpg"
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
  image2?: Record<string, unknown> | null
  image3?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-avatar-badged sdn-avatar",
  "image": {
    "src": "/avatar-user.png",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--zjyq"
  },
  "image2": {
    "src": "/avatar-user.png",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--yscg"
  },
  "image3": {
    "src": "/avatar-user.png",
    "aria-hidden": "false",
    "className": "sdn-image sdn-image--hzdf"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-avatar-badged", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2))
const image3Props = computed(() => mergeSlot(sdn.image3, props.image3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Image v-if="imageProps !== null" v-bind="imageProps" />
        <Image v-if="image2Props !== null" v-bind="image2Props" />
        <Image v-if="image3Props !== null" v-bind="image3Props" />
      </slot>
    </div>
</template>
