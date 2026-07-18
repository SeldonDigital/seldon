<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import Icon from "../primitives/Icon.vue"
import MenuItemRadio from "../elements/MenuItemRadio.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  textLabel?: Record<string, unknown> | null
  frame?: Record<string, unknown> | null
  menuItemRadio?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  menuItemRadio2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-form-control",
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--fwkw"
  },
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--pgac"
  },
  "menuItemRadio": {
    "className": "sdn-menu-item sdn-menu-item-radio--mezf"
  },
  "icon": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--xohb"
  },
  "menuItemRadio2": {
    "className": "sdn-menu-item sdn-menu-item-radio--mezf"
  },
  "icon2": {
    "icon": "material-radioButtonChecked",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--3qou"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--xohb"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-form-control", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const menuItemRadioProps = computed(() => mergeSlot(sdn.menuItemRadio, props.menuItemRadio))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const menuItemRadio2Props = computed(() => mergeSlot(sdn.menuItemRadio2, props.menuItemRadio2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
        <Frame v-bind="frameProps" v-if="frame">
          <MenuItemRadio v-if="menuItemRadio && menuItemRadioProps" v-bind="menuItemRadioProps">
            <Icon v-if="icon && iconProps" v-bind="iconProps" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          </MenuItemRadio>
          <MenuItemRadio v-if="menuItemRadio2 && menuItemRadio2Props" v-bind="menuItemRadio2Props">
            <Icon v-if="icon2 && icon2Props" v-bind="icon2Props" />
            <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          </MenuItemRadio>
        </Frame>
      </slot>
    </div>
</template>
