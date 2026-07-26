<script setup lang="ts">
import { STOCK_THEMES } from "@seldon/core/themes/catalog"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useStockCatalog } from "@app/dialogs/use-stock-catalog"
import PanelDialogController from "@app/dialogs/PanelDialogController.vue"
import type { CatalogDialogItem } from "@app/dialogs/types"
import { usePanelStore } from "@app/editor/panel-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed } from "vue"

const THEME_ICON = "seldon-theme"

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const { addTheme } = useAddRemoveCommands()

const isOpen = computed(() => activePanel.value === "add-theme")

const items = computed<CatalogDialogItem[]>(() =>
  STOCK_THEMES.filter((theme) => !workspace.value.boards[theme.metadata.id]).map(
    (theme) => ({
      id: theme.metadata.id,
      icon: THEME_ICON,
      name: theme.metadata.name,
      description: theme.metadata.description ?? "",
    }),
  ),
)

const { categories, query } = useStockCatalog({ category: "Themes", items })

function setQuery(next: string): void {
  query.value = next
}

function pick(item: CatalogDialogItem): void {
  addTheme(item.id)
}

function close(): void {
  panel.closePanel()
}
</script>

<template>
  <PanelDialogController
    v-if="isOpen"
    title="Add theme"
    confirm-button-text="Add theme"
    :categories="categories"
    :query="query"
    :on-query-change="setQuery"
    :on-pick="pick"
    :on-close="close"
  />
</template>
