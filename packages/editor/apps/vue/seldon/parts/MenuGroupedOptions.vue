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
 * Menu: MenuGroupedOptions
 * Level: Part
 * Intent: Floating list of actions anchored to a trigger.
 * Tags: menu, dropdown, actions, part, overlay, UI
 * Type: Inline
 *
 * Structure:
 *   Frame             frame
 *     TextLabel       textLabel
 *     MenuItemOption  menuItemOption
 *       Icon          icon
 *       TextLabel     textLabel2
 *       TextLabel     textLabel3
 *     MenuItemOption  menuItemOption2
 *       Icon          icon2
 *       TextLabel     textLabel4
 *       TextLabel     textLabel5
 *   Hr                hr
 *   Frame             frame2
 *     TextLabel       textLabel6
 *     MenuItemOption  menuItemOption3
 *       Icon          icon3
 *       TextLabel     textLabel7
 *       TextLabel     textLabel8
 *     MenuItemOption  menuItemOption4
 *       Icon          icon4
 *       TextLabel     textLabel9
 *       TextLabel     textLabel10
 *
 * @example
 * ```vue
 * <MenuGroupedOptions
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import MenuItemOption from "../elements/MenuItemOption.vue"
import Frame from "../frames/Frame.vue"
import Hr from "../primitives/Hr.vue"
import Icon from "../primitives/Icon.vue"
import TextLabel from "../primitives/TextLabel.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  menuItemOption?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  menuItemOption2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  hr?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  menuItemOption3?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  menuItemOption4?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "listbox",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel: {
    children: "Group A",
    className: "sdn-text-label sdn-text-label--oqkb",
  },
  menuItemOption: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel2: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel3: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption2: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel4: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel5: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--xtig",
  },
  frame2: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel6: {
    children: "Group B",
    className: "sdn-text-label sdn-text-label--oqkb",
  },
  menuItemOption3: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel7: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel8: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
  menuItemOption4: {
    className: "sdn-menu-item sdn-menu-item-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel9: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  textLabel10: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-menu-options", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const menuItemOptionProps = computed(() =>
  mergeOptionalSlot(sdn.menuItemOption, props.menuItemOption, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
const menuItemOption2Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemOption2, props.menuItemOption2, props.seldonRefs),
)
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const textLabel4Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs),
)
const textLabel5Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs),
)
const hrProps = computed(() => mergeSlot(sdn.hr, props.hr, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textLabel6Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs),
)
const menuItemOption3Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemOption3, props.menuItemOption3, props.seldonRefs),
)
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3, props.seldonRefs))
const textLabel7Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs),
)
const textLabel8Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs),
)
const menuItemOption4Props = computed(() =>
  mergeOptionalSlot(sdn.menuItemOption4, props.menuItemOption4, props.seldonRefs),
)
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4, props.seldonRefs))
const textLabel9Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs),
)
const textLabel10Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <MenuItemOption v-if="menuItemOptionProps !== null" v-bind="menuItemOptionProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </MenuItemOption>
        <MenuItemOption v-if="menuItemOption2Props !== null" v-bind="menuItemOption2Props">
          <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
          <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
          <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
        </MenuItemOption>
      </Frame>
      <Hr v-if="hrProps !== null" v-bind="hrProps" />
      <Frame v-bind="frame2Props">
        <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
        <MenuItemOption v-if="menuItemOption3Props !== null" v-bind="menuItemOption3Props">
          <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
          <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
          <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
        </MenuItemOption>
        <MenuItemOption v-if="menuItemOption4Props !== null" v-bind="menuItemOption4Props">
          <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
          <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
          <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
        </MenuItemOption>
      </Frame>
    </slot>
  </div>
</template>
