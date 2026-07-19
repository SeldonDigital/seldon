<script setup lang="ts">
import { Workspace, getComponentSchema } from "@app/core"
import { isComponentId } from "@seldon/core/components/constants"
import {
  getBoardVariantRootIds,
  getComponentKey,
} from "@seldon/editor/lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import { useSelectionStore } from "@app/workspace/selection-store"
import NodeRow from "./NodeRow.vue"

type ResourceKind = "theme" | "fontCollection" | "iconSet" | "media"

const props = defineProps<{
  workspace: Workspace
  board: Record<string, unknown>
  /** Resource kind when this is a resource board; omitted for component boards. */
  resourceKind?: ResourceKind
}>()

const selection = useSelectionStore()
const { selectedBoardId } = storeToRefs(selection)

const expanded = ref(true)

const boardKey = computed(() => getComponentKey(props.board as never))
const name = computed(
  () => (props.board as { name?: string }).name ?? boardKey.value,
)

const iconId = computed(() => {
  if (props.resourceKind === "theme") return "seldon-theme"
  if (props.resourceKind === "fontCollection") return "material-fontDownload"
  if (props.resourceKind === "iconSet") return "seldon-component"
  if (props.resourceKind === "media") return "material-image"
  const catalogId = (props.board as { catalogId?: string }).catalogId
  if (catalogId && isComponentId(catalogId)) {
    try {
      return getComponentSchema(catalogId).icon ?? "seldon-component"
    } catch {
      return "seldon-component"
    }
  }
  return "seldon-component"
})

const rootIds = computed(() =>
  props.resourceKind ? [] : getBoardVariantRootIds(props.board as never),
)

type ResourceEntryRow = { id: string; name: string }

const resourceEntries = computed<ResourceEntryRow[]>(() => {
  if (!props.resourceKind) return []
  const variants =
    (props.board as { variants?: Array<{ id: string }> }).variants ?? []
  return variants.map((variant) => ({
    id: variant.id,
    name: entryName(variant.id) ?? variant.id,
  }))
})

function entryName(id: string): string | undefined {
  if (props.resourceKind === "theme") {
    return (props.workspace.themes[id] as { name?: string } | undefined)?.name
  }
  if (props.resourceKind === "fontCollection") {
    return (
      props.workspace["font-collections"][id] as
        | { name?: string }
        | undefined
    )?.name
  }
  if (props.resourceKind === "iconSet") {
    return (props.workspace["icon-sets"][id] as { name?: string } | undefined)
      ?.name
  }
  if (props.resourceKind === "media") {
    return (props.workspace.media[id] as { name?: string } | undefined)?.name
  }
  return undefined
}

const isBoardSelected = computed(() => selectedBoardId.value === boardKey.value)

function selectBoard(): void {
  selection.selectBoard(boardKey.value)
}

function isEntrySelected(id: string): boolean {
  return selection.selectedResourceEntry?.id === id
}

function selectEntry(id: string): void {
  if (!props.resourceKind) return
  selection.selectResourceEntry(props.resourceKind, id)
}

function toggle(event: Event): void {
  event.stopPropagation()
  expanded.value = !expanded.value
}

const hasChildren = computed(
  () => rootIds.value.length > 0 || resourceEntries.value.length > 0,
)

const toggleButton = computed(() =>
  hasChildren.value ? { onClick: toggle } : null,
)
const toggleIcon = computed(() => ({
  style: {
    transition: "transform 0.2s ease",
    transform: expanded.value ? "rotate(90deg)" : "none",
    opacity: hasChildren.value ? 1 : 0,
  },
}))
const fieldProps = computed(() => ({
  "aria-selected": isBoardSelected.value || undefined,
}))
const boardIconProps = computed(() => ({ icon: iconId.value }))
const labelProps = computed(() => ({ value: name.value, readonly: true }))
</script>

<template>
  <ItemNode
    class="objects-board-row"
    :aria-selected="isBoardSelected || undefined"
    :data-selection-id="boardKey"
    data-selection-kind="board"
    :button-iconic="toggleButton"
    :icon="toggleIcon"
    :combobox-field="fieldProps"
    :icon2="boardIconProps"
    :input="labelProps"
    :button-iconic2="null"
    :button-iconic3="null"
    @click="selectBoard"
  />

  <template v-if="expanded">
    <NodeRow
      v-for="rootId in rootIds"
      :key="rootId"
      :workspace="workspace"
      :node-id="rootId"
      :root-id="rootId"
      :depth="1"
    />
    <ItemNode
      v-for="entry in resourceEntries"
      :key="entry.id"
      class="objects-resource-entry"
      :style="{ paddingLeft: '12px' }"
      :aria-selected="isEntrySelected(entry.id) || undefined"
      :button-iconic="null"
      :combobox-field="{ 'aria-selected': isEntrySelected(entry.id) || undefined }"
      :icon2="null"
      :input="{ value: entry.name, readonly: true }"
      :button-iconic2="null"
      :button-iconic3="null"
      @click="selectEntry(entry.id)"
    />
  </template>
</template>
