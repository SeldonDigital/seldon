<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ButtonIconic from "../elements/ButtonIconic.vue"
import Icon from "../primitives/Icon.vue"
import Link from "../primitives/Link.vue"

const props = defineProps<{
  className?: string
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  link?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  link2?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  link3?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "role": "navigation",
  "aria-hidden": "false",
  "className": "sdn-bar",
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--pgsr"
  },
  "icon": {
    "icon": "seldon-component",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--rezm"
  },
  "icon2": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--ucf5"
  },
  "link": {
    "children": "Home",
    "aria-hidden": "false",
    "className": "sdn-link sdn-link--yqey"
  },
  "icon3": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--ucf5"
  },
  "link2": {
    "children": "Profile",
    "aria-hidden": "false",
    "className": "sdn-link sdn-link--yqey"
  },
  "icon4": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--ucf5"
  },
  "link3": {
    "children": "Settings",
    "aria-hidden": "false",
    "aria-current": "page",
    "className": "sdn-link sdn-link--yqey"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-bar", props.className))
const rootAttrs = { "role": sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const linkProps = computed(() => mergeSlot(sdn.link, props.link))
const icon3Props = computed(() => mergeSlot(sdn.icon3, props.icon3))
const link2Props = computed(() => mergeSlot(sdn.link2, props.link2))
const icon4Props = computed(() => mergeSlot(sdn.icon4, props.icon4))
const link3Props = computed(() => mergeSlot(sdn.link3, props.link3))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="iconProps" />
        <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
        <Link v-if="linkProps !== null" v-bind="linkProps" />
        <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
        <Link v-if="link2Props !== null" v-bind="link2Props" />
        <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
        <Link v-if="link3Props !== null" v-bind="link3Props" />
      </slot>
    </div>
</template>
