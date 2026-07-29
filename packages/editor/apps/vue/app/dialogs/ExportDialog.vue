<script setup lang="ts">
import { usePanelStore } from "@app/editor/panel-store"
import { useExportStatusStore } from "@app/io/export-status-store"
import { useImportExport } from "@app/io/use-import-export"
import MenuController from "@app/menus/MenuController.vue"
import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { useWorkspaceId } from "@app/project/use-workspace-id"
import { useToastStore } from "@app/toaster/toast-store"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/windows/use-draggable-window"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useWorkspace } from "@app/workspace/use-workspace"
import DialogExportComponent from "@seldon/components/modules/DialogExportComponent.vue"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { getExportTarget, saveExportTarget } from "@seldon/editor/lib/storage/export-target-store"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

import type { MenuEntry } from "@app/menus/types"
import type { ExportOptions, PlatformId } from "@seldon/factory/export/types"
import type { CSSProperties } from "vue"

const ICON_CHECKED = "material-radioButtonChecked"
const ICON_UNCHECKED = "material-radioButtonUnchecked"

/** Upper bound on a workspace name, matching the inline project rename. */
const MAX_WORKSPACE_NAME_LENGTH = 200

const EXPORT_PLATFORM_OPTIONS = PLATFORM_LIST.map((platform) => ({
  id: platform.id,
  label: platform.label,
  available: platform.status === "available",
}))

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const dispatch = useDispatch()
const save = useWorkspaceSaveStore()
const { record } = storeToRefs(save)
const exportStatus = useExportStatusStore()
const toast = useToastStore()
const { isExporting, cancelExport } = storeToRefs(exportStatus)
const { exportToFolder } = useImportExport()
const workspaceId = useWorkspaceId()

const isOpen = computed(() => activePanel.value === "export-components")

const platform = ref<PlatformId>("vue")
const includeHidden = ref(false)
const allThemes = ref(false)
const allFonts = ref(false)
const fontLinks = ref(false)
const allIcons = ref(true)
const savedWorkspace = ref(true)
const includeScripts = ref(true)
const directory = ref<FileSystemDirectoryHandle | null>(null)

// Holds what the user typed, including an empty string, so clearing the field
// does not snap back to the fallback name mid-edit.
const nameDraft = ref<string | null>(null)

// An empty label counts as unset, so it falls through to the record name.
const workspaceName = computed(
  () => nameDraft.value ?? (workspace.value.metadata.label || record.value?.name || ""),
)

const directoryLabel = computed(() => directory.value?.name ?? "")
const platformLabel = computed(
  () => EXPORT_PLATFORM_OPTIONS.find((option) => option.id === platform.value)?.label ?? "",
)

// Escape reaches the running export, the same way the Cancel button does.
const { x, y, moveControls } = useDraggableWindow({
  handleClose: cancel,
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

// Typing writes the label so the name travels with the exported workspace copy.
function onNameInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  nameDraft.value = value
  dispatch({ type: "set_workspace_label", payload: { value } })
}

/**
 * Settles the name the field shows into both stores. This also covers the case
 * where the field only ever displayed the fallback record name, so an export
 * that never touched the field still carries a label. Renaming the record is a
 * write to storage, so it waits for the user to finish rather than firing on
 * every keystroke.
 */
function commitName(): void {
  const name = workspaceName.value.trim()
  if (!name || name.length > MAX_WORKSPACE_NAME_LENGTH) return
  if (name !== workspace.value.metadata.label) {
    dispatch({ type: "set_workspace_label", payload: { value: name } })
  }
  if (name !== record.value?.name) {
    void save.saveNow(getCurrentWorkspace(), { name })
  }
}

function commitNameOnEnter(event: KeyboardEvent): void {
  if (event.key !== "Enter") return
  event.preventDefault()
  commitName()
  const input = event.currentTarget as HTMLInputElement
  input.blur()
}

/** Remembers the pick itself, so choosing a folder and cancelling still sticks. */
async function chooseDirectory(): Promise<void> {
  const picked = await pickExportDirectory()

  if (!picked) {
    toast.addToast("Folder picking is not supported in this browser")

    return
  }

  directory.value = picked

  const id = workspaceId.value

  if (id) await saveExportTarget(id, picked)
}

// The Export button dims while an export runs, but the guard is here so a second
// run cannot start however the click arrived. Exporting with no folder chosen
// opens the picker, which is what the field itself does.
async function runExport(): Promise<void> {
  if (isExporting.value) return
  commitName()
  const options: Partial<ExportOptions> = {
    target: { framework: platform.value, styles: "css-properties" },
    includeHiddenComponents: includeHidden.value,
    exportAllThemes: allThemes.value,
    exportAllFontCollections: allFonts.value,
    enableRemoteFonts: fontLinks.value,
    exportAllIconSetIcons: allIcons.value,
    includeWorkspace: savedWorkspace.value,
    includeScripts: includeScripts.value,
  }

  await exportToFolder(options, directory.value ?? undefined)
  close()
}

/**
 * The dialog's one dismissal. It stops a running export, which then closes the
 * dialog on its own once the write loop returns, and otherwise just closes.
 */
function cancel(): void {
  if (isExporting.value) {
    cancelExport.value?.()

    return
  }

  close()
}

// The backdrop and the title bar are not a cancel, so neither stops an export.
function closeUnlessExporting(): void {
  if (isExporting.value) return

  close()
}

function reset(): void {
  platform.value = "vue"
  includeHidden.value = false
  allThemes.value = false
  allFonts.value = false
  fontLinks.value = false
  allIcons.value = true
  savedWorkspace.value = true
  includeScripts.value = true
  directory.value = null
  nameDraft.value = null
}

function close(): void {
  reset()
  panel.closePanel()
}

// Offers the folder this workspace last exported into. A pick that lands while
// this is in flight wins, since the user asked for it more recently.
watch(isOpen, (open) => {
  if (!open) return

  x.set(0)
  y.set(0)

  const id = workspaceId.value

  if (!id) return

  void getExportTarget(id).then((target) => {
    if (target) directory.value ??= target.directory
  })
})

const styles: Record<string, CSSProperties> = {
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  pointer: { cursor: "pointer" },

  // Only Export dims, so Cancel and the title bar stay usable during a run. Its
  // pointer events go with it, which is what stops a second export from landing.
  busy: { opacity: 0.5, pointerEvents: "none" },

  // Every control here holds one resting appearance. The generated hover and
  // press rules dim a control to 0.8 and 0.6 opacity, which on a hairline
  // border reads as the border dropping out, and the row rules also tint the
  // background. Only an inline value outranks a generated pseudo-class rule.
  opaque: { opacity: 1 },
  opaquePointer: { cursor: "pointer", opacity: 1 },
  radioItem: { cursor: "pointer", backgroundColor: "transparent" },
}

// Display-only slots ship baked authored copy, so an empty object turns them on.
// Interactive behavior rides in through `seldonRefs`.
const showSlot = {}

/** Radio copy, held opaque so the row states cannot dim it. */
const radioLabel = { style: styles.opaque }

// Wires a Yes/No radio item: checked state, role, and its select handler.
function radioItem(checked: boolean, onSelect: () => void) {
  return {
    onClick: onSelect,
    role: "radio",
    "aria-checked": checked ? "true" : "false",
    "aria-selected": checked || undefined,
    style: styles.radioItem,
  }
}

/** The dot glyph for one side of a Yes/No pair. */
function radioDot(checked: boolean) {
  return { icon: checked ? ICON_CHECKED : ICON_UNCHECKED, style: styles.opaque }
}

/** Names a Yes/No pair as one group, since each row is its own radio group. */
function radioGroup(label: string) {
  return { role: "radiogroup", "aria-label": label }
}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))

// The whole field opens the platform menu, so the chevron works like the input.
const platformField = computed(() => ({
  onClick: openPlatform,
  "aria-expanded": platformOpen.value,
  style: styles.pointer,
}))

const seldonRefs = computed(() => ({
  exportWorkspaceName: {
    value: workspaceName.value,
    placeholder: "Untitled workspace",
    onInput: onNameInput,
    onBlur: commitName,
    onKeydown: commitNameOnEnter,
    style: styles.opaque,
  },
  exportRootPath: {
    value: directoryLabel.value,
    placeholder: "Choose a folder…",
    readonly: true,
    onClick: chooseDirectory,
    style: styles.opaquePointer,
  },
  exportPlatform: {
    value: platformLabel.value,
    readonly: true,
    style: styles.opaquePointer,
  },

  exportFontLinksYes: radioItem(fontLinks.value, () => (fontLinks.value = true)),
  exportFontLinksYesIcon: radioDot(fontLinks.value),
  exportFontLinksNo: radioItem(!fontLinks.value, () => (fontLinks.value = false)),
  exportFontLinksNoIcon: radioDot(!fontLinks.value),

  exportHiddenYes: radioItem(includeHidden.value, () => (includeHidden.value = true)),
  exportHiddenYesIcon: radioDot(includeHidden.value),
  exportHiddenNo: radioItem(!includeHidden.value, () => (includeHidden.value = false)),
  exportHiddenNoIcon: radioDot(!includeHidden.value),

  exportAllThemesYes: radioItem(allThemes.value, () => (allThemes.value = true)),
  exportAllThemesYesIcon: radioDot(allThemes.value),
  exportAllThemesNo: radioItem(!allThemes.value, () => (allThemes.value = false)),
  exportAllThemesNoIcon: radioDot(!allThemes.value),

  exportAllFontsYes: radioItem(allFonts.value, () => (allFonts.value = true)),
  exportAllFontsYesIcon: radioDot(allFonts.value),
  exportAllFontsNo: radioItem(!allFonts.value, () => (allFonts.value = false)),
  exportAllFontsNoIcon: radioDot(!allFonts.value),

  exportAllIconsYes: radioItem(allIcons.value, () => (allIcons.value = true)),
  exportAllIconsYesIcon: radioDot(allIcons.value),
  exportAllIconsNo: radioItem(!allIcons.value, () => (allIcons.value = false)),
  exportAllIconsNoIcon: radioDot(!allIcons.value),

  exportSavedWorkspaceYes: radioItem(savedWorkspace.value, () => (savedWorkspace.value = true)),
  exportSavedWorkspaceYesIcon: radioDot(savedWorkspace.value),
  exportSavedWorkspaceNo: radioItem(!savedWorkspace.value, () => (savedWorkspace.value = false)),
  exportSavedWorkspaceNoIcon: radioDot(!savedWorkspace.value),

  exportScriptsYes: radioItem(includeScripts.value, () => (includeScripts.value = true)),
  exportScriptsYesIcon: radioDot(includeScripts.value),
  exportScriptsNo: radioItem(!includeScripts.value, () => (includeScripts.value = false)),
  exportScriptsNoIcon: radioDot(!includeScripts.value),

  exportCancel: { onClick: cancel },
  exportConfirm: {
    onClick: runExport,
    "aria-disabled": isExporting.value,
    style: isExporting.value ? styles.busy : undefined,
  },
}))
</script>

<template>
  <WindowSurface
    v-if="isOpen"
    modal
    content-sized
    :on-close="closeUnlessExporting"
    :x="x"
    :y="y"
    :move-controls="moveControls"
  >
    <DialogExportComponent
      data-testid="export-components-dialog"
      :aria-busy="isExporting"
      :bar="barHandle"
      :text-title="showSlot"
      :form-control="showSlot"
      :text-label="showSlot"
      :form-control2="showSlot"
      :text-label2="showSlot"
      :form-control3="showSlot"
      :text-label3="showSlot"
      :combobox-field="platformField"
      :form-control-radio="radioGroup('Generate Google Font API Links')"
      :text-label4="showSlot"
      :menu-item-radio="showSlot"
      :text-label5="radioLabel"
      :menu-item-radio2="showSlot"
      :text-label6="radioLabel"
      :fieldset="showSlot"
      :form-control-radio2="radioGroup('Hidden Components')"
      :text-label7="showSlot"
      :menu-item-radio3="showSlot"
      :text-label8="radioLabel"
      :menu-item-radio4="showSlot"
      :text-label9="radioLabel"
      :form-control-radio3="radioGroup('All Themes')"
      :text-label10="showSlot"
      :menu-item-radio5="showSlot"
      :text-label11="radioLabel"
      :menu-item-radio6="showSlot"
      :text-label12="radioLabel"
      :form-control-radio4="radioGroup('All Enabled Fonts')"
      :text-label13="showSlot"
      :menu-item-radio7="showSlot"
      :text-label14="radioLabel"
      :menu-item-radio8="showSlot"
      :text-label15="radioLabel"
      :form-control-radio5="radioGroup('All Enabled Icons')"
      :text-label16="showSlot"
      :menu-item-radio9="showSlot"
      :text-label17="radioLabel"
      :menu-item-radio10="showSlot"
      :text-label18="radioLabel"
      :form-control-radio6="radioGroup('Saved Workspace')"
      :text-label19="showSlot"
      :menu-item-radio11="showSlot"
      :text-label20="radioLabel"
      :menu-item-radio12="showSlot"
      :text-label21="radioLabel"
      :form-control-radio7="radioGroup('CLI Utility Scripts')"
      :text-label22="showSlot"
      :menu-item-radio13="showSlot"
      :text-label23="radioLabel"
      :menu-item-radio14="showSlot"
      :text-label24="radioLabel"
      :text-label25="showSlot"
      :text-label26="showSlot"
      :seldon-refs="seldonRefs"
    />
    <MenuController
      :open="platformOpen"
      :anchor="platformAnchor"
      :items="platformItems"
      @close="closePlatform"
    />
  </WindowSurface>
</template>
