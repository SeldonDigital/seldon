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
 * Bar: BarTopbar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * @example
 * ```vue
 * <BarTopbar
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonMenu from "../elements/ButtonMenu.vue"
import ButtonSimple from "../elements/ButtonSimple.vue"
import Icon from "../primitives/Icon.vue"
import Image from "../primitives/Image.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  image?: Record<string, unknown> | null
  image2?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  buttonSimple?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonSimple2?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  buttonSimple3?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  buttonSimple4?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  buttonSimple5?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  buttonSimple6?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  buttonMenu?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonMenu2?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "role": "menubar",
  "aria-hidden": "false",
  "className": "sdn-bar-topbar sdn-bar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--33uo"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--ajnq",
    "data-seldon-ref": "logo"
  },
  "image": {
    "className": "sdn-image sdn-image--33xp"
  },
  "image2": {
    "className": "sdn-image sdn-image--dnok"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--drsa",
    "data-seldon-ref": "menus"
  },
  "buttonSimple": {
    "className": "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuFile"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "buttonSimple2": {
    "className": "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuEdit"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "buttonSimple3": {
    "className": "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuComponent"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "buttonSimple4": {
    "className": "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuView"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "buttonSimple5": {
    "className": "sdn-button-simple sdn-button-simple--dbgs"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "buttonSimple6": {
    "className": "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuDev"
  },
  "textLabel6": {
    "className": "sdn-text-label sdn-text-label--lbxv"
  },
  "frame4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--nzij"
  },
  "buttonMenu": {
    "className": "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "menuTheme"
  },
  "textLabel7": {
    "className": "sdn-text-label sdn-text-label--sa6t"
  },
  "icon": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--y2ct"
  },
  "buttonMenu2": {
    "className": "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "menuMode"
  },
  "textLabel8": {
    "className": "sdn-text-label sdn-text-label--sa6t"
  },
  "icon2": {
    "icon": "material-chevronDown",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--y2ct"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar-topbar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const imageProps = computed(() => mergeSlot(sdn.image, props.image))
const image2Props = computed(() => mergeSlot(sdn.image2, props.image2))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const buttonSimpleProps = computed(() => mergeSlot(sdn.buttonSimple, props.buttonSimple))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const buttonSimple2Props = computed(() => mergeSlot(sdn.buttonSimple2, props.buttonSimple2))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const buttonSimple3Props = computed(() => mergeSlot(sdn.buttonSimple3, props.buttonSimple3))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const buttonSimple4Props = computed(() => mergeSlot(sdn.buttonSimple4, props.buttonSimple4))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const buttonSimple5Props = computed(() => mergeSlot(sdn.buttonSimple5, props.buttonSimple5))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const buttonSimple6Props = computed(() => mergeSlot(sdn.buttonSimple6, props.buttonSimple6))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4))
const buttonMenuProps = computed(() => mergeSlot(sdn.buttonMenu, props.buttonMenu))
const textLabel7Props = computed(() => mergeSlot(sdn.textLabel7, props.textLabel7))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonMenu2Props = computed(() => mergeSlot(sdn.buttonMenu2, props.buttonMenu2))
const textLabel8Props = computed(() => mergeSlot(sdn.textLabel8, props.textLabel8))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps" v-if="frame">
          <Frame v-bind="frame2Props" v-if="frame2">
            <Image v-if="image && imageProps" v-bind="imageProps" />
            <Image v-if="image2 && image2Props" v-bind="image2Props" />
          </Frame>
          <Frame v-bind="frame3Props" v-if="frame3">
            <ButtonSimple v-if="buttonSimple && buttonSimpleProps" v-bind="buttonSimpleProps">
              <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
            </ButtonSimple>
            <ButtonSimple v-if="buttonSimple2 && buttonSimple2Props" v-bind="buttonSimple2Props">
              <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
            </ButtonSimple>
            <ButtonSimple v-if="buttonSimple3 && buttonSimple3Props" v-bind="buttonSimple3Props">
              <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
            </ButtonSimple>
            <ButtonSimple v-if="buttonSimple4 && buttonSimple4Props" v-bind="buttonSimple4Props">
              <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
            </ButtonSimple>
            <ButtonSimple v-if="buttonSimple5 && buttonSimple5Props" v-bind="buttonSimple5Props">
              <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
            </ButtonSimple>
            <ButtonSimple v-if="buttonSimple6 && buttonSimple6Props" v-bind="buttonSimple6Props">
              <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
            </ButtonSimple>
          </Frame>
        </Frame>
        <Frame v-bind="frame4Props" v-if="frame4">
          <ButtonMenu v-if="buttonMenu && buttonMenuProps" v-bind="buttonMenuProps">
            <TextLabel v-if="textLabel7 && textLabel7Props" v-bind="textLabel7Props" />
            <Icon v-if="iconProps !== null" v-bind="iconProps" />
          </ButtonMenu>
          <ButtonMenu v-if="buttonMenu2 && buttonMenu2Props" v-bind="buttonMenu2Props">
            <TextLabel v-if="textLabel8 && textLabel8Props" v-bind="textLabel8Props" />
            <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          </ButtonMenu>
        </Frame>
      </slot>
    </div>
</template>
