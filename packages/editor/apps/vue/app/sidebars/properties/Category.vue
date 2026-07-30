<script setup lang="ts">
import MenuController from "@app/menus/MenuController.vue"
import { useRowActionsMenu } from "@app/menus/use-row-actions-menu"
import ItemSection from "@seldon/components/elements/ItemSection.vue"
import { computed } from "vue"

import { useRowCategory } from "./hooks/use-row-category"

import type { PropertySection } from "./types"
import type { MenuEntry } from "@app/menus/types"

const props = defineProps<{
  section: PropertySection
  actions?: MenuEntry[]
  onAddCustom?: () => void
}>()

const section = computed(() => props.section)
const { isExpanded, onToggle, icon, label } = useRowCategory(section)

const actionsMenu = useRowActionsMenu(() => props.actions ?? [], { ariaLabel: "Section actions" })

const toggleButton = computed(() => ({
  onClick: onToggle,
  "aria-expanded": isExpanded.value,
  "aria-label": isExpanded.value ? "Collapse" : "Expand",
}))
const toggleIcon = computed(() => ({ icon: icon.value }))
const labelProps = computed(() => ({ children: label.value }))

const addButton = computed(() =>
  props.onAddCustom
    ? {
        onClick: (event: MouseEvent) => {
          event.stopPropagation()
          props.onAddCustom?.()
        },
        "aria-label": "Add custom token",
      }
    : null,
)

// Drive each slot through its stable workspace ref. Conditional slots keep a
// positional enabler to render (`{}` to show, `null` to hide); their data flows
// through `seldonRefs`. The trailing actions icon stays on the generated
// `seldon-more` default, so it needs no ref.
const seldonRefs = computed(() => ({
  sectionDisclosure: toggleButton.value,
  sectionDisclosureIcon: toggleIcon.value,
  sectionLabel: labelProps.value,
  sectionAdd: addButton.value ?? {},
  sectionActions: actionsMenu.buttonIconic.value,
}))

// Positional enablers: render each trailing slot only when it has content, so the
// add "+" sits flush right when a category has no actions. An empty actions
// placeholder would otherwise reserve width and push the "+" off the edge.
const addSlot = computed(() => (addButton.value ? {} : null))
const actionsSlot = computed(() => (actionsMenu.hasActions.value ? {} : null))
</script>

<template>
  <ItemSection
    class="properties-category"
    :seldon-refs="seldonRefs"
    :button-iconic="{}"
    :form-control-combobox="{}"
    :text-label="{}"
    :button-iconic2="addSlot"
    :button-iconic3="actionsSlot"
    @click="onToggle"
  />
  <MenuController
    v-if="actionsMenu.hasActions.value"
    :open="actionsMenu.open.value"
    :anchor="actionsMenu.anchor.value"
    :items="actionsMenu.menuItems.value"
    align="end"
    @close="actionsMenu.close"
  />
</template>
