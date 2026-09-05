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
import { scanExportRoot } from "@seldon/editor/lib/export/scan-export-root"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { getExportTarget, saveExportTarget } from "@seldon/editor/lib/storage/export-target-store"
import { EXPORT_FLAGS } from "@seldon/factory/export/options"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import { FRAMEWORK_IDS, resolveOutputLayout } from "@seldon/factory/export/presets"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

import type { MenuEntry } from "@app/menus/types"
import type { WorkspaceExportSettings } from "@seldon/core"
import type { LocalExportOptions } from "@seldon/editor/lib/export/run-local-export"
import type { ExportFlagDescriptor, ExportScopeFlags } from "@seldon/factory/export/options"
import type { FrameworkId } from "@seldon/factory/export/presets"
import type { PlatformId } from "@seldon/factory/export/types"
import type { CSSProperties } from "vue"

/** Upper bound on a workspace name, matching the inline project rename. */
const MAX_WORKSPACE_NAME_LENGTH = 200

/**
 * Every scope flag keyed by its store name, so the dialog reads its group label
 * and aria-label from the shared export flag descriptors. This keeps the copy in
 * step with the CLI and the MCP host, and a flag rename lands here without
 * editing the design.
 */
const EXPORT_FLAG = EXPORT_FLAGS.reduce(
  (lookup, flag) => ({ ...lookup, [flag.storeKey]: flag }),
  {} as Record<keyof ExportScopeFlags, ExportFlagDescriptor>,
)

const EXPORT_PLATFORM_OPTIONS = PLATFORM_LIST.map((platform) => ({
  id: platform.id,
  label: platform.label,
  available: platform.status === "available",
}))

/** Display labels for each framework layout, keyed by id. */
const FRAMEWORK_LABELS: Record<FrameworkId, string> = {
  none: "None",
  vite: "Vite",
  next: "Next.js",
  nuxt: "Nuxt",
  sveltekit: "SvelteKit",
  astro: "Astro",
  remix: "Remix",
}

/** Layouts verified in the editor export. Others show as "soon" until proven. */
const AVAILABLE_FRAMEWORKS = new Set<FrameworkId>(["none", "vite", "next"])

/**
 * Project layouts shown in the dialog picker, in registry order. `none` writes
 * to the output root; the others match a framework's folder layout.
 */
const EXPORT_FRAMEWORK_OPTIONS = FRAMEWORK_IDS.map((id) => ({
  id,
  label: FRAMEWORK_LABELS[id],
  available: AVAILABLE_FRAMEWORKS.has(id),
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

// Platform, framework, and the scope toggles come from a persisted store, so
// reopening the dialog restores the last-used selections instead of defaults.
const options = useExportOptionsStore()
const {
  platform,
  framework,
  includeHidden,
  allThemes,
  allFonts,
  fontLinks,
  allIcons,
  savedWorkspace,
  includeScripts,
} = storeToRefs(options)
const directory = ref<FileSystemDirectoryHandle | null>(null)
const outputFolder = ref(workspace.value.metadata.exportSettings?.outputFolder ?? "")
const platformTouched = ref(false)
const frameworkTouched = ref(false)
const outputFolderTouched = ref(false)

/** The store's current selections as one settings block, ready to persist. */
function buildExportSettings(): WorkspaceExportSettings {
  return {
    platform: platform.value,
    framework: framework.value,
    outputFolder: outputFolder.value || undefined,
    fontLinks: fontLinks.value,
    allFonts: allFonts.value,
    allIcons: allIcons.value,
    allThemes: allThemes.value,
    includeHidden: includeHidden.value,
    savedWorkspace: savedWorkspace.value,
    includeScripts: includeScripts.value,
  }
}

/** Seeds the store from the workspace's saved settings when it has any. */
function seedFromWorkspace(): void {
  const saved = workspace.value.metadata.exportSettings

  platformTouched.value = false
  frameworkTouched.value = false
  outputFolderTouched.value = false
  outputFolder.value = saved?.outputFolder ?? ""

  if (!saved) return

  if (saved.platform) platform.value = saved.platform as PlatformId
  if (saved.framework) framework.value = saved.framework as FrameworkId
  if (saved.includeHidden !== undefined) includeHidden.value = saved.includeHidden
  if (saved.allThemes !== undefined) allThemes.value = saved.allThemes
  if (saved.allFonts !== undefined) allFonts.value = saved.allFonts
  if (saved.fontLinks !== undefined) fontLinks.value = saved.fontLinks
  if (saved.allIcons !== undefined) allIcons.value = saved.allIcons
  if (saved.savedWorkspace !== undefined) savedWorkspace.value = saved.savedWorkspace
  if (saved.includeScripts !== undefined) includeScripts.value = saved.includeScripts
}

// Metadata is the source of truth. A store change writes the full settings block
// to the workspace, so the target and scope travel with the file and the CLI and
// MCP export it the same way.
watch(
  [
    platform,
    framework,
    outputFolder,
    includeHidden,
    allThemes,
    allFonts,
    fontLinks,
    allIcons,
    savedWorkspace,
    includeScripts,
  ],
  () => {
    dispatch({ type: "set_workspace_export_settings", payload: { value: buildExportSettings() } })
  },
)

// Holds what the user typed, including an empty string, so clearing the field
// does not snap back to the stored name mid-edit.
const nameDraft = ref<string | null>(null)

const workspaceName = computed(() => nameDraft.value ?? workspace.value.metadata.label ?? "")

const directoryLabel = computed(() => directory.value?.name ?? "")
const platformLabel = computed(
  () => EXPORT_PLATFORM_OPTIONS.find((option) => option.id === platform.value)?.label ?? "",
)
const frameworkLabel = computed(
  () => EXPORT_FRAMEWORK_OPTIONS.find((option) => option.id === framework.value)?.label ?? "",
)

// Escape reaches the running export, the same way the Cancel button does.
const { x, y, moveControls } = useDraggableWindow({
  handleClose: cancel,
  contentSized: true,
})

const platformOpen = ref(false)
const platformAnchor = ref<HTMLElement | null>(null)
const frameworkOpen = ref(false)
const frameworkAnchor = ref<HTMLElement | null>(null)

const platformItems = computed<MenuEntry[]>(() =>
  EXPORT_PLATFORM_OPTIONS.map((option) => ({
    id: option.id,
    label: option.available ? option.label : `${option.label} (soon)`,
    selected: option.id === platform.value,
    active: option.id === platform.value,
    activeMarker: "bullet",
    disabled: !option.available,
    onSelect: () => {
      platformTouched.value = true
      platform.value = option.id
    },
  })),
)

const frameworkItems = computed<MenuEntry[]>(() =>
  EXPORT_FRAMEWORK_OPTIONS.map((option) => ({
    id: option.id,
    label: option.available ? option.label : `${option.label} (soon)`,
    selected: option.id === framework.value,
    active: option.id === framework.value,
    activeMarker: "bullet",
    disabled: !option.available,
    onSelect: () => {
      frameworkTouched.value = true
      framework.value = option.id
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
function openFramework(event: MouseEvent): void {
  frameworkAnchor.value = event.currentTarget as HTMLElement
  frameworkOpen.value = true
}
function closeFramework(): void {
  frameworkOpen.value = false
}

// Typing writes the label so the name travels with the exported workspace copy.
function onNameInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  nameDraft.value = value
  dispatch({ type: "set_workspace_label", payload: { value } })
}

function onOutputFolderInput(event: Event): void {
  outputFolderTouched.value = true
  outputFolder.value = (event.target as HTMLInputElement).value
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

  const scan = await scanExportRoot(picked, id, workspace.value.metadata.label)

  if (!platformTouched.value && scan.platform) platform.value = scan.platform
  if (!frameworkTouched.value && scan.framework) framework.value = scan.framework
  if (!outputFolderTouched.value && scan.hasOwnedExport) {
    outputFolder.value = scan.outputFolder ?? ""
  }
}

// The Export button dims while an export runs, but the guard is here so a second
// run cannot start however the click arrived. Exporting with no folder chosen
// opens the picker, which is what the field itself does.
async function runExport(): Promise<void> {
  if (isExporting.value) return
  commitName()
  // Persist the exact settings this export used, so an untouched dialog still
  // writes a complete block the CLI and MCP can honor.
  dispatch({ type: "set_workspace_export_settings", payload: { value: buildExportSettings() } })
  const options: LocalExportOptions = {
    target: { framework: platform.value, styles: "css-properties" },
    output: resolveOutputLayout(framework.value),
    includeHiddenComponents: includeHidden.value,
    exportAllThemes: allThemes.value,
    exportAllFontCollections: allFonts.value,
    enableRemoteFonts: fontLinks.value,
    exportAllIconSetIcons: allIcons.value,
    includeWorkspace: savedWorkspace.value,
    includeScripts: includeScripts.value,
    outputFolder: outputFolder.value,
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
  platformTouched.value = false
  frameworkTouched.value = false
  outputFolderTouched.value = false
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

  seedFromWorkspace()

  const id = workspaceId.value

  if (!id) return

  void getExportTarget(id).then((target) => {
    if (target) directory.value ??= target.directory
  })
})

const styles: Record<string, CSSProperties> = {
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },

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

/** Widens a row's hit area so a click beside the bullet still selects it. */
function radioRow(onSelect: () => void) {
  return { onClick: onSelect, style: styles.radioRow }
}

/** Wires a native radio to its group name, its checked state, and what it sets. */
function radioInput(group: string, checked: boolean, onSelect: () => void) {
  return { name: group, checked, onChange: onSelect }
}

const barHandle = computed(() => ({
  onPointerdown: startDrag,
  style: styles.dragHandle,
}))

// The dialog addresses every slot by its `data-seldon-ref` name rather than a
// positional prop, so adding or reordering fields cannot silently drop a control.
// Authored as one flat literal with static keys, never a loop or computed keys,
// so the bindings scanner reads every ref; see `.cursor/rules/foundation-editor-jsx.mdc`.
// Display-only slots turn on with an empty object; behavior rides in per ref.
const seldonRefs = computed<Record<string, Record<string, unknown>>>(() => ({
  exportTitle: { children: "Export Components" },

  exportWorkspaceName: {},
  exportWorkspaceNameLabel: { children: "Workspace Name" },
  exportWorkspaceNameField: {
    value: workspaceName.value,
    placeholder: "Untitled workspace",
    onInput: onNameInput,
    onBlur: commitName,
    onKeydown: commitNameOnEnter,
    style: styles.opaque,
  },

  exportProjectFolder: {},
  exportProjectFolderLabel: { children: "Root Folder" },
  exportProjectFolderField: {
    value: directoryLabel.value,
    placeholder: "Choose a folder…",
    readonly: true,
    onClick: chooseDirectory,
    style: styles.opaquePointer,
  },

  exportFramework: {},
  exportFrameworkLabel: { children: "App Framework" },
  exportFrameworkCombobox: {},
  exportFrameworkField: {
    value: frameworkLabel.value,
    readonly: true,
    onClick: openFramework,
    "aria-expanded": frameworkOpen.value,
    style: styles.opaquePointer,
  },

  exportPlatform: {},
  exportPlatformLabel: { children: "Component Type" },
  exportPlatformCombobox: {},
  exportPlatformField: {
    value: platformLabel.value,
    readonly: true,
    onClick: openPlatform,
    "aria-expanded": platformOpen.value,
    style: styles.opaquePointer,
  },

  exportOutputFolder: {},
  exportOutputFolderLabel: { children: "Export To" },
  exportOutputFolderField: {
    value: outputFolder.value,
    placeholder: "Project root",
    onInput: onOutputFolderInput,
    style: styles.opaque,
  },

  exportFieldset: {},
  exportFieldsetLabel: { children: "Include" },

  // Scope groups. Every key is spelled out, never built in a loop, so the
  // bindings scanner records each ref. The container holds the radiogroup role,
  // each row widens the hit area, and each native input holds the group name plus
  // checked state.
  exportFontLinks: { role: "radiogroup", "aria-label": EXPORT_FLAG.fontLinks.ariaLabel },
  exportFontLinksLabel: { children: EXPORT_FLAG.fontLinks.label },
  exportFontLinksYes: radioRow(() => (fontLinks.value = true)),
  exportFontLinksYesInput: radioInput(
    "export-font-links",
    fontLinks.value,
    () => (fontLinks.value = true),
  ),
  exportFontLinksYesText: { children: "Yes" },
  exportFontLinksNo: radioRow(() => (fontLinks.value = false)),
  exportFontLinksNoInput: radioInput(
    "export-font-links",
    !fontLinks.value,
    () => (fontLinks.value = false),
  ),
  exportFontLinksNoText: { children: "No" },

  exportHidden: { role: "radiogroup", "aria-label": EXPORT_FLAG.includeHidden.ariaLabel },
  exportHiddenLabel: { children: EXPORT_FLAG.includeHidden.label },
  exportHiddenYes: radioRow(() => (includeHidden.value = true)),
  exportHiddenYesInput: radioInput(
    "export-hidden",
    includeHidden.value,
    () => (includeHidden.value = true),
  ),
  exportHiddenYesText: { children: "Yes" },
  exportHiddenNo: radioRow(() => (includeHidden.value = false)),
  exportHiddenNoInput: radioInput(
    "export-hidden",
    !includeHidden.value,
    () => (includeHidden.value = false),
  ),
  exportHiddenNoText: { children: "No" },

  exportAllThemes: { role: "radiogroup", "aria-label": EXPORT_FLAG.allThemes.ariaLabel },
  exportAllThemesLabel: { children: EXPORT_FLAG.allThemes.label },
  exportAllThemesYes: radioRow(() => (allThemes.value = true)),
  exportAllThemesYesInput: radioInput(
    "export-all-themes",
    allThemes.value,
    () => (allThemes.value = true),
  ),
  exportAllThemesYesText: { children: "Yes" },
  exportAllThemesNo: radioRow(() => (allThemes.value = false)),
  exportAllThemesNoInput: radioInput(
    "export-all-themes",
    !allThemes.value,
    () => (allThemes.value = false),
  ),
  exportAllThemesNoText: { children: "No" },

  exportAllFonts: { role: "radiogroup", "aria-label": EXPORT_FLAG.allFonts.ariaLabel },
  exportAllFontsLabel: { children: EXPORT_FLAG.allFonts.label },
  exportAllFontsYes: radioRow(() => (allFonts.value = true)),
  exportAllFontsYesInput: radioInput(
    "export-all-fonts",
    allFonts.value,
    () => (allFonts.value = true),
  ),
  exportAllFontsYesText: { children: "Yes" },
  exportAllFontsNo: radioRow(() => (allFonts.value = false)),
  exportAllFontsNoInput: radioInput(
    "export-all-fonts",
    !allFonts.value,
    () => (allFonts.value = false),
  ),
  exportAllFontsNoText: { children: "No" },

  exportAllIcons: { role: "radiogroup", "aria-label": EXPORT_FLAG.allIcons.ariaLabel },
  exportAllIconsLabel: { children: EXPORT_FLAG.allIcons.label },
  exportAllIconsYes: radioRow(() => (allIcons.value = true)),
  exportAllIconsYesInput: radioInput(
    "export-all-icons",
    allIcons.value,
    () => (allIcons.value = true),
  ),
  exportAllIconsYesText: { children: "Yes" },
  exportAllIconsNo: radioRow(() => (allIcons.value = false)),
  exportAllIconsNoInput: radioInput(
    "export-all-icons",
    !allIcons.value,
    () => (allIcons.value = false),
  ),
  exportAllIconsNoText: { children: "No" },

  exportWorkspace: { role: "radiogroup", "aria-label": EXPORT_FLAG.savedWorkspace.ariaLabel },
  exportWorkspaceLabel: { children: EXPORT_FLAG.savedWorkspace.label },
  exportWorkspaceYes: radioRow(() => (savedWorkspace.value = true)),
  exportWorkspaceYesInput: radioInput(
    "export-saved-workspace",
    savedWorkspace.value,
    () => (savedWorkspace.value = true),
  ),
  exportWorkspaceYesText: { children: "Yes" },
  exportWorkspaceNo: radioRow(() => (savedWorkspace.value = false)),
  exportWorkspaceNoInput: radioInput(
    "export-saved-workspace",
    !savedWorkspace.value,
    () => (savedWorkspace.value = false),
  ),
  exportWorkspaceNoText: { children: "No" },

  exportScripts: { role: "radiogroup", "aria-label": EXPORT_FLAG.includeScripts.ariaLabel },
  exportScriptsLabel: { children: EXPORT_FLAG.includeScripts.label },
  exportScriptsYes: radioRow(() => (includeScripts.value = true)),
  exportScriptsYesInput: radioInput(
    "export-scripts",
    includeScripts.value,
    () => (includeScripts.value = true),
  ),
  exportScriptsYesText: { children: "Yes" },
  exportScriptsNo: radioRow(() => (includeScripts.value = false)),
  exportScriptsNoInput: radioInput(
    "export-scripts",
    !includeScripts.value,
    () => (includeScripts.value = false),
  ),
  exportScriptsNoText: { children: "No" },

  exportCancel: { onClick: cancel },
  exportCancelLabel: { children: "Cancel" },
  exportConfirm: {
    onClick: runExport,
    "aria-disabled": isExporting.value,
    style: isExporting.value ? styles.busy : undefined,
  },
  exportConfirmLabel: { children: "Export" },
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
      :seldon-refs="seldonRefs"
    />
    <MenuController
      :open="platformOpen"
      :anchor="platformAnchor"
      :items="platformItems"
      @close="closePlatform"
    />
    <MenuController
      :open="frameworkOpen"
      :anchor="frameworkAnchor"
      :items="frameworkItems"
      @close="closeFramework"
    />
  </WindowSurface>
</template>
