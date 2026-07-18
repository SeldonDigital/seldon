<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import TextDescription from "../primitives/TextDescription.vue"

const props = defineProps<{
  className?: string
  textDescription?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-message-user sdn-message",
  "textDescription": {
    "className": "sdn-text-description sdn-text-description--welb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-message-user", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textDescriptionProps = computed(() => mergeSlot(sdn.textDescription, props.textDescription))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextDescription v-if="textDescription && textDescriptionProps" v-bind="textDescriptionProps" />
      </slot>
    </div>
</template>
