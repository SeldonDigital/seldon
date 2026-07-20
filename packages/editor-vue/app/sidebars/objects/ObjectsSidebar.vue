<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from "vue"
import { storeToRefs } from "pinia"
import type { Board as BoardType, Workspace } from "@seldon/core"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import SidebarObjects from "@seldon/components/modules/SidebarObjects.vue"
import Frame from "@seldon/components/frames/Frame.vue"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useToastStore } from "@app/toaster/toast-store"
import { useObjectsSections } from "@app/sidebars/use-objects-sections"
import { useRenameInput } from "@app/sidebars/use-rename-input"
import { buildFieldStateProps } from "@app/sidebars/state-props"
import SectionRow from "./SectionRow.vue"
import BoardRow from "./BoardRow.vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const config = useEditorConfigStore()
const save = useWorkspaceSaveStore()
const toast = useToastStore()

const { workspaceSelected } = storeToRefs(selection)
const { objectsView } = storeToRefs(config)
const { record } = storeToRefs(save)

const sections = useObjectsSections(toRef(props, "workspace"))

const workspaceName = computed(() => record.value?.name ?? "Workspace")

const componentsActive = computed(() => objectsView.value === "components")
const resourcesActive = computed(() => objectsView.value === "resources")

// Inline project rename, reusing the shared rename machinery.
const isEditingName = ref(false)
function setEditingName(value: boolean): void {
  isEditingName.value = value
}
function submitRename(next: string): void {
  const trimmed = next.trim()
  if (trimmed && trimmed !== workspaceName.value) {
    void save.saveNow(getCurrentWorkspace(), { name: trimmed })
  }
  setEditingName(false)
}
const { inputProps } = useRenameInput({
  label: () => workspaceName.value,
  isEditing: isEditingName,
  setEditing: setEditingName,
  onSubmit: submitRename,
})

const sidebarRef = ref<{ $el?: HTMLElement } | null>(null)
watch(isEditingName, async (editing) => {
  if (!editing) return
  await nextTick()
  const input = sidebarRef.value?.$el?.querySelector<HTMLInputElement>(
    "input.sdn-input",
  )
  if (input) {
    input.focus()
    input.select()
  }
})

function selectWorkspace(): void {
  selection.selectWorkspace(null)
}
function enterRename(): void {
  setEditingName(true)
}
function forceSave(): void {
  void save.saveNow(getCurrentWorkspace())
  toast.addToast("Project saved")
}

const projectField = computed(() => ({
  ...buildFieldStateProps({ selected: workspaceSelected.value }),
  onClick: selectWorkspace,
  onDblclick: enterRename,
}))
const projectActions = { onClick: forceSave }

const componentsToggle = computed(() => ({
  class: componentsActive.value ? "sdn-state-activated" : undefined,
  "aria-pressed": componentsActive.value,
  title: "Components",
  onClick: () => config.setObjectsView("components"),
}))
const resourcesToggle = computed(() => ({
  class: resourcesActive.value ? "sdn-state-activated" : undefined,
  "aria-pressed": resourcesActive.value,
  title: "Resources",
  onClick: () => config.setObjectsView("resources"),
}))

// Grow the generated objects container so the tree fills and scrolls, matching
// the React `seldonRefs.objectsContainer` style override.
const containerFrame = {
  style: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
}

function asBoard(board: unknown): BoardType {
  return board as BoardType
}
</script>

<template>
  <SidebarObjects
    ref="sidebarRef"
    class="objects-sidebar"
    data-testid="objects-sidebar"
    :combobox-field-project="projectField"
    :input="inputProps"
    :button-iconic="projectActions"
    :frame2="{}"
    :button-toggle="componentsToggle"
    :button-toggle2="resourcesToggle"
    :frame3="containerFrame"
  >
    <template #objects>
      <Frame class="objects-sidebar__scroll">
        <SectionRow
          v-for="section in sections"
          :key="section.level"
          :section="section"
        >
          <BoardRow
            v-for="board in section.boards"
            :key="getComponentKey(board)"
            :workspace="workspace"
            :board="asBoard(board)"
          />
          <ItemNode
            v-if="section.boards.length === 0"
            class="objects-sidebar__empty"
            aria-disabled="true"
            data-testid="objects-sidebar-empty-section"
            :button-iconic="null"
            :combobox-field="{}"
            :icon2="null"
            :input="{ value: `No ${section.label.toLowerCase()}`, readonly: true }"
            :button-iconic2="null"
            :button-iconic3="null"
          />
        </SectionRow>
      </Frame>
    </template>
  </SidebarObjects>
</template>

<style scoped>
.objects-sidebar {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.objects-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--sdn-gaps-tight);
}
.objects-sidebar__empty {
  opacity: 0.5;
}
</style>
