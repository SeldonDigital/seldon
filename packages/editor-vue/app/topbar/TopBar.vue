<script setup lang="ts">
import FloatingMenu from "@app/menus/FloatingMenu.vue"
import { useAddRemoveCommands } from "@lib/commands/use-add-remove-commands"
import { useMoveCommands } from "@lib/commands/use-move-commands"
import { useMenu } from "@lib/menus/use-menu"
import { getCurrentWorkspace, useHistoryStore } from "@lib/stores/history-store"
import { usePanelStore } from "@lib/stores/panel-store"
import { usePreviewModeStore } from "@lib/stores/preview-mode-store"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useToolStore } from "@lib/stores/tool-store"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { storeToRefs } from "pinia"
import { computed } from "vue"

defineProps<{ title?: string }>()

const history = useHistoryStore()
const panel = usePanelStore()
const selection = useSelectionStore()
const tool = useToolStore()
const previewMode = usePreviewModeStore()
const { addVariant, addPlayground, duplicateSelection, deleteSelection } =
  useAddRemoveCommands()
const {
  moveSelectionForward,
  moveSelectionBackward,
  moveSelectionToFront,
  moveSelectionToBack,
} = useMoveCommands()

const { canUndo, canRedo } = storeToRefs(history)
const { selectedNodeId, selectedBoardId } = storeToRefs(selection)
const { activeTool } = storeToRefs(tool)
const { isInPreviewMode } = storeToRefs(previewMode)

const isInsertTool = computed(() => activeTool.value === "component")

function toggleInsertTool(): void {
  tool.setActiveTool(isInsertTool.value ? "select" : "component")
}

const hasSelection = computed(
  () => Boolean(selectedNodeId.value) || Boolean(selectedBoardId.value),
)

const addMenu = useMenu()
const editMenu = useMenu()
const resourceMenu = useMenu()

function toggleAdd(event: MouseEvent): void {
  addMenu.toggle(event.currentTarget as HTMLElement)
}

function toggleEdit(event: MouseEvent): void {
  editMenu.toggle(event.currentTarget as HTMLElement)
}

function toggleResource(event: MouseEvent): void {
  resourceMenu.toggle(event.currentTarget as HTMLElement)
}

function run(action: () => void, menu: ReturnType<typeof useMenu>): void {
  action()
  menu.hide()
}

function openAddComponent(): void {
  run(() => panel.openPanel("add-board"), addMenu)
}

function insertIntoSelection(): void {
  const nodeId = selectedNodeId.value
  if (!nodeId) return
  const workspace = getCurrentWorkspace()
  const node = workspace.nodes[nodeId]
  const childCount = node ? getNodeChildIds(node, workspace).length : 0
  run(() => panel.openPanel("component", { nodeId, index: childCount }), addMenu)
}
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <RouterLink to="/" class="topbar__home">Seldon · Vue</RouterLink>
      <span class="topbar__title">{{ title ?? "Workspace" }}</span>

      <button
        class="topbar__btn"
        :class="{ 'topbar__btn--active': isInsertTool }"
        title="Insert component (I)"
        @click="toggleInsertTool"
      >
        Insert
      </button>

      <button class="topbar__btn" @click="toggleAdd">Add ▾</button>
      <FloatingMenu :open="addMenu.open.value" :anchor="addMenu.anchor.value" @close="addMenu.hide()">
        <button class="menu-item" @click="openAddComponent">Add component…</button>
        <button
          class="menu-item"
          @click="run(() => panel.openPanel('create-component'), addMenu)"
        >
          New component…
        </button>
        <button
          class="menu-item"
          :disabled="!selectedNodeId"
          @click="insertIntoSelection"
        >
          Insert into selection…
        </button>
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(addVariant, addMenu)"
        >
          Add variant
        </button>
        <button class="menu-item" @click="run(addPlayground, addMenu)">
          Add playground
        </button>
      </FloatingMenu>

      <button class="topbar__btn" @click="toggleEdit">Edit ▾</button>
      <FloatingMenu :open="editMenu.open.value" :anchor="editMenu.anchor.value" @close="editMenu.hide()">
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(duplicateSelection, editMenu)"
        >
          Duplicate
        </button>
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(deleteSelection, editMenu)"
        >
          Delete
        </button>
        <div class="menu-divider" />
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(moveSelectionForward, editMenu)"
        >
          Move forward
        </button>
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(moveSelectionBackward, editMenu)"
        >
          Move backward
        </button>
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(moveSelectionToFront, editMenu)"
        >
          Move to front
        </button>
        <button
          class="menu-item"
          :disabled="!hasSelection"
          @click="run(moveSelectionToBack, editMenu)"
        >
          Move to back
        </button>
      </FloatingMenu>

      <button class="topbar__btn" @click="toggleResource">Resources ▾</button>
      <FloatingMenu
        :open="resourceMenu.open.value"
        :anchor="resourceMenu.anchor.value"
        @close="resourceMenu.hide()"
      >
        <button
          class="menu-item"
          @click="run(() => panel.openPanel('add-theme'), resourceMenu)"
        >
          Add theme…
        </button>
        <button
          class="menu-item"
          @click="run(() => panel.openPanel('add-font-collection'), resourceMenu)"
        >
          Add font collection…
        </button>
        <button
          class="menu-item"
          @click="run(() => panel.openPanel('add-icon-set'), resourceMenu)"
        >
          Add icon set…
        </button>
      </FloatingMenu>
    </div>

    <div class="topbar__right">
      <button class="topbar__btn" @click="panel.openPanel('export-components')">
        Export…
      </button>
      <button
        class="topbar__btn"
        :class="{ 'topbar__btn--active': isInPreviewMode }"
        @click="previewMode.togglePreviewMode()"
      >
        Preview
      </button>
      <button class="topbar__btn" :disabled="!canUndo" @click="history.undo()">
        Undo
      </button>
      <button class="topbar__btn" :disabled="!canRedo" @click="history.redo()">
        Redo
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 44px;
  flex: 0 0 44px;
  background: #09090b;
  border-bottom: 1px solid #27272a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.topbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.topbar__home {
  color: #fafafa;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
}
.topbar__title {
  color: #71717a;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}
.topbar__right {
  display: flex;
  gap: 0.5rem;
}
.topbar__btn {
  background: #27272a;
  border: 1px solid #3f3f46;
  color: #d4d4d8;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.75rem;
  cursor: pointer;
}
.topbar__btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.topbar__btn--active {
  background: #3730a3;
  border-color: #6366f1;
  color: #fff;
}
.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: #e4e4e7;
  padding: 6px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.menu-item:hover:not(:disabled) {
  background: #3730a3;
  color: #fff;
}
.menu-item:disabled {
  opacity: 0.4;
  cursor: default;
}
.menu-divider {
  height: 1px;
  background: #3f3f46;
  margin: 4px 0;
}
</style>
