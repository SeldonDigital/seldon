<script setup lang="ts">
import type { ComponentSchema } from "@seldon/core/components/types"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"
import type { InstanceId, VariantId } from "@seldon/core/workspace/types"
import {
  useCatalogDialog,
  type CatalogItem,
} from "@app/dialogs/use-catalog-dialog"
import PanelDialogController from "@app/dialogs/PanelDialogController.vue"
import { usePanelStore } from "@app/editor/panel-store"
import { useToolStore } from "@app/editor/tool-store"
import { useAutoSelectNode } from "@app/workspace/use-auto-select-node"
import { useWorkspace } from "@app/workspace/use-workspace"
import { confirmMissingSchemaVariants } from "@seldon/editor/lib/workspace/confirm-missing-schema-variants"
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"

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

watch(isOpen, (open) => {
  if (open) query.value = ""
})

function setQuery(next: string): void {
  query.value = next
}

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
}

function close(): void {
  panel.closePanel()
}
</script>

<template>
  <PanelDialogController
    v-if="isOpen"
    title="Insert component"
    confirm-button-text="Insert component"
    :categories="categories"
    :query="query"
    :on-query-change="setQuery"
    :on-pick="pick"
    :on-close="close"
  />
</template>
