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
