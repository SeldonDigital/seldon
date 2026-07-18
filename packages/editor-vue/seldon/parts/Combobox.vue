<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ComboboxField from "../elements/ComboboxField.vue"
import Listbox from "../parts/Listbox.vue"

const props = defineProps<{
  className?: string
  comboboxField?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  listbox?: Record<string, unknown> | null
  listboxOption?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  listboxOption2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  listboxOption3?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-combobox",
  "comboboxField": {
    "aria-hidden": "false",
    "className": "sdn-combobox-field sdn-combobox-field--z3a0"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--xi68"
  },
  "input": {
    "placeholder": "Placeholder text",
    "type": "text",
    "role": "combobox",
    "aria-haspopup": "listbox",
    "className": "sdn-input sdn-input--yoqi"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon2": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--vsau"
  },
  "listbox": {
    "role": "listbox",
    "aria-hidden": "false",
    "className": "sdn-listbox sdn-listbox--4wpg"
  },
  "listboxOption": {
    "role": "option",
    "aria-hidden": "false",
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon3": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "listboxOption2": {
    "role": "option",
    "aria-hidden": "false",
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon4": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "listboxOption3": {
    "role": "option",
    "aria-hidden": "false",
    "className": "sdn-listbox-option sdn-listbox-option--6dxl"
  },
  "icon5": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-combobox", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const comboboxFieldProps = computed(() => mergeSlot(sdn.comboboxField, props.comboboxField))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const inputProps = computed(() => mergeSlot(sdn.input, props.input))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const listboxProps = computed(() => mergeSlot(sdn.listbox, props.listbox))
const listboxOptionProps = computed(() => mergeSlot(sdn.listboxOption, props.listboxOption))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const listboxOption2Props = computed(() => mergeSlot(sdn.listboxOption2, props.listboxOption2))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const listboxOption3Props = computed(() => mergeSlot(sdn.listboxOption3, props.listboxOption3))
const icon5Props = computed(() => mergeSlot(sdn.icon5, props.icon5))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ComboboxField v-if="comboboxFieldProps !== null" v-bind="comboboxFieldProps" :icon="iconProps" :input="inputProps" :buttonIconic="buttonIconicProps" :icon2="icon2Props" />
        <Listbox v-if="listboxProps !== null" v-bind="listboxProps" :listboxOption="listboxOptionProps" :icon="icon3Props" :textLabel="textLabel && textLabelProps" :listboxOption2="listboxOption2Props" :icon2="icon4Props" :textLabel2="textLabel2 && textLabel2Props" :listboxOption3="listboxOption3Props" :icon3="icon5Props" :textLabel3="textLabel3 && textLabel3Props" />
      </slot>
    </div>
</template>
