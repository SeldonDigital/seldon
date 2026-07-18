<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Input from "../primitives/Input.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-form-control",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--fwkw"
  },
  "input": {
    "placeholder": "Placeholder text",
    "type": "text",
    "className": "sdn-input sdn-input--8ux3"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Input v-if="inputProps !== null" v-bind="inputProps" />
      </slot>
    </div>
</template>
