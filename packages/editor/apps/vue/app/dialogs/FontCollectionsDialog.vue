<script setup lang="ts">
import { STOCK_FONT_COLLECTIONS } from "@seldon/core/font-collections/catalog"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "@seldon/core/workspace/helpers/seed/seed-default-font-collection-board"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useStockCatalog } from "@app/dialogs/use-stock-catalog"
import PanelDialogController from "@app/dialogs/PanelDialogController.vue"
import type { CatalogDialogItem } from "@app/dialogs/types"
import { usePanelStore } from "@app/editor/panel-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed } from "vue"

const FONT_COLLECTION_ICON = "material-fontDownload"

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const { addFontCollection } = useAddRemoveCommands()

const isOpen = computed(() => activePanel.value === "add-font-collection")

const items = computed<CatalogDialogItem[]>(() =>
  STOCK_FONT_COLLECTIONS.filter(
    (collection) =>
      collection.metadata.id !== DEFAULT_FONT_COLLECTION_BOARD_KEY &&
      !workspace.value.boards[collection.metadata.id],
  ).map((collection) => ({
    id: collection.metadata.id,
    icon: FONT_COLLECTION_ICON,
    name: collection.metadata.name,
    description: collection.metadata.description ?? "",
  })),
)

const { categories, query } = useStockCatalog({
  category: "Font Collections",
  items,
})

function setQuery(next: string): void {
  query.value = next
}

function pick(item: CatalogDialogItem): void {
  addFontCollection(item.id)
}

function close(): void {
  panel.closePanel()
}
</script>

<template>
  <PanelDialogController
    v-if="isOpen"
    title="Add font collection"
    confirm-button-text="Add font collection"
    :categories="categories"
    :query="query"
    :on-query-change="setQuery"
    :on-pick="pick"
    :on-close="close"
  />
</template>
