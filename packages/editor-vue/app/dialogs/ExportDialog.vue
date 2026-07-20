<script setup lang="ts">
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import type { ExportOptions, PlatformId } from "@seldon/factory/export/types"
import { runLocalExport } from "@seldon/editor/lib/export/run-local-export"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@seldon/editor/lib/export/write-export-to-directory"
import DialogExportComponent from "@seldon/components/modules/DialogExportComponent.vue"
import WindowSurface from "@app/windows/WindowSurface.vue"
import MenuController from "@app/menus/MenuController.vue"
import type { MenuEntry } from "@app/menus/types"
import { useDraggableWindow } from "@app/menus/use-draggable-window"
import { usePanelStore } from "@app/editor/panel-store"
import { useExportStatusStore } from "@app/io/export-status-store"
import { useToastStore } from "@app/toaster/toast-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, ref, watch, type CSSProperties } from "vue"

const ICON_CHECKED = "material-radioButtonChecked"
const ICON_UNCHECKED = "material-radioButtonUnchecked"

const EXPORT_PLATFORM_OPTIONS = PLATFORM_LIST.map((platform) => ({
  id: platform.id,
  label: platform.label,
  available: platform.status === "available",
}))

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const exportStatus = useExportStatusStore()
const toast = useToastStore()
const { isExporting } = storeToRefs(exportStatus)

const isOpen = computed(() => activePanel.value === "export-components")

const platform = ref<PlatformId>("vue")
const includeHidden = ref(false)
const allThemes = ref(true)
const allFonts = ref(true)
const fontLinks = ref(false)
const allIcons = ref(true)
const directory = ref<FileSystemDirectoryHandle | null>(null)

const directoryLabel = computed(() => directory.value?.name ?? "")
const canExport = computed(
  () => directory.value !== null && !isExporting.value,
)
const platformLabel = computed(
  () =>
    EXPORT_PLATFORM_OPTIONS.find((option) => option.id === platform.value)
      ?.label ?? "",
)

const { x, y, moveControls } = useDraggableWindow({
  handleClose: close,
  contentSized: true,
})

const platformOpen = ref(false)
const platformAnchor = ref<HTMLElement | null>(null)

const platformItems = computed<MenuEntry[]>(() =>
  EXPORT_PLATFORM_OPTIONS.map((option) => ({
    id: option.id,
    label: option.available ? option.label : `${option.label} (soon)`,
    selected: option.id === platform.value,
    active: option.id === platform.value,
    activeMarker: "bullet",
    disabled: !option.available,
    onSelect: () => {
      platform.value = option.id
    },
  })),
)

function startDrag(event: PointerEvent): void {
  moveControls.start(event)
}
function openPlatform(event: MouseEvent): void {
  platformAnchor.value = event.currentTarget as HTMLElement
  platformOpen.value = true
}
function closePlatform(): void {
  platformOpen.value = false
}

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

watch(isOpen, (open) => {
  if (open) {
    x.set(0)
    y.set(0)
  }
})

const styles: Record<string, CSSProperties> = {
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  pointer: { cursor: "pointer" },
  disabled: { opacity: 0.5, pointerEvents: "none" },
}

// Display-only slots ship baked authored copy, so an empty object turns them on.
const showSlot = {}

// Wires a Yes/No radio item: checked state, role, and its select handler.
function radioProps(checked: boolean, onSelect: () => void) {
  return {
    onClick: onSelect,
    role: "radio",
    "aria-checked": checked ? "true" : "false",
    "aria-selected": checked || undefined,
    style: styles.pointer,
  }
}
function iconFor(checked: boolean) {
  return { icon: checked ? ICON_CHECKED : ICON_UNCHECKED }
}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))
const rootPathInput = computed(() => ({
  value: directoryLabel.value,
  placeholder: "Choose a folder…",
  readonly: true,
  onClick: chooseDirectory,
  style: styles.pointer,
}))
const platformField = computed(() => ({
  onClick: openPlatform,
  "aria-expanded": platformOpen.value,
  style: styles.pointer,
}))
const platformInput = computed(() => ({
  value: platformLabel.value,
  readonly: true,
  style: styles.pointer,
}))
const cancelButton = { onClick: close }
const confirmButton = computed(() => ({
  onClick: runExport,
  "aria-disabled": !canExport.value,
  style: canExport.value ? undefined : styles.disabled,
}))

const hiddenYes = computed(() =>
  radioProps(includeHidden.value, () => (includeHidden.value = true)),
)
const hiddenNo = computed(() =>
  radioProps(!includeHidden.value, () => (includeHidden.value = false)),
)
const themesYes = computed(() =>
  radioProps(allThemes.value, () => (allThemes.value = true)),
)
const themesNo = computed(() =>
  radioProps(!allThemes.value, () => (allThemes.value = false)),
)
const fontsYes = computed(() =>
  radioProps(allFonts.value, () => (allFonts.value = true)),
)
const fontsNo = computed(() =>
  radioProps(!allFonts.value, () => (allFonts.value = false)),
)
const fontLinksYes = computed(() =>
  radioProps(fontLinks.value, () => (fontLinks.value = true)),
)
const fontLinksNo = computed(() =>
  radioProps(!fontLinks.value, () => (fontLinks.value = false)),
)
const iconsYes = computed(() =>
  radioProps(allIcons.value, () => (allIcons.value = true)),
)
const iconsNo = computed(() =>
  radioProps(!allIcons.value, () => (allIcons.value = false)),
)
</script>

<template>
  <WindowSurface
    v-if="isOpen"
    modal
    content-sized
    :on-close="close"
    :x="x"
    :y="y"
    :move-controls="moveControls"
  >
    <DialogExportComponent
      data-testid="export-components-dialog"
      :bar="barHandle"
      :text-title="showSlot"
      :form-control="showSlot"
      :text-label="showSlot"
      :input="rootPathInput"
      :form-control2="showSlot"
      :text-label2="showSlot"
      :combobox-field="platformField"
      :input2="platformInput"
      :form-control-radio="showSlot"
      :frame2="showSlot"
      :text-label3="showSlot"
      :text-description="showSlot"
      :frame3="showSlot"
      :menu-item-radio="hiddenYes"
      :icon2="iconFor(includeHidden)"
      :text-label4="showSlot"
      :menu-item-radio2="hiddenNo"
      :icon3="iconFor(!includeHidden)"
      :text-label5="showSlot"
      :form-control-radio2="showSlot"
      :frame4="showSlot"
      :text-label6="showSlot"
      :text-description2="showSlot"
      :frame5="showSlot"
      :menu-item-radio3="themesYes"
      :icon4="iconFor(allThemes)"
      :text-label7="showSlot"
      :menu-item-radio4="themesNo"
      :icon5="iconFor(!allThemes)"
      :text-label8="showSlot"
      :form-control-radio3="showSlot"
      :frame6="showSlot"
      :text-label9="showSlot"
      :text-description3="showSlot"
      :frame7="showSlot"
      :menu-item-radio5="fontsYes"
      :icon6="iconFor(allFonts)"
      :text-label10="showSlot"
      :menu-item-radio6="fontsNo"
      :icon7="iconFor(!allFonts)"
      :text-label11="showSlot"
      :form-control-radio4="showSlot"
      :frame8="showSlot"
      :text-label12="showSlot"
      :text-description4="showSlot"
      :frame9="showSlot"
      :menu-item-radio7="fontLinksYes"
      :icon8="iconFor(fontLinks)"
      :text-label13="showSlot"
      :menu-item-radio8="fontLinksNo"
      :icon9="iconFor(!fontLinks)"
      :text-label14="showSlot"
      :form-control-radio5="showSlot"
      :frame10="showSlot"
      :text-label15="showSlot"
      :text-description5="showSlot"
      :frame11="showSlot"
      :menu-item-radio9="iconsYes"
      :icon10="iconFor(allIcons)"
      :text-label16="showSlot"
      :menu-item-radio10="iconsNo"
      :icon11="iconFor(!allIcons)"
      :text-label17="showSlot"
      :button="cancelButton"
      :text-label18="showSlot"
      :button2="confirmButton"
      :text-label19="showSlot"
    />
    <MenuController
      :open="platformOpen"
      :anchor="platformAnchor"
      :items="platformItems"
      @close="closePlatform"
    />
  </WindowSurface>
</template>
