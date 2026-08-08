"use client"

import { MenuController } from "@app/menus/MenuController"
import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { DialogExportComponent } from "@seldon/components/modules/DialogExportComponent"
import { useCallback, useMemo, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import {
  EXPORT_FRAMEWORK_OPTIONS,
  EXPORT_PLATFORM_OPTIONS,
  useExportComponentsPanel,
} from "./hooks/use-export-components-panel"

import type { MenuEntry } from "@app/menus/types"
import type { SeldonRefs } from "@seldon/components/utils/merge-slot"
import type { CSSProperties, ChangeEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react"

/**
 * Gate for the Export Components dialog. Mounts the dialog only while the
 * "export-components" panel is active so it recenters on each open, matching the
 * other catalog dialogs.
 */
export function ExportComponentsController() {
  const panel = useExportComponentsPanel()

  if (!panel.isOpen) return null

  return <ExportComponentsDialog {...panel} />
}

type ExportComponentsDialogProps = ReturnType<typeof useExportComponentsPanel>

/**
 * View-model for the Export Components dialog. Renders the authored
 * `DialogExportComponent`, which supplies all copy, icons, and placeholders as
 * baked defaults. This controller only wires behavior, and it addresses every
 * slot by its `data-seldon-ref` name rather than a positional prop, so adding or
 * reordering fields in the dialog cannot silently drop a control.
 */
function ExportComponentsDialog({
  workspaceName,
  setWorkspaceName,
  commitWorkspaceName,
  platform,
  setPlatform,
  framework,
  setFramework,
  includeHidden,
  setIncludeHidden,
  allThemes,
  setAllThemes,
  allFonts,
  setAllFonts,
  fontLinks,
  setFontLinks,
  allIcons,
  setAllIcons,
  savedWorkspace,
  setSavedWorkspace,
  includeScripts,
  setIncludeScripts,
  directory,
  chooseDirectory,
  exporting,
  save,
  cancel,
  close,
}: ExportComponentsDialogProps) {
  // Dismissing by clicking away or by the surface's own control must not stop an
  // export, because neither reads as "cancel". Only Cancel and Esc do that.
  const closeUnlessExporting = useCallback(() => {
    if (exporting) return

    close()
  }, [exporting, close])

  useHotkeys("esc", cancel)

  const { x, y, moveControls } = useDraggableWindow({
    handleClose: closeUnlessExporting,
    contentSized: true,
    closeOnEscape: false,
  })
  const startDrag = useCallback((event: PointerEvent) => moveControls.start(event), [moveControls])

  const [platformOpen, setPlatformOpen] = useState(false)
  const platformAnchorRef = useRef<HTMLElement | null>(null)
  const [frameworkOpen, setFrameworkOpen] = useState(false)
  const frameworkAnchorRef = useRef<HTMLElement | null>(null)

  const openPlatform = useCallback((event: MouseEvent) => {
    platformAnchorRef.current = event.currentTarget as HTMLElement
    setPlatformOpen(true)
  }, [])
  const closePlatform = useCallback(() => setPlatformOpen(false), [])

  const openFramework = useCallback((event: MouseEvent) => {
    frameworkAnchorRef.current = event.currentTarget as HTMLElement
    setFrameworkOpen(true)
  }, [])
  const closeFramework = useCallback(() => setFrameworkOpen(false), [])

  const platformLabel = useMemo(
    () => EXPORT_PLATFORM_OPTIONS.find((option) => option.id === platform)?.label ?? "",
    [platform],
  )
  const platformItems = useMemo<MenuEntry[]>(
    () =>
      EXPORT_PLATFORM_OPTIONS.map((option) => ({
        id: option.id,
        label: option.available ? option.label : `${option.label} (soon)`,
        selected: option.id === platform,
        active: option.id === platform,
        activeMarker: "bullet",
        disabled: !option.available,
        onSelect: () => setPlatform(option.id),
      })),
    [platform, setPlatform],
  )

  const frameworkLabel = useMemo(
    () => EXPORT_FRAMEWORK_OPTIONS.find((option) => option.id === framework)?.label ?? "",
    [framework],
  )
  const frameworkItems = useMemo<MenuEntry[]>(
    () =>
      EXPORT_FRAMEWORK_OPTIONS.map((option) => ({
        id: option.id,
        label: option.available ? option.label : `${option.label} (soon)`,
        selected: option.id === framework,
        active: option.id === framework,
        activeMarker: "bullet",
        disabled: !option.available,
        onSelect: () => setFramework(option.id),
      })),
    [framework, setFramework],
  )

  const changeWorkspaceName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setWorkspaceName(event.target.value),
    [setWorkspaceName],
  )

  // Renaming the stored record is a write to the dev server, so it waits for the
  // user to finish rather than firing on every keystroke.
  const commitNameOnEnter = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return
      event.preventDefault()
      commitWorkspaceName()
      event.currentTarget.blur()
    },
    [commitWorkspaceName],
  )

  const directoryLabel = directory?.name ?? ""

  // Only Export takes its disabled look during a run, so Cancel and the title bar
  // stay usable. Its pointer events go with it, which stops a second export from
  // landing; the muted appearance comes from the button's own aria-disabled styling.
  const confirmStyle = exporting ? styles.busy : undefined

  const barHandle = useMemo(
    () => ({ onPointerDown: startDrag, style: styles.dragHandle }),
    [startDrag],
  )

  // The dialog addresses every slot by its `data-seldon-ref` name rather than a
  // positional prop, so adding or reordering fields cannot silently drop a
  // control. Authored as a flat object literal with static keys, never a loop or
  // computed keys, so the bindings scanner reads every ref; see
  // `.cursor/rules/foundation-editor-jsx.mdc`. Display-only slots turn on with an empty
  // object; behavior rides in per ref.
  const seldonRefs: SeldonRefs = {
    exportTitle: {},

    exportWorkspaceName: {},
    exportWorkspaceNameLabel: {},
    exportWorkspaceNameField: {
      value: workspaceName,
      placeholder: "Untitled workspace",
      onChange: changeWorkspaceName,
      onBlur: commitWorkspaceName,
      onKeyDown: commitNameOnEnter,
      style: styles.opaque,
    },

    exportFramework: {},
    exportFrameworkLabel: {},
    exportFrameworkCombobox: {},
    exportFrameworkField: {
      value: frameworkLabel,
      readOnly: true,
      onClick: openFramework,
      "aria-expanded": frameworkOpen,
      style: styles.opaquePointer,
    },

    exportPlatform: {},
    exportPlatformLabel: {},
    exportPlatformCombobox: {},
    exportPlatformField: {
      value: platformLabel,
      readOnly: true,
      onClick: openPlatform,
      "aria-expanded": platformOpen,
      style: styles.opaquePointer,
    },

    exportProjectFolder: {},
    exportProjectFolderLabel: {},
    exportProjectFolderField: {
      value: directoryLabel,
      placeholder: "Choose a folder…",
      readOnly: true,
      onClick: chooseDirectory,
      style: styles.opaquePointer,
    },

    exportFieldset: {},

    // Scope groups. Every key is spelled out, never built in a loop, so the
    // bindings scanner records each ref. The container holds the radiogroup role,
    // each row widens the hit area, and each native input holds the group name
    // plus checked state.
    exportFontLinks: { role: "radiogroup", "aria-label": "Generate Google Font API Links" },
    exportFontLinksLabel: {},
    exportFontLinksYes: radioRow(() => setFontLinks(true)),
    exportFontLinksYesInput: radioInput("export-font-links", fontLinks, () => setFontLinks(true)),
    exportFontLinksYesText: {},
    exportFontLinksNo: radioRow(() => setFontLinks(false)),
    exportFontLinksNoInput: radioInput("export-font-links", !fontLinks, () => setFontLinks(false)),
    exportFontLinksNoText: {},

    exportHidden: { role: "radiogroup", "aria-label": "Hidden Components" },
    exportHiddenLabel: {},
    exportHiddenYes: radioRow(() => setIncludeHidden(true)),
    exportHiddenYesInput: radioInput("export-hidden", includeHidden, () => setIncludeHidden(true)),
    exportHiddenYesText: {},
    exportHiddenNo: radioRow(() => setIncludeHidden(false)),
    exportHiddenNoInput: radioInput("export-hidden", !includeHidden, () => setIncludeHidden(false)),
    exportHiddenNoText: {},

    exportAllThemes: { role: "radiogroup", "aria-label": "All Themes" },
    exportAllThemesLabel: {},
    exportAllThemesYes: radioRow(() => setAllThemes(true)),
    exportAllThemesYesInput: radioInput("export-all-themes", allThemes, () => setAllThemes(true)),
    exportAllThemesYesText: {},
    exportAllThemesNo: radioRow(() => setAllThemes(false)),
    exportAllThemesNoInput: radioInput("export-all-themes", !allThemes, () => setAllThemes(false)),
    exportAllThemesNoText: {},

    exportAllFonts: { role: "radiogroup", "aria-label": "All Enabled Fonts" },
    exportAllFontsLabel: {},
    exportAllFontsYes: radioRow(() => setAllFonts(true)),
    exportAllFontsYesInput: radioInput("export-all-fonts", allFonts, () => setAllFonts(true)),
    exportAllFontsYesText: {},
    exportAllFontsNo: radioRow(() => setAllFonts(false)),
    exportAllFontsNoInput: radioInput("export-all-fonts", !allFonts, () => setAllFonts(false)),
    exportAllFontsNoText: {},

    exportAllIcons: { role: "radiogroup", "aria-label": "All Enabled Icons" },
    exportAllIconsLabel: {},
    exportAllIconsYes: radioRow(() => setAllIcons(true)),
    exportAllIconsYesInput: radioInput("export-all-icons", allIcons, () => setAllIcons(true)),
    exportAllIconsYesText: {},
    exportAllIconsNo: radioRow(() => setAllIcons(false)),
    exportAllIconsNoInput: radioInput("export-all-icons", !allIcons, () => setAllIcons(false)),
    exportAllIconsNoText: {},

    exportWorkspace: { role: "radiogroup", "aria-label": "Workspace File" },
    exportWorkspaceLabel: {},
    exportWorkspaceYes: radioRow(() => setSavedWorkspace(true)),
    exportWorkspaceYesInput: radioInput("export-saved-workspace", savedWorkspace, () =>
      setSavedWorkspace(true),
    ),
    exportWorkspaceYesText: {},
    exportWorkspaceNo: radioRow(() => setSavedWorkspace(false)),
    exportWorkspaceNoInput: radioInput("export-saved-workspace", !savedWorkspace, () =>
      setSavedWorkspace(false),
    ),
    exportWorkspaceNoText: {},

    exportScripts: { role: "radiogroup", "aria-label": "CLI Utility Scripts" },
    exportScriptsLabel: {},
    exportScriptsYes: radioRow(() => setIncludeScripts(true)),
    exportScriptsYesInput: radioInput("export-scripts", includeScripts, () =>
      setIncludeScripts(true),
    ),
    exportScriptsYesText: {},
    exportScriptsNo: radioRow(() => setIncludeScripts(false)),
    exportScriptsNoInput: radioInput("export-scripts", !includeScripts, () =>
      setIncludeScripts(false),
    ),
    exportScriptsNoText: {},

    exportCancel: { onClick: cancel },
    exportCancelLabel: {},
    exportConfirm: { onClick: save, "aria-disabled": exporting, style: confirmStyle },
    exportConfirmLabel: {},
  }

  return (
    <WindowSurface
      modal
      contentSized
      onClose={closeUnlessExporting}
      x={x}
      y={y}
      moveControls={moveControls}
    >
      <DialogExportComponent
        data-testid="export-components-dialog"
        aria-busy={exporting}
        bar={barHandle}
        seldonRefs={seldonRefs}
      />
      <MenuController
        open={platformOpen}
        anchorRef={platformAnchorRef}
        onClose={closePlatform}
        items={platformItems}
      />
      <MenuController
        open={frameworkOpen}
        anchorRef={frameworkAnchorRef}
        onClose={closeFramework}
        items={frameworkItems}
      />
    </WindowSurface>
  )
}

/** Widens a row's hit area so a click beside the bullet still selects it. */
function radioRow(onSelect: () => void) {
  return { onClick: onSelect, style: styles.radioRow }
}

/** Wires a native radio to its group name, its checked state, and what it sets. */
function radioInput(group: string, checked: boolean, onSelect: () => void) {
  return { name: group, checked, onChange: onSelect }
}

const styles: Record<string, CSSProperties> = {
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
  },
  opaque: {
    opacity: 1,
  },
  opaquePointer: {
    cursor: "pointer",
    opacity: 1,
  },
  radioRow: {
    cursor: "pointer",
  },
  busy: {
    pointerEvents: "none",
  },
}
