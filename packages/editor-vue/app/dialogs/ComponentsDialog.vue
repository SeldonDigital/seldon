<script setup lang="ts">
import type { ComponentSchema } from "@seldon/core/components/types"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"
import type { InstanceId, VariantId } from "@seldon/core/workspace/types"
import {
  useCatalogDialog,
  type CatalogItem,
} from "@app/dialogs/use-catalog-dialog"
import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useAutoSelectNode } from "@app/workspace/use-auto-select-node"
import { useWorkspace } from "@app/workspace/use-workspace"
import { confirmMissingSchemaVariants } from "@seldon/editor/lib/workspace/confirm-missing-schema-variants"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

const panel = usePanelStore()
const { activePanel, target } = storeToRefs(panel)
const tool = useToolStore()
const { workspace } = useWorkspace()
const { dispatchWithAutoSelect } = useAutoSelectNode()

const isOpen = computed(() => activePanel.value === "component")

function shouldShow(schema: ComponentSchema): boolean {
  const current = target.value
  if (!current) return false
  const validation = validateComponentInsertionForUI(
    schema.id,
    current.nodeId as VariantId | InstanceId,
    workspace.value,
  )
  return validation.isValid
}

const { categories, query } = useCatalogDialog(shouldShow)

const searchInput = ref<HTMLInputElement | null>(null)

const nonEmptyCategories = computed(() =>
  categories.value.filter((category) => category.items.length > 0),
)

watch(isOpen, (open) => {
  if (open) {
    query.value = ""
    requestAnimationFrame(() => searchInput.value?.focus())
  }
})

async function pick(item: CatalogItem): Promise<void> {
  const current = target.value
  if (!current) return
  const variantFallbacks = await confirmMissingSchemaVariants(item.componentId)
  if (variantFallbacks === null) return

  dispatchWithAutoSelect({
    type: "add_component_and_insert_default_instance",
    payload: {
      boardKey: item.componentId,
      variantFallbacks: variantFallbacks.length ? variantFallbacks : undefined,
      target: {
        parentId: current.nodeId as VariantId | InstanceId,
        index: current.index,
      },
    },
  })
  tool.setActiveTool("select")
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
        <span class="dialog__title">Insert component</span>
        <button type="button" class="dialog__close" @click="panel.closePanel()">
          ×
        </button>
      </header>
      <input
        ref="searchInput"
        v-model="query"
        class="dialog__search"
        type="text"
        placeholder="Search components…"
        @keydown="onKeydown"
      />
      <div class="dialog__scroll">
        <p v-if="nonEmptyCategories.length === 0" class="dialog__empty">
          No components can be inserted here.
        </p>
        <section
          v-for="category in nonEmptyCategories"
          :key="category.category"
          class="dialog__category"
        >
          <h4 class="dialog__category-title">{{ category.category }}</h4>
          <div class="dialog__grid">
            <button
              v-for="item in category.items"
              :key="item.componentId"
              type="button"
              class="dialog__item"
              @click="pick(item)"
            >
              {{ item.name }}
            </button>
          </div>
        </section>
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
  width: 520px;
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
}
.dialog__empty {
  color: #71717a;
  font-size: 0.85rem;
  padding: 1rem 0;
}
.dialog__category {
  margin-top: 0.75rem;
}
.dialog__category-title {
  margin: 0 0 0.4rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717a;
}
.dialog__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}
.dialog__item {
  border: 1px solid #3f3f46;
  background: #27272a;
  color: #e4e4e7;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
}
.dialog__item:hover {
  background: #3730a3;
  border-color: #6366f1;
  color: #fff;
}
</style>
