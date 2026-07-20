<script setup lang="ts">
import { getStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { useEditorShortcuts } from "@app/commands/use-editor-shortcuts"
import { useWorkspaceAutosave } from "@app/persistence/use-workspace-autosave"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useHistoryStore } from "@app/workspace/history-store"
import { usePreviewModeStore } from "@app/editor/preview-mode-store"
import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import Canvas from "@app/canvas/Canvas.vue"
import LoadEditorFonts from "@app/editor/LoadEditorFonts.vue"
import AiChatPanel from "@app/palettes/AiChatPanel.vue"
import BoardsDialog from "@app/dialogs/BoardsDialog.vue"
import ComponentsDialog from "@app/dialogs/ComponentsDialog.vue"
import CreateComponentDialog from "@app/dialogs/CreateComponentDialog.vue"
import ExportDialog from "@app/dialogs/ExportDialog.vue"
import ThemesDialog from "@app/dialogs/ThemesDialog.vue"
import FontCollectionsDialog from "@app/dialogs/FontCollectionsDialog.vue"
import IconSetsDialog from "@app/dialogs/IconSetsDialog.vue"
import ImageUploadController from "@app/dialogs/image-upload/ImageUploadController.vue"
import ObjectsSidebar from "@app/sidebars/objects/ObjectsSidebar.vue"
import PropertiesSidebar from "@app/sidebars/properties/PropertiesSidebar.vue"
import TopbarController from "@app/topbar/TopbarController.vue"
import FocusRingOverlay from "@app/focus/FocusRingOverlay.vue"
import { useResolvedInterfaceMode } from "@app/editor/use-resolved-interface-mode"

const route = useRoute()
const history = useHistoryStore()
const save = useWorkspaceSaveStore()
const config = useEditorConfigStore()
const previewMode = usePreviewModeStore()
const { workspace } = useWorkspace()

const { showPanels, chromeTheme, objectsWidth, propertiesWidth } =
  storeToRefs(config)
const { isInPreviewMode } = storeToRefs(previewMode)
const resolvedMode = useResolvedInterfaceMode()

// Panels hide when the user collapses chrome (`\`) or enters device preview (`p`).
const showSidebars = computed(() => showPanels.value && !isInPreviewMode.value)

// Resizable sidebars, matching the React Allotment panes. Each handle drags its
// panel width, which the config store clamps and persists. The objects pane
// grows to the right of its left edge; the properties pane grows to the left of
// its right edge.
const objectsPane = ref<HTMLElement | null>(null)
const propertiesPane = ref<HTMLElement | null>(null)
const objectsStyle = computed(() => ({ width: `${objectsWidth.value}px` }))
const propertiesStyle = computed(() => ({ width: `${propertiesWidth.value}px` }))
const isResizingObjects = ref(false)
const isResizingProperties = ref(false)

function onObjectsMove(event: PointerEvent): void {
  const pane = objectsPane.value
  if (!pane) return
  config.setObjectsWidth(event.clientX - pane.getBoundingClientRect().left)
}
function stopObjectsResize(): void {
  isResizingObjects.value = false
  window.removeEventListener("pointermove", onObjectsMove)
  window.removeEventListener("pointerup", stopObjectsResize)
}
function startObjectsResize(event: PointerEvent): void {
  event.preventDefault()
  isResizingObjects.value = true
  window.addEventListener("pointermove", onObjectsMove)
  window.addEventListener("pointerup", stopObjectsResize)
}

function onPropertiesMove(event: PointerEvent): void {
  const pane = propertiesPane.value
  if (!pane) return
  config.setPropertiesWidth(pane.getBoundingClientRect().right - event.clientX)
}
function stopPropertiesResize(): void {
  isResizingProperties.value = false
  window.removeEventListener("pointermove", onPropertiesMove)
  window.removeEventListener("pointerup", stopPropertiesResize)
}
function startPropertiesResize(event: PointerEvent): void {
  event.preventDefault()
  isResizingProperties.value = true
  window.addEventListener("pointermove", onPropertiesMove)
  window.addEventListener("pointerup", stopPropertiesResize)
}

useEditorShortcuts()
useWorkspaceAutosave()

const status = ref<"loading" | "ready" | "missing">("loading")
const title = ref("Workspace")

const workspaceId = computed(() => String(route.params.id))

async function load(id: string): Promise<void> {
  status.value = "loading"
  const record = await getStoredWorkspace(id)
  if (!record) {
    status.value = "missing"
    return
  }
  title.value = record.name
  save.setRecord(record)
  history.reset(record.workspace)
  status.value = "ready"
}

watch(workspaceId, (id) => void load(id), { immediate: true })
</script>

<template>
  <div class="editor-shell" :data-theme="chromeTheme" :data-mode="resolvedMode">
    <TopbarController v-if="showPanels" />
    <div class="editor-body">
      <p v-if="status === 'loading'" class="editor-message">
        Loading workspace…
      </p>
      <p v-else-if="status === 'missing'" class="editor-message">
        Workspace not found.
        <RouterLink to="/">Back to home</RouterLink>
      </p>
      <template v-else>
        <LoadEditorFonts :workspace="workspace" />
        <template v-if="showSidebars">
          <div ref="objectsPane" class="editor-objects" :style="objectsStyle">
            <ObjectsSidebar :workspace="workspace" />
          </div>
          <div
            class="editor-resizer"
            :class="{ 'editor-resizer--active': isResizingObjects }"
            role="separator"
            aria-orientation="vertical"
            @pointerdown="startObjectsResize"
          />
        </template>
        <div class="editor-canvas">
          <Canvas :workspace="workspace" />
        </div>
        <template v-if="showSidebars">
          <div
            class="editor-resizer"
            :class="{ 'editor-resizer--active': isResizingProperties }"
            role="separator"
            aria-orientation="vertical"
            @pointerdown="startPropertiesResize"
          />
          <div
            ref="propertiesPane"
            class="editor-properties"
            :style="propertiesStyle"
          >
            <PropertiesSidebar :workspace="workspace" />
          </div>
        </template>
      </template>
    </div>
    <BoardsDialog />
    <ComponentsDialog />
    <CreateComponentDialog />
    <ThemesDialog />
    <FontCollectionsDialog />
    <IconSetsDialog />
    <ExportDialog />
    <ImageUploadController />
    <AiChatPanel />
    <FocusRingOverlay />
  </div>
</template>

<style scoped>
.editor-shell {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: var(--sdn-swatch-white);
  background-color: var(--sdn-swatch-black);
}
.editor-body {
  flex: 1;
  min-height: 0;
  display: flex;
}
.editor-objects,
.editor-properties {
  flex: none;
  height: 100%;
  min-height: 0;
  background-color: var(--sdn-swatch-offBlack);
}
/*
 * Pane separator/resize handle. The visible line is a 1px flex item so panes
 * stay flush (matching the subtle Allotment separator in the React editor:
 * offBlack at 20%). The grab area is a wider, absolutely positioned overlay
 * that adds no layout width, so the separator never reads as a thick bar.
 */
.editor-resizer {
  position: relative;
  flex: none;
  width: 1px;
  cursor: col-resize;
  z-index: 2;
  background-color: var(--separator-border);
  transition: background-color 0.15s ease;
}
.editor-resizer::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3px;
  right: -3px;
  cursor: col-resize;
}
.editor-resizer:hover,
.editor-resizer--active {
  background-color: var(--sdn-swatch-active);
}
.editor-canvas {
  flex: 1;
  min-width: 0;
}
.editor-message {
  padding: 2rem;
  color: #52525b;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
</style>
