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

/** One Yes/No scope group, wired to the toggle it drives. */
interface ScopeGroup {
  ref: string
  label: string
  name: string
  value: boolean
  setValue: (value: boolean) => void
}

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

  const scopeGroups = useMemo<ScopeGroup[]>(
    () => [
      {
        ref: "exportFontLinks",
        label: "Generate Google Font API Links",
        name: "export-font-links",
        value: fontLinks,
        setValue: setFontLinks,
      },
      {
        ref: "exportHidden",
        label: "Hidden Components",
        name: "export-hidden",
        value: includeHidden,
        setValue: setIncludeHidden,
      },
      {
        ref: "exportAllThemes",
        label: "All Themes",
        name: "export-all-themes",
        value: allThemes,
        setValue: setAllThemes,
      },
      {
        ref: "exportAllFonts",
        label: "All Enabled Fonts",
        name: "export-all-fonts",
        value: allFonts,
        setValue: setAllFonts,
      },
      {
        ref: "exportAllIcons",
        label: "All Enabled Icons",
        name: "export-all-icons",
        value: allIcons,
        setValue: setAllIcons,
      },
      {
        ref: "exportWorkspace",
        label: "Workspace File",
        name: "export-saved-workspace",
        value: savedWorkspace,
        setValue: setSavedWorkspace,
      },
      {
        ref: "exportScripts",
        label: "CLI Utility Scripts",
        name: "export-scripts",
        value: includeScripts,
        setValue: setIncludeScripts,
      },
    ],
    [
      fontLinks,
      setFontLinks,
      includeHidden,
      setIncludeHidden,
      allThemes,
      setAllThemes,
      allFonts,
      setAllFonts,
      allIcons,
      setAllIcons,
      savedWorkspace,
      setSavedWorkspace,
      includeScripts,
      setIncludeScripts,
    ],
  )

  const seldonRefs = useMemo<SeldonRefs>(() => {
    const refs: SeldonRefs = {
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

      exportCancel: { onClick: cancel },
      exportCancelLabel: {},
      exportConfirm: { onClick: save, "aria-disabled": exporting, style: confirmStyle },
      exportConfirmLabel: {},
    }

    // Each scope group renders a title and a Yes/No pair. The group carries the
    // radiogroup role, each row widens the hit area, and each native input holds
    // the group name plus checked state.
    for (const group of scopeGroups) {
      refs[group.ref] = { role: "radiogroup", "aria-label": group.label }
      refs[`${group.ref}Label`] = {}
      refs[`${group.ref}Yes`] = radioRow(() => group.setValue(true))
      refs[`${group.ref}YesInput`] = radioInput(group.name, group.value, () => group.setValue(true))
      refs[`${group.ref}YesText`] = {}
      refs[`${group.ref}No`] = radioRow(() => group.setValue(false))
      refs[`${group.ref}NoInput`] = radioInput(group.name, !group.value, () => group.setValue(false))
      refs[`${group.ref}NoText`] = {}
    }

    return refs
  }, [
    workspaceName,
    changeWorkspaceName,
    commitWorkspaceName,
    commitNameOnEnter,
    frameworkLabel,
    openFramework,
    frameworkOpen,
    platformLabel,
    openPlatform,
    platformOpen,
    directoryLabel,
    chooseDirectory,
    cancel,
    save,
    exporting,
    confirmStyle,
    scopeGroups,
  ])

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
