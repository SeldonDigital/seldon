/***** * * This code was generated using Seldon (https://github.com/SeldonDigital/seldon) * *
License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md * Do not redistribute or
sublicense without permission. * * You may not use this software, or any derivative works of it, in
whole or in part, * for the purposes of training, fine-tuning, or otherwise improving (directly or
indirectly) * any machine learning or artificial intelligence system without written permission. *
*****/

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

/**
 * Bar: BarTopbar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * Structure:
 *   Frame             frame
 *     Frame           frame2         -> logo
 *       Image         image          -> logoMark
 *       Image         image2         -> logoWordmark
 *     Frame           frame3         -> menus
 *       ButtonSimple  buttonSimple   -> menuFile
 *         TextLabel   textLabel      -> menuFileLabel
 *       ButtonSimple  buttonSimple2  -> menuEdit
 *         TextLabel   textLabel2     -> menuEditLabel
 *       ButtonSimple  buttonSimple3  -> menuView
 *         TextLabel   textLabel3     -> menuViewLabel
 *       ButtonSimple  buttonSimple4  -> menuComponent
 *         TextLabel   textLabel4     -> menuComponentLabel
 *       ButtonSimple  buttonSimple5  -> menuHari
 *         TextLabel   textLabel5     -> menuHariLabel
 *       ButtonSimple  buttonSimple6  -> menuWindow
 *         TextLabel   textLabel6     -> menuWindowLabel
 *       ButtonSimple  buttonSimple7  -> menuDev
 *         TextLabel   textLabel7     -> menuDevLabel
 *   Frame             frame4
 *
 * @example
 * ```vue
 * <BarTopbar
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonSimple from "../elements/ButtonSimple.vue"
import Frame from "../frames/Frame.vue"
import Image from "../primitives/Image.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

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
  buttonSimple7?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "menubar",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--33uo",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ajnq",
    "data-seldon-ref": "logo",
  },
  image: {
    className: "sdn-image sdn-image--33xp",
    "data-seldon-ref": "logoMark",
  },
  image2: {
    className: "sdn-image sdn-image--dnok",
    "data-seldon-ref": "logoWordmark",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--drsa",
    "data-seldon-ref": "menus",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuFile",
  },
  textLabel: {
    children: "File",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuFileLabel",
  },
  buttonSimple2: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuEdit",
  },
  textLabel2: {
    children: "Edit",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuEditLabel",
  },
  buttonSimple3: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuView",
  },
  textLabel3: {
    children: "View",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuViewLabel",
  },
  buttonSimple4: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuComponent",
  },
  textLabel4: {
    children: "Component",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuComponentLabel",
  },
  buttonSimple5: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuHari",
  },
  textLabel5: {
    children: "Hari",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuHariLabel",
  },
  buttonSimple6: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuWindow",
  },
  textLabel6: {
    children: "Window",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuWindowLabel",
  },
  buttonSimple7: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuDev",
  },
  textLabel7: {
    children: "Dev",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "menuDevLabel",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-bar-topbar", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const imageProps = computed(() => mergeOptionalSlot(sdn.image, props.image, props.seldonRefs))
const image2Props = computed(() => mergeOptionalSlot(sdn.image2, props.image2, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const buttonSimpleProps = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple, props.buttonSimple, props.seldonRefs),
)
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const buttonSimple2Props = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple2, props.buttonSimple2, props.seldonRefs),
)
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const buttonSimple3Props = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple3, props.buttonSimple3, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const buttonSimple4Props = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple4, props.buttonSimple4, props.seldonRefs),
)
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const buttonSimple5Props = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple5, props.buttonSimple5, props.seldonRefs),
)
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const buttonSimple6Props = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple6, props.buttonSimple6, props.seldonRefs),
)
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const buttonSimple7Props = computed(() =>
  mergeOptionalSlot(sdn.buttonSimple7, props.buttonSimple7, props.seldonRefs),
)
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps" v-if="frameProps !== null">
        <Frame v-bind="frame2Props" v-if="frame2Props !== null">
          <Image v-if="imageProps !== null" v-bind="imageProps" />
          <Image v-if="image2Props !== null" v-bind="image2Props" />
        </Frame>
        <Frame v-bind="frame3Props" v-if="frame3Props !== null">
          <ButtonSimple v-if="buttonSimpleProps !== null" v-bind="buttonSimpleProps">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          </ButtonSimple>
          <ButtonSimple v-if="buttonSimple2Props !== null" v-bind="buttonSimple2Props">
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          </ButtonSimple>
          <ButtonSimple v-if="buttonSimple3Props !== null" v-bind="buttonSimple3Props">
            <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
          </ButtonSimple>
          <ButtonSimple v-if="buttonSimple4Props !== null" v-bind="buttonSimple4Props">
            <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          </ButtonSimple>
          <ButtonSimple v-if="buttonSimple5Props !== null" v-bind="buttonSimple5Props">
            <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
          </ButtonSimple>
          <ButtonSimple v-if="buttonSimple6Props !== null" v-bind="buttonSimple6Props">
            <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
          </ButtonSimple>
          <ButtonSimple v-if="buttonSimple7Props !== null" v-bind="buttonSimple7Props">
            <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
          </ButtonSimple>
        </Frame>
      </Frame>
      <Frame v-bind="frame4Props" v-if="frame4Props !== null"> </Frame>
    </slot>
  </div>
</template>
