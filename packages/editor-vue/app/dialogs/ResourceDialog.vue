<script setup lang="ts">
import { STOCK_THEMES } from "@seldon/core/themes/catalog"
import { STOCK_FONT_COLLECTIONS } from "@seldon/core/font-collections/catalog"
import { STOCK_ICON_SETS } from "@seldon/core/icon-sets/catalog"
import { useAddRemoveCommands } from "@lib/commands/use-add-remove-commands"
import { usePanelStore } from "@lib/stores/panel-store"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

type ResourcePanel = "add-theme" | "add-font-collection" | "add-icon-set"

type StockEntry = {
  metadata: { id: string; name: string; description?: string }
}

type ResourceItem = { id: string; name: string; description: string }

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const { addTheme, addFontCollection, addIconSet } = useAddRemoveCommands()

const query = ref("")

const config = computed(() => {
  switch (activePanel.value) {
    case "add-theme":
      return { title: "Add theme", stock: STOCK_THEMES as StockEntry[] }
    case "add-font-collection":
      return {
        title: "Add font collection",
        stock: STOCK_FONT_COLLECTIONS as StockEntry[],
      }
    case "add-icon-set":
      return { title: "Add icon set", stock: STOCK_ICON_SETS as StockEntry[] }
    default:
      return null
  }
})

const isOpen = computed(() => config.value !== null)

const items = computed<ResourceItem[]>(() => {
  const current = config.value
  if (!current) return []
  const existing = workspace.value.boards
  const queryLower = query.value.toLowerCase()
  return current.stock
    .filter((entry) => !existing[entry.metadata.id])
    .map((entry) => ({
      id: entry.metadata.id,
      name: entry.metadata.name,
      description: entry.metadata.description ?? "",
    }))
    .filter(
      (item) =>
        queryLower.length === 0 ||
        item.name.toLowerCase().includes(queryLower) ||
        item.id.toLowerCase().includes(queryLower),
    )
})

watch(isOpen, (open) => {
  if (open) query.value = ""
})

function pick(item: ResourceItem): void {
  switch (activePanel.value) {
    case "add-theme":
      addTheme(item.id)
      break
    case "add-font-collection":
      addFontCollection(item.id)
      break
    case "add-icon-set":
      addIconSet(item.id)
      break
  }
  panel.closePanel()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") panel.closePanel()
}
</script>

<template>
  <div
    v-if="isOpen"
    class="dialog-overlay"
    @click="panel.closePanel()"
    @keydown="onKeydown"
  >
    <div class="dialog" role="dialog" aria-modal="true" @click.stop>
      <header class="dialog__header">
        <span class="dialog__title">{{ config?.title }}</span>
        <button type="button" class="dialog__close" @click="panel.closePanel()">
          ×
        </button>
      </header>
      <input
        v-model="query"
        class="dialog__search"
        type="text"
        placeholder="Search…"
        @keydown="onKeydown"
      />
      <div class="dialog__scroll">
        <p v-if="items.length === 0" class="dialog__empty">
          Nothing left to add.
        </p>
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="dialog__item"
          @click="pick(item)"
        >
          <span class="dialog__item-name">{{ item.name }}</span>
          <span v-if="item.description" class="dialog__item-desc">{{
            item.description
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8vh;
  z-index: 100;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.dialog {
  width: 480px;
  max-height: 70vh;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
.dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #27272a;
}
.dialog__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fafafa;
}
.dialog__close {
  border: none;
  background: transparent;
  color: #a1a1aa;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}
.dialog__search {
  margin: 0.75rem 1rem 0.25rem;
  padding: 0.5rem 0.75rem;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  color: #fafafa;
  font-size: 0.85rem;
  outline: none;
}
.dialog__search:focus {
  border-color: #6366f1;
}
.dialog__scroll {
  flex: 1;
  overflow: auto;
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dialog__empty {
  color: #71717a;
  font-size: 0.85rem;
  padding: 1rem 0;
}
.dialog__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #3f3f46;
  background: #27272a;
  color: #e4e4e7;
  border-radius: 6px;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
}
.dialog__item:hover {
  background: #3730a3;
  border-color: #6366f1;
  color: #fff;
}
.dialog__item-name {
  font-size: 0.82rem;
  font-weight: 500;
}
.dialog__item-desc {
  font-size: 0.72rem;
  color: #a1a1aa;
}
</style>
