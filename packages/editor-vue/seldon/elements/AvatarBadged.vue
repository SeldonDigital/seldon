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
 * Avatar: AvatarBadged
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * @example
 * ```vue
 * <AvatarBadged
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   chip="{}"
 *   text="{}"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Chip from "../elements/Chip.vue"
import Image from "../primitives/Image.vue"
import Text from "../primitives/Text.vue"

const props = defineProps<{
  className?: string
  image?: Record<string, unknown> | null
  chip?: Record<string, unknown> | null
  text?: Record<string, unknown> | null
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
  "chip": {
    "aria-hidden": "false",
    "className": "sdn-chip sdn-chip--3r55"
  },
  "text": {
    "className": "sdn-text sdn-text--0zmi"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-avatar-badged", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const chipProps = computed(() => mergeSlot(sdn.chip, props.chip))
const textProps = computed(() => mergeSlot(sdn.text, props.text))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Image v-if="imageProps !== null" v-bind="imageProps" />
        <Chip v-if="chipProps !== null" v-bind="chipProps">
          <Text v-if="text && textProps" v-bind="textProps" />
        </Chip>
      </slot>
    </div>
</template>
