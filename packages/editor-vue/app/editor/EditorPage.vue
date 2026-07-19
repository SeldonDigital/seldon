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
import ResourceDialog from "@app/dialogs/ResourceDialog.vue"
import ObjectsSidebar from "@app/sidebars/objects/ObjectsSidebar.vue"
import PropertiesSidebar from "@app/sidebars/properties/PropertiesSidebar.vue"
import TopBar from "@app/topbar/TopBar.vue"

const route = useRoute()
const history = useHistoryStore()
const save = useWorkspaceSaveStore()
const config = useEditorConfigStore()
const previewMode = usePreviewModeStore()
const { workspace } = useWorkspace()

const { showPanels } = storeToRefs(config)
const { isInPreviewMode } = storeToRefs(previewMode)

// Panels hide when the user collapses chrome (`\`) or enters device preview (`p`).
const showSidebars = computed(() => showPanels.value && !isInPreviewMode.value)

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
  <div class="editor-shell">
    <TopBar :title="title" />
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
        <ObjectsSidebar v-if="showSidebars" :workspace="workspace" />
        <div class="editor-canvas">
          <Canvas :workspace="workspace" />
        </div>
        <PropertiesSidebar v-if="showSidebars" :workspace="workspace" />
      </template>
    </div>
    <BoardsDialog />
    <ComponentsDialog />
    <CreateComponentDialog />
    <ResourceDialog />
    <ExportDialog />
    <AiChatPanel />
  </div>
</template>

<style scoped>
.editor-shell {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.editor-body {
  flex: 1;
  min-height: 0;
  display: flex;
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
