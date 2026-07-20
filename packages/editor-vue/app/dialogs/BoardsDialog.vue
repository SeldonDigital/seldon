<script setup lang="ts">
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import type { ComponentSchema } from "@seldon/core/components/types"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import {
  useCatalogDialog,
  type CatalogItem,
} from "@app/dialogs/use-catalog-dialog"
import PanelDialogController from "@app/dialogs/PanelDialogController.vue"
import { usePanelStore } from "@app/editor/panel-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"

const panel = usePanelStore()
const { activePanel, dialogLevel } = storeToRefs(panel)
const { addBoard } = useAddRemoveCommands()
const { workspace } = useWorkspace()

const isOpen = computed(() => activePanel.value === "add-board")

function shouldShow(schema: ComponentSchema): boolean {
  if (schema.level === ComponentLevel.BOARD) return false
  if (schema.id === ComponentId.SANDBOX) return false
  if (dialogLevel.value) {
    if (schema.level !== dialogLevel.value) return false
  } else if (schema.level === ComponentLevel.FRAME) {
    return false
  }
  return !workspace.value.boards[schema.id]
}

const { categories, query } = useCatalogDialog(shouldShow)

watch(isOpen, (open) => {
  if (open) query.value = ""
})

function setQuery(next: string): void {
  query.value = next
}

async function pick(item: CatalogItem): Promise<void> {
  await addBoard(item.componentId as ComponentId)
}

function close(): void {
  panel.closePanel()
}
</script>

<template>
  <PanelDialogController
    v-if="isOpen"
    title="Add component"
    confirm-button-text="Add component"
    :categories="categories"
    :query="query"
    :on-query-change="setQuery"
    :on-pick="pick"
    :on-close="close"
  />
</template>
