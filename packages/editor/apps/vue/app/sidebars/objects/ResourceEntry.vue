<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import { storeToRefs } from "pinia"
import type { Workspace } from "@seldon/core/workspace/types"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import MenuController from "@app/menus/MenuController.vue"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useRenameInput } from "@app/sidebars/use-rename-input"
import { useRowActionsMenu } from "@app/menus/use-row-actions-menu"
import { useResourceEntryRow } from "./hooks/use-resource-entry-row"
import type { ResourceRowConfig } from "./helpers/resource-row-config"

const props = withDefaults(
  defineProps<{
    workspace: Workspace
    config: ResourceRowConfig
    entryId: string
    show?: boolean
    parentIsSelected?: boolean
  }>(),
  { show: true, parentIsSelected: false },
)

const selection = useSelectionStore()
const { selectedResourceEntry } = storeToRefs(selection)

const entry = computed(() => props.config.getEntry(props.workspace, props.entryId))

const isSelected = computed(
  () =>
    selectedResourceEntry.value?.kind === props.config.kind &&
    selectedResourceEntry.value?.id === props.entryId,
)
const isActive = computed(() => props.parentIsSelected || isSelected.value)

const { isEditingName, setEditingName, submitLabel, actions } =
  useResourceEntryRow({
    config: props.config,
    entryId: props.entryId,
    entry: () => entry.value,
    isSelected: () => isSelected.value,
  })

const canRename = computed(
  () => Boolean(props.config.buildLabelAction) && !entry.value?.isDefault,
)

function select(): void {
  selection.selectResourceEntry(props.config.kind, props.entryId)
}

function handleDoubleClick(): void {
  if (canRename.value) setEditingName(true)
}

const {
  open: actionsOpen,
  anchor: actionsAnchor,
  close: closeActions,
  buttonIconic: actionsButton,
  icon: actionsIcon,
  menuItems: actionsItems,
  hasActions,
} = useRowActionsMenu(actions)

const { inputProps } = useRenameInput({
  label: () => entry.value?.label ?? "",
  isEditing: () => isEditingName.value && Boolean(props.config.buildLabelAction),
  setEditing: setEditingName,
  onSubmit: submitLabel,
})

const itemRef = ref<{ $el?: HTMLElement } | null>(null)
watch(isEditingName, async (editing) => {
  if (!editing) return
  await nextTick()
  const input = itemRef.value?.$el?.querySelector<HTMLInputElement>(
    "input.sdn-input",
  )
  if (input) {
    input.focus()
    input.select()
  }
})

const toggleIconSlot = { style: { opacity: 0 } }
const iconSlot = computed(() => ({ icon: props.config.icon }))
const fieldSlot = computed(() => ({
  "aria-selected": isSelected.value || undefined,
}))
</script>

<template>
  <template v-if="show && entry">
    <ItemNode
      ref="itemRef"
      class="objects-resource-entry"
      :aria-selected="isActive || undefined"
      :data-testid="config.testId"
      :data-resource-entry-id="entryId"
      :data-resource-kind="config.kind"
      :data-active="isActive || undefined"
      :button-iconic="{}"
      :icon="toggleIconSlot"
      :combobox-field="fieldSlot"
      :icon2="iconSlot"
      :input="inputProps"
      :button-iconic2="null"
      :button-iconic3="actionsButton"
      :icon4="actionsIcon"
      @click="select"
      @dblclick="handleDoubleClick"
    />

    <MenuController
      v-if="hasActions"
      :open="actionsOpen"
      :anchor="actionsAnchor"
      :items="actionsItems"
      align="end"
      @close="closeActions"
    />
  </template>
</template>
