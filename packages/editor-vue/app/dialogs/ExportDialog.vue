<script setup lang="ts">
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import type { ExportOptions, PlatformId } from "@seldon/factory/export/types"
import { runLocalExport } from "@seldon/editor/lib/export/run-local-export"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@seldon/editor/lib/export/write-export-to-directory"
import { usePanelStore } from "@app/editor/panel-store"
import { useExportStatusStore } from "@app/io/export-status-store"
import { useToastStore } from "@app/toaster/toast-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const exportStatus = useExportStatusStore()
const toast = useToastStore()
const { isExporting } = storeToRefs(exportStatus)

const isOpen = computed(() => activePanel.value === "export-components")

const platformOptions = PLATFORM_LIST.map((p) => ({
  id: p.id,
  label: p.label,
  available: p.status === "available",
}))

const platform = ref<PlatformId>("vue")
const includeHidden = ref(false)
const allThemes = ref(true)
const allFonts = ref(true)
const fontLinks = ref(false)
const allIcons = ref(true)
const directory = ref<FileSystemDirectoryHandle | null>(null)

const directoryLabel = computed(() => directory.value?.name ?? "No folder chosen")
const canExport = computed(() => directory.value !== null && !isExporting.value)

async function chooseDirectory(): Promise<void> {
  const picked = await pickExportDirectory()
  if (picked) {
    directory.value = picked
  } else {
    toast.addToast("Folder picking is not supported in this browser")
  }
}

async function runExport(): Promise<void> {
  if (!directory.value) return
  const options: Partial<ExportOptions> = {
    target: { framework: platform.value, styles: "css-properties" },
    includeHiddenComponents: includeHidden.value,
    exportAllThemes: allThemes.value,
    exportAllFontCollections: allFonts.value,
    enableRemoteFonts: fontLinks.value,
    exportAllIconSetIcons: allIcons.value,
  }
  exportStatus.setExporting(true)
  try {
    const files = await runLocalExport(workspace.value, options)
    const written = await writeExportToDirectory(directory.value, files)
    toast.addToast(`Exported ${written} file${written === 1 ? "" : "s"}`)
    close()
  } catch (error) {
    toast.addToast(error instanceof Error ? error.message : "Export failed")
  } finally {
    exportStatus.setExporting(false)
  }
}

function close(): void {
  directory.value = null
  panel.closePanel()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") close()
}
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay" @click="close" @keydown="onKeydown">
    <div class="dialog" role="dialog" aria-modal="true" @click.stop>
      <header class="dialog__header">
        <span class="dialog__title">Export components</span>
        <button type="button" class="dialog__close" @click="close">×</button>
      </header>

      <div class="dialog__body">
        <label class="field">
          <span class="field__label">Platform</span>
          <select v-model="platform" class="field__input">
            <option
              v-for="option in platformOptions"
              :key="option.id"
              :value="option.id"
              :disabled="!option.available"
            >
              {{ option.available ? option.label : `${option.label} (soon)` }}
            </option>
          </select>
        </label>

        <label class="toggle">
          <input type="checkbox" v-model="includeHidden" />
          <span>Include hidden components</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="allThemes" />
          <span>Export all themes</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="allFonts" />
          <span>Export all font collections</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="fontLinks" />
          <span>Enable remote font links</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="allIcons" />
          <span>Export all icon set icons</span>
        </label>

        <div class="field">
          <span class="field__label">Destination folder</span>
          <div class="folder">
            <span class="folder__name">{{ directoryLabel }}</span>
            <button type="button" class="btn" @click="chooseDirectory">
              Choose…
            </button>
          </div>
        </div>
      </div>

      <footer class="dialog__footer">
        <button type="button" class="btn" @click="close">Cancel</button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="!canExport"
          @click="runExport"
        >
          {{ isExporting ? "Exporting…" : "Export" }}
        </button>
      </footer>
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
  padding-top: 10vh;
  z-index: 100;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.dialog {
  width: 440px;
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
.dialog__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field__label {
  font-size: 0.72rem;
  color: #a1a1aa;
}
.field__input {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.82rem;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #e4e4e7;
}
.folder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.folder__name {
  flex: 1;
  font-size: 0.8rem;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #27272a;
}
.btn {
  background: #27272a;
  border: 1px solid #3f3f46;
  color: #d4d4d8;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
}
.btn--primary {
  background: #4338ca;
  border-color: #6366f1;
  color: #fff;
}
.btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
