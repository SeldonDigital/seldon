<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonMenu from "../elements/ButtonMenu.vue"
import ComboboxFieldFilter from "../elements/ComboboxFieldFilter.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  comboboxFieldFilter?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "role": "complementary",
  "aria-hidden": "false",
  "className": "sdn-sidebar-objects sdn-sidebar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--uief"
  },
  "comboboxFieldFilter": {
    "className": "sdn-combobox-field sdn-combobox-field-project--rzdy"
  },
  "icon": {
    "icon": "material-filterList",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "input": {
    "placeholder": "Filter...",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--twyx",
    "data-seldon-ref": "propertyFilter"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyFilterClear"
  },
  "icon2": {
    "icon": "material-close",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "buttonMenu": {
    "className": "sdn-button-menu sdn-button-menu--t1a2",
    "data-seldon-ref": "menuState"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--sa6t"
  },
  "icon3": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--y2ct"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--evmw",
    "data-seldon-ref": "propertiesContainer"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-sidebar-objects", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const comboboxFieldFilterProps = computed(() => mergeSlot(sdn.comboboxFieldFilter, props.comboboxFieldFilter))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const buttonMenuProps = computed(() => mergeSlot(sdn.buttonMenu, props.buttonMenu))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <ComboboxFieldFilter v-if="comboboxFieldFilter && comboboxFieldFilterProps" v-bind="comboboxFieldFilterProps" :icon="iconProps" :input="inputProps" :buttonIconic="buttonIconicProps" :icon2="icon2Props" />
          <ButtonMenu v-if="buttonMenu && buttonMenuProps" v-bind="buttonMenuProps">
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
            <Icon v-if="icon3 && icon3Props" v-bind="icon3Props" />
          </ButtonMenu>
        </Frame>
        <Frame v-bind="frame2Props" v-if="frame2">
        </Frame>
      </slot>
    </div>
</template>
