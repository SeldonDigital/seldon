<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import ListItem from "../primitives/ListItem.vue"

const props = defineProps<{
  className?: string
  htmlElement?: unknown
  listItem?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "htmlElement": "ul",
  "aria-hidden": "false",
  "className": "sdn-list",
  "listItem": {
    "className": "sdn-list-item sdn-list-item--uvyv"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-list", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const listItemProps = computed(() => mergeSlot(sdn.listItem, props.listItem))
</script>

<template>
    <component :is="(props.htmlElement as string) ?? sdn.htmlElement ?? 'div'" :class="rootClassName" v-bind="rootAttrs"><slot>
        <ListItem v-if="listItem && listItemProps" v-bind="listItemProps" />
      </slot></component>
</template>
