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
