"use client"

import { MenuController } from "@app/menus/MenuController"
import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { DialogExportComponent } from "@seldon/components/modules/DialogExportComponent"
import { useCallback, useMemo, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import {
  EXPORT_PLATFORM_OPTIONS,
  useExportComponentsPanel,
} from "./hooks/use-export-components-panel"

import type { MenuEntry } from "@app/menus/types"
import type { FormControlRadioProps } from "@seldon/components/elements/FormControlRadio"
import type { DialogExportComponentProps } from "@seldon/components/modules/DialogExportComponent"
import type { InputRadioButtonProps } from "@seldon/components/primitives/InputRadioButton"
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
 * baked defaults. This controller only wires behavior.
 */
function ExportComponentsDialog({
  workspaceName,
  setWorkspaceName,
  commitWorkspaceName,
  platform,
  setPlatform,
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

  const openPlatform = useCallback((event: MouseEvent) => {
    platformAnchorRef.current = event.currentTarget as HTMLElement
    setPlatformOpen(true)
  }, [])
  const closePlatform = useCallback(() => setPlatformOpen(false), [])

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

  // Only Export dims, so Cancel and the title bar stay usable during a run. Its
  // pointer events go with it, which is what stops a second export from landing.
  const confirmStyle = exporting ? styles.busy : undefined

  const barHandle = useMemo(
    () => ({ onPointerDown: startDrag, style: styles.dragHandle }),
    [startDrag],
  )

  const seldonRefs = useMemo<SeldonRefs>(
    () => ({
      exportWorkspaceName: {
        value: workspaceName,
        placeholder: "Untitled workspace",
        onChange: changeWorkspaceName,
        onBlur: commitWorkspaceName,
        onKeyDown: commitNameOnEnter,
        style: styles.opaque,
      },
      exportRootPath: {
        value: directoryLabel,
        placeholder: "Choose a folder…",
        readOnly: true,
        onClick: chooseDirectory,
        style: styles.opaquePointer,
      },
      exportPlatform: {
        value: platformLabel,
        readOnly: true,
        onClick: openPlatform,
        "aria-expanded": platformOpen,
        style: styles.opaquePointer,
      },

      exportFontLinksYes: radioRow(() => setFontLinks(true)),
      exportFontLinksNo: radioRow(() => setFontLinks(false)),

      exportHiddenYes: radioRow(() => setIncludeHidden(true)),
      exportHiddenNo: radioRow(() => setIncludeHidden(false)),

      exportAllThemesYes: radioRow(() => setAllThemes(true)),
      exportAllThemesNo: radioRow(() => setAllThemes(false)),

      exportAllFontsYes: radioRow(() => setAllFonts(true)),
      exportAllFontsNo: radioRow(() => setAllFonts(false)),

      exportAllIconsYes: radioRow(() => setAllIcons(true)),
      exportAllIconsNo: radioRow(() => setAllIcons(false)),

      exportSavedWorkspaceYes: radioRow(() => setSavedWorkspace(true)),
      exportSavedWorkspaceNo: radioRow(() => setSavedWorkspace(false)),

      exportScriptsYes: radioRow(() => setIncludeScripts(true)),
      exportScriptsNo: radioRow(() => setIncludeScripts(false)),

      exportCancel: { onClick: cancel },
      exportConfirm: { onClick: save, "aria-disabled": exporting, style: confirmStyle },
    }),
    [
      workspaceName,
      changeWorkspaceName,
      commitWorkspaceName,
      commitNameOnEnter,
      directoryLabel,
      chooseDirectory,
      platformLabel,
      openPlatform,
      platformOpen,
      setFontLinks,
      setIncludeHidden,
      setAllThemes,
      setAllFonts,
      setAllIcons,
      setSavedWorkspace,
      setIncludeScripts,
      exporting,
      confirmStyle,
      cancel,
      save,
    ],
  )

  const slots = useMemo<Partial<DialogExportComponentProps>>(
    () => ({
      textTitle: {},

      formControl: {},
      textLabel: {},
      formControl2: {},
      textLabel2: {},
      formControl3: {},
      textLabel3: {},
      comboboxField: {},

      // Every slot in a radio row is opt-in, so each row passes a positional
      // enabler. The native input carries its group name and checked state here,
      // and the row's ref adds the click target around it.
      formControlRadio: radioGroup("Generate Google Font API Links"),
      textLabel4: {},
      formControlRadioButtonControl: {},
      inputRadioButton: radioInput("export-font-links", fontLinks, () => setFontLinks(true)),
      textLabel5: {},
      formControlRadioButtonControl2: {},
      inputRadioButton2: radioInput("export-font-links", !fontLinks, () => setFontLinks(false)),
      textLabel6: {},

      fieldset: {},

      formControlRadio2: radioGroup("Hidden Components"),
      textLabel7: {},
      formControlRadioButtonControl3: {},
      inputRadioButton3: radioInput("export-hidden", includeHidden, () => setIncludeHidden(true)),
      textLabel8: {},
      formControlRadioButtonControl4: {},
      inputRadioButton4: radioInput("export-hidden", !includeHidden, () => setIncludeHidden(false)),
      textLabel9: {},

      formControlRadio3: radioGroup("All Themes"),
      textLabel10: {},
      formControlRadioButtonControl5: {},
      inputRadioButton5: radioInput("export-all-themes", allThemes, () => setAllThemes(true)),
      textLabel11: {},
      formControlRadioButtonControl6: {},
      inputRadioButton6: radioInput("export-all-themes", !allThemes, () => setAllThemes(false)),
      textLabel12: {},

      formControlRadio4: radioGroup("All Enabled Fonts"),
      textLabel13: {},
      formControlRadioButtonControl7: {},
      inputRadioButton7: radioInput("export-all-fonts", allFonts, () => setAllFonts(true)),
      textLabel14: {},
      formControlRadioButtonControl8: {},
      inputRadioButton8: radioInput("export-all-fonts", !allFonts, () => setAllFonts(false)),
      textLabel15: {},

      formControlRadio5: radioGroup("All Enabled Icons"),
      textLabel16: {},
      formControlRadioButtonControl9: {},
      inputRadioButton9: radioInput("export-all-icons", allIcons, () => setAllIcons(true)),
      textLabel17: {},
      formControlRadioButtonControl10: {},
      inputRadioButton10: radioInput("export-all-icons", !allIcons, () => setAllIcons(false)),
      textLabel18: {},

      formControlRadio6: radioGroup("Saved Workspace"),
      textLabel19: {},
      formControlRadioButtonControl11: {},
      inputRadioButton11: radioInput("export-saved-workspace", savedWorkspace, () =>
        setSavedWorkspace(true),
      ),
      textLabel20: {},
      formControlRadioButtonControl12: {},
      inputRadioButton12: radioInput("export-saved-workspace", !savedWorkspace, () =>
        setSavedWorkspace(false),
      ),
      textLabel21: {},

      formControlRadio7: radioGroup("CLI Utility Scripts"),
      textLabel22: {},
      formControlRadioButtonControl13: {},
      inputRadioButton13: radioInput("export-scripts", includeScripts, () =>
        setIncludeScripts(true),
      ),
      textLabel23: {},
      formControlRadioButtonControl14: {},
      inputRadioButton14: radioInput("export-scripts", !includeScripts, () =>
        setIncludeScripts(false),
      ),
      textLabel24: {},

      textLabel25: {},
      textLabel26: {},
    }),
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
        {...slots}
        seldonRefs={seldonRefs}
      />
      <MenuController
        open={platformOpen}
        anchorRef={platformAnchorRef}
        onClose={closePlatform}
        items={platformItems}
      />
    </WindowSurface>
  )
}

/** Widens a row's hit area so a click beside the bullet still selects it. */
function radioRow(onSelect: () => void) {
  return { onClick: onSelect, style: styles.radioRow }
}

/** Wires a native radio to its group name, its checked state, and what it sets. */
function radioInput(group: string, checked: boolean, onSelect: () => void): InputRadioButtonProps {
  return { name: group, checked, onChange: onSelect }
}

/** Names a Yes/No pair as one group. */
function radioGroup(label: string): FormControlRadioProps {
  return { role: "radiogroup", "aria-label": label }
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
    opacity: 0.5,
    pointerEvents: "none",
  },
}
