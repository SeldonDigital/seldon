<script setup lang="ts">
import { computed } from "vue"
import ItemSection from "@seldon/components/elements/ItemSection.vue"
import MenuController from "@app/menus/MenuController.vue"
import { useRowActionsMenu } from "@app/menus/use-row-actions-menu"
import type { MenuEntry } from "@app/menus/types"
import { useRowCategory } from "./hooks/use-row-category"
import type { PropertySection } from "./types"

const props = defineProps<{
  section: PropertySection
  actions?: MenuEntry[]
  onAddCustom?: () => void
}>()

const section = computed(() => props.section)
const { isExpanded, onToggle, icon, label } = useRowCategory(section)

const actionsMenu = useRowActionsMenu(
  () => props.actions ?? [],
  { ariaLabel: "Section actions" },
)

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
</script>

<template>
  <ItemSection
    class="properties-category"
    :button-iconic="toggleButton"
    :icon="toggleIcon"
    :form-control-combobox="{}"
    :text-label="labelProps"
    :button-iconic2="addButton"
    :button-iconic3="actionsMenu.hasActions.value ? actionsMenu.buttonIconic.value : null"
    :icon3="actionsMenu.hasActions.value ? actionsMenu.icon.value : undefined"
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
