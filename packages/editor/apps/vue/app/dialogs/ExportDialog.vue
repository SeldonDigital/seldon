<script setup lang="ts">
import { useExportOptionsStore } from "@app/dialogs/export-options-store"
import { usePanelStore } from "@app/editor/panel-store"
import { useExportStatusStore } from "@app/io/export-status-store"
import { useImportExport } from "@app/io/use-import-export"
import MenuController from "@app/menus/MenuController.vue"
import { useWorkspaceId } from "@app/project/use-workspace-id"
import { useToastStore } from "@app/toaster/toast-store"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { useDraggableWindow } from "@app/windows/use-draggable-window"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useWorkspace } from "@app/workspace/use-workspace"
import DialogExportComponent from "@seldon/components/modules/DialogExportComponent.vue"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { getExportTarget, saveExportTarget } from "@seldon/editor/lib/storage/export-target-store"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

import type { MenuEntry } from "@app/menus/types"
import type { ExportOptions } from "@seldon/factory/export/types"
import type { CSSProperties } from "vue"

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
const exportStatus = useExportStatusStore()
const toast = useToastStore()
const { isExporting, cancelExport } = storeToRefs(exportStatus)
const { exportToFolder } = useImportExport()
const workspaceId = useWorkspaceId()

const isOpen = computed(() => activePanel.value === "export-components")

// Platform and the scope toggles come from a persisted store, so reopening the
// dialog restores the last-used selections instead of the defaults.
const options = useExportOptionsStore()
const {
  platform,
  includeHidden,
  allThemes,
  allFonts,
  fontLinks,
  allIcons,
  savedWorkspace,
  includeScripts,
} = storeToRefs(options)
const directory = ref<FileSystemDirectoryHandle | null>(null)

// Holds what the user typed, including an empty string, so clearing the field
// does not snap back to the stored name mid-edit.
const nameDraft = ref<string | null>(null)

const workspaceName = computed(() => nameDraft.value ?? workspace.value.metadata.label ?? "")

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

/** Settles the trimmed name the field shows into the workspace label. */
function commitName(): void {
  const name = workspaceName.value.trim()
  if (!name || name.length > MAX_WORKSPACE_NAME_LENGTH) return
  if (name !== workspace.value.metadata.label) {
    dispatch({ type: "set_workspace_label", payload: { value: name } })
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

// Clears only the per-open local state. Platform and the scope toggles persist in
// their own store, so a close keeps them for the next open. The folder refills
// from storage on open, and the name re-derives from the label.
function reset(): void {
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

  // Only Export takes its disabled look during a run, so Cancel and the title bar
  // stay usable. Its pointer events go with it, which stops a second export from
  // landing; the muted appearance comes from the button's own aria-disabled styling.
  busy: { pointerEvents: "none" },

  // Every control here holds one resting appearance. The generated hover and
  // press rules dim a control to 0.8 and 0.6 opacity, which on a hairline
  // border reads as the border dropping out, and the row rules also tint the
  // background. Only an inline value outranks a generated pseudo-class rule.
  opaque: { opacity: 1 },
  opaquePointer: { cursor: "pointer", opacity: 1 },
  radioRow: { cursor: "pointer" },
}

// Display-only slots ship baked authored copy, so an empty object turns them on.
// Interactive behavior rides in through `seldonRefs`.
const showSlot = {}

/** Widens a row's hit area so a click beside the bullet still selects it. */
function radioRow(onSelect: () => void) {
  return { onClick: onSelect, style: styles.radioRow }
}

/** Wires a native radio to its group name, its checked state, and what it sets. */
function radioInput(group: string, checked: boolean, onSelect: () => void) {
  return { name: group, checked, onChange: onSelect }
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

  exportFontLinksYes: radioRow(() => (fontLinks.value = true)),
  exportFontLinksNo: radioRow(() => (fontLinks.value = false)),

  exportHiddenYes: radioRow(() => (includeHidden.value = true)),
  exportHiddenNo: radioRow(() => (includeHidden.value = false)),

  exportAllThemesYes: radioRow(() => (allThemes.value = true)),
  exportAllThemesNo: radioRow(() => (allThemes.value = false)),

  exportAllFontsYes: radioRow(() => (allFonts.value = true)),
  exportAllFontsNo: radioRow(() => (allFonts.value = false)),

  exportAllIconsYes: radioRow(() => (allIcons.value = true)),
  exportAllIconsNo: radioRow(() => (allIcons.value = false)),

  exportSavedWorkspaceYes: radioRow(() => (savedWorkspace.value = true)),
  exportSavedWorkspaceNo: radioRow(() => (savedWorkspace.value = false)),

  exportScriptsYes: radioRow(() => (includeScripts.value = true)),
  exportScriptsNo: radioRow(() => (includeScripts.value = false)),

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
      :form-control-radio-button-control="showSlot"
      :input-radio-button="radioInput('export-font-links', fontLinks, () => (fontLinks = true))"
      :text-label5="showSlot"
      :form-control-radio-button-control2="showSlot"
      :input-radio-button2="radioInput('export-font-links', !fontLinks, () => (fontLinks = false))"
      :text-label6="showSlot"
      :fieldset="showSlot"
      :form-control-radio2="radioGroup('Hidden Components')"
      :text-label7="showSlot"
      :form-control-radio-button-control3="showSlot"
      :input-radio-button3="
        radioInput('export-hidden', includeHidden, () => (includeHidden = true))
      "
      :text-label8="showSlot"
      :form-control-radio-button-control4="showSlot"
      :input-radio-button4="
        radioInput('export-hidden', !includeHidden, () => (includeHidden = false))
      "
      :text-label9="showSlot"
      :form-control-radio3="radioGroup('All Themes')"
      :text-label10="showSlot"
      :form-control-radio-button-control5="showSlot"
      :input-radio-button5="radioInput('export-all-themes', allThemes, () => (allThemes = true))"
      :text-label11="showSlot"
      :form-control-radio-button-control6="showSlot"
      :input-radio-button6="radioInput('export-all-themes', !allThemes, () => (allThemes = false))"
      :text-label12="showSlot"
      :form-control-radio4="radioGroup('All Enabled Fonts')"
      :text-label13="showSlot"
      :form-control-radio-button-control7="showSlot"
      :input-radio-button7="radioInput('export-all-fonts', allFonts, () => (allFonts = true))"
      :text-label14="showSlot"
      :form-control-radio-button-control8="showSlot"
      :input-radio-button8="radioInput('export-all-fonts', !allFonts, () => (allFonts = false))"
      :text-label15="showSlot"
      :form-control-radio5="radioGroup('All Enabled Icons')"
      :text-label16="showSlot"
      :form-control-radio-button-control9="showSlot"
      :input-radio-button9="radioInput('export-all-icons', allIcons, () => (allIcons = true))"
      :text-label17="showSlot"
      :form-control-radio-button-control10="showSlot"
      :input-radio-button10="radioInput('export-all-icons', !allIcons, () => (allIcons = false))"
      :text-label18="showSlot"
      :form-control-radio6="radioGroup('Saved Workspace')"
      :text-label19="showSlot"
      :form-control-radio-button-control11="showSlot"
      :input-radio-button11="
        radioInput('export-saved-workspace', savedWorkspace, () => (savedWorkspace = true))
      "
      :text-label20="showSlot"
      :form-control-radio-button-control12="showSlot"
      :input-radio-button12="
        radioInput('export-saved-workspace', !savedWorkspace, () => (savedWorkspace = false))
      "
      :text-label21="showSlot"
      :form-control-radio7="radioGroup('CLI Utility Scripts')"
      :text-label22="showSlot"
      :form-control-radio-button-control13="showSlot"
      :input-radio-button13="
        radioInput('export-scripts', includeScripts, () => (includeScripts = true))
      "
      :text-label23="showSlot"
      :form-control-radio-button-control14="showSlot"
      :input-radio-button14="
        radioInput('export-scripts', !includeScripts, () => (includeScripts = false))
      "
      :text-label24="showSlot"
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
