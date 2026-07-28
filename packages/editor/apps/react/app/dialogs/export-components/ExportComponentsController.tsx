"use client"

import { MenuController } from "@app/menus/MenuController"
import { useDraggableWindow } from "@app/menus/hooks/use-draggable-window"
import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
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
import type { IconProps } from "@seldon/components/primitives/Icon"
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
  save,
  close,
}: ExportComponentsDialogProps) {
  useHotkeys("esc", close)

  const { x, y, moveControls } = useDraggableWindow({
    handleClose: close,
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

      exportFontLinksYes: radioItem(fontLinks, () => setFontLinks(true)),
      exportFontLinksYesIcon: radioDot(fontLinks),
      exportFontLinksNo: radioItem(!fontLinks, () => setFontLinks(false)),
      exportFontLinksNoIcon: radioDot(!fontLinks),

      exportHiddenYes: radioItem(includeHidden, () => setIncludeHidden(true)),
      exportHiddenYesIcon: radioDot(includeHidden),
      exportHiddenNo: radioItem(!includeHidden, () => setIncludeHidden(false)),
      exportHiddenNoIcon: radioDot(!includeHidden),

      exportAllThemesYes: radioItem(allThemes, () => setAllThemes(true)),
      exportAllThemesYesIcon: radioDot(allThemes),
      exportAllThemesNo: radioItem(!allThemes, () => setAllThemes(false)),
      exportAllThemesNoIcon: radioDot(!allThemes),

      exportAllFontsYes: radioItem(allFonts, () => setAllFonts(true)),
      exportAllFontsYesIcon: radioDot(allFonts),
      exportAllFontsNo: radioItem(!allFonts, () => setAllFonts(false)),
      exportAllFontsNoIcon: radioDot(!allFonts),

      exportAllIconsYes: radioItem(allIcons, () => setAllIcons(true)),
      exportAllIconsYesIcon: radioDot(allIcons),
      exportAllIconsNo: radioItem(!allIcons, () => setAllIcons(false)),
      exportAllIconsNoIcon: radioDot(!allIcons),

      exportSavedWorkspaceYes: radioItem(savedWorkspace, () => setSavedWorkspace(true)),
      exportSavedWorkspaceYesIcon: radioDot(savedWorkspace),
      exportSavedWorkspaceNo: radioItem(!savedWorkspace, () => setSavedWorkspace(false)),
      exportSavedWorkspaceNoIcon: radioDot(!savedWorkspace),

      exportScriptsYes: radioItem(includeScripts, () => setIncludeScripts(true)),
      exportScriptsYesIcon: radioDot(includeScripts),
      exportScriptsNo: radioItem(!includeScripts, () => setIncludeScripts(false)),
      exportScriptsNoIcon: radioDot(!includeScripts),

      exportCancel: { onClick: close },
      exportConfirm: { onClick: save },
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
      close,
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

      formControlRadio: radioGroup("Generate Google Font API Links"),
      textLabel4: {},
      menuItemRadio: {},
      textLabel5: radioLabel,
      menuItemRadio2: {},
      textLabel6: radioLabel,

      fieldset: {},

      formControlRadio2: radioGroup("Hidden Components"),
      textLabel7: {},
      menuItemRadio3: {},
      textLabel8: radioLabel,
      menuItemRadio4: {},
      textLabel9: radioLabel,

      formControlRadio3: radioGroup("All Themes"),
      textLabel10: {},
      menuItemRadio5: {},
      textLabel11: radioLabel,
      menuItemRadio6: {},
      textLabel12: radioLabel,

      formControlRadio4: radioGroup("All Enabled Fonts"),
      textLabel13: {},
      menuItemRadio7: {},
      textLabel14: radioLabel,
      menuItemRadio8: {},
      textLabel15: radioLabel,

      formControlRadio5: radioGroup("All Enabled Icons"),
      textLabel16: {},
      menuItemRadio9: {},
      textLabel17: radioLabel,
      menuItemRadio10: {},
      textLabel18: radioLabel,

      formControlRadio6: radioGroup("Saved Workspace"),
      textLabel19: {},
      menuItemRadio11: {},
      textLabel20: radioLabel,
      menuItemRadio12: {},
      textLabel21: radioLabel,

      formControlRadio7: radioGroup("CLI Utility Scripts"),
      textLabel22: {},
      menuItemRadio13: {},
      textLabel23: radioLabel,
      menuItemRadio14: {},
      textLabel24: radioLabel,

      textLabel25: {},
      textLabel26: {},
    }),
    [],
  )

  return (
    <WindowSurface modal contentSized onClose={close} x={x} y={y} moveControls={moveControls}>
      <DialogExportComponent
        data-testid="export-components-dialog"
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

const iconChecked: IconProps["icon"] = "material-radioButtonChecked"
const iconUnchecked: IconProps["icon"] = "material-radioButtonUnchecked"

/** Wires a Yes/No radio item: checked state, role, and its select handler. */
function radioItem(checked: boolean, onSelect: () => void) {
  return {
    onClick: onSelect,
    role: "radio",
    "aria-checked": checked ? "true" : "false",
    "aria-selected": checked || undefined,
    style: styles.radioItem,
  }
}

/**
 * The dot glyph for a Yes/No pair.
 */
function radioDot(checked: boolean) {
  return { icon: checked ? iconChecked : iconUnchecked, style: styles.opaque }
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
  radioItem: {
    cursor: "pointer",
    backgroundColor: "transparent",
  },
}

/** Radio copy, held opaque so the row states cannot dim it. */
const radioLabel = { style: styles.opaque }
