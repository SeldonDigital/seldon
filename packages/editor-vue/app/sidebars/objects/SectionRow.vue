<script setup lang="ts">
import { computed } from "vue"
import { ComponentLevel } from "@seldon/core/components/constants"
import ItemSection from "@seldon/components/elements/ItemSection.vue"
import type { BoardSection } from "@seldon/editor/lib/sidebars/get-board-sections"
import { getVariantRootIds } from "@seldon/editor/lib/workspace/component-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import {
  useSectionExpansionStore,
  type ExpandableSection,
} from "@app/sidebars/section-expansion-store"
import { useObjectsExpansionStore } from "./objects-expansion-store"

const props = defineProps<{ section: BoardSection }>()

const panel = usePanelStore()
const tool = useToolStore()
const { addPlayground } = useAddRemoveCommands()
const sectionExpansion = useSectionExpansionStore()
const expansion = useObjectsExpansionStore()

const level = computed(() => props.section.level as ExpandableSection)
const isExpanded = computed(() =>
  sectionExpansion.isSectionExpanded(level.value),
)

// Media has no add flow; frames are not user-creatable boards.
const canAdd = computed(
  () => level.value !== "MEDIA" && level.value !== ComponentLevel.FRAME,
)

function onToggleWithSection(event: MouseEvent): void {
  event.stopPropagation()
  const shouldExpand = !isExpanded.value
  if (event.altKey) {
    const ids: string[] = []
    props.section.boards.forEach((board) => {
      ids.push(getComponentKey(board))
      getVariantRootIds(board).forEach((variantId) => {
        ids.push(variantId)
        ids.push(...expansion.getAllDescendantNodeIds(variantId))
      })
    })
    if (shouldExpand) expansion.expandObjects(ids)
    else expansion.collapseObjects(ids)
  }
  sectionExpansion.toggleSection(level.value, shouldExpand)
}

function onAdd(event: MouseEvent): void {
  event.stopPropagation()
  const sectionLevel = level.value
  if (sectionLevel === "THEME") panel.openPanel("add-theme")
  else if (sectionLevel === "FONT_COLLECTION") panel.openPanel("add-font-collection")
  else if (sectionLevel === "ICON_SET") panel.openPanel("add-icon-set")
  else if (sectionLevel === "PLAYGROUND") addPlayground()
  else panel.openPanel("add-board", { level: sectionLevel as ComponentLevel })
  tool.setActiveTool("select")
}

const toggleButton = computed(() => ({
  onClick: onToggleWithSection,
  "aria-expanded": isExpanded.value,
  "aria-label": isExpanded.value ? "Collapse" : "Expand",
}))
const toggleIcon = computed(() => ({
  icon: isExpanded.value ? "material-unfoldLess" : "material-unfoldMore",
}))
const labelProps = computed(() => ({ children: props.section.label }))
const addButton = computed(() =>
  canAdd.value ? { onClick: onAdd, "aria-label": "Add" } : null,
)
</script>

<template>
  <ItemSection
    class="objects-section"
    :button-iconic="toggleButton"
    :icon="toggleIcon"
    :form-control-combobox="{}"
    :text-label="labelProps"
    :button-iconic2="addButton"
    :button-iconic3="null"
    @click="onToggleWithSection"
  />
  <template v-if="isExpanded">
    <slot />
  </template>
</template>
