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
    className: "sdn-menu-item-option sdn-menu-item-option--6dxl",
  },
  icon: {
    icon: "material-check",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel2: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--y8ur",
  },
  textLabel3: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--ni4j",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-menu", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const menuItemOptionProps = computed(() =>
  mergeOptionalSlot(sdn.menuItemOption, props.menuItemOption, props.seldonRefs),
)
const iconProps = computed(() => mergeOptionalSlot(sdn.icon, props.icon, props.seldonRefs))
const textLabel2Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs),
)
const textLabel3Props = computed(() =>
  mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs),
)
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs">
    <slot>
      <Frame v-bind="frameProps" v-if="frameProps !== null">
        <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
        <MenuItemOption v-if="menuItemOptionProps !== null" v-bind="menuItemOptionProps">
          <Icon v-if="iconProps !== null" v-bind="iconProps" />
          <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
          <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
        </MenuItemOption>
      </Frame>
    </slot>
  </div>
</template>
