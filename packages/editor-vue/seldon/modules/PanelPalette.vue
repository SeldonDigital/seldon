<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Bar from "../parts/Bar.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  bar?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "role": "dialog",
  "aria-hidden": "false",
  "className": "sdn-panel-palette sdn-panel",
  "bar": {
    "aria-hidden": "false",
    "className": "sdn-bar sdn-bar--9xs7"
  },
  "textTitle": {
    "className": "sdn-text-title sdn-text-title--ulid"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--88jo"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-panel-palette", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const barProps = computed(() => mergeSlot(sdn.bar, props.bar))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Bar v-if="barProps !== null" v-bind="barProps">
          <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
        </Bar>
        <Frame v-bind="frameProps">
        </Frame>
      </slot>
    </div>
</template>
