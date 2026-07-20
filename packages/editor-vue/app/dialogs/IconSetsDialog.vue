<script setup lang="ts">
import { STOCK_ICON_SETS } from "@seldon/core/icon-sets/catalog"
import { DEFAULT_ICON_SET_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-icon-set-board"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useStockCatalog } from "@app/dialogs/use-stock-catalog"
import PanelDialogController from "@app/dialogs/PanelDialogController.vue"
import type { CatalogDialogItem } from "@app/dialogs/types"
import { usePanelStore } from "@app/editor/panel-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed } from "vue"

const ICON_SET_ICON = "material-category"

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const { addIconSet } = useAddRemoveCommands()

const isOpen = computed(() => activePanel.value === "add-icon-set")

const items = computed<CatalogDialogItem[]>(() =>
  STOCK_ICON_SETS.filter(
    (set) =>
      set.metadata.id !== DEFAULT_ICON_SET_BOARD_KEY &&
      !workspace.value.boards[set.metadata.id],
  ).map((set) => ({
    id: set.metadata.id,
    icon: ICON_SET_ICON,
    name: set.metadata.name,
    description: set.metadata.description ?? "",
  })),
)

const { categories, query } = useStockCatalog({ category: "Icon Sets", items })

function setQuery(next: string): void {
  query.value = next
}

function pick(item: CatalogDialogItem): void {
  addIconSet(item.id)
}

function close(): void {
  panel.closePanel()
}
</script>

<template>
  <PanelDialogController
    v-if="isOpen"
    title="Add icon set"
    confirm-button-text="Add icon set"
    :categories="categories"
    :query="query"
    :on-query-change="setQuery"
    :on-pick="pick"
    :on-close="close"
  />
</template>
