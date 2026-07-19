"use client"

import { MenuController } from "@app/menus/MenuController"
import { MenuEntry } from "@app/menus/types"
import { WindowOverlay } from "@app/overlays/WindowOverlay.bespoke"
import {
  CSSProperties,
  MouseEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDraggableWindow } from "@app/menus/hooks/use-draggable-window"
import {
  EXPORT_PLATFORM_OPTIONS,
  useExportComponentsPanel,
} from "./hooks/use-export-components-panel"
import { DialogExportComponent } from "@seldon/components/modules/DialogExportComponent"
import { IconProps } from "@seldon/components/primitives/Icon"

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
 * baked defaults. This controller only wires behavior: the platform field opens
 * a menu of the registered platforms, each scope control acts as a Yes/No radio
 * pair, the location field opens the folder picker, and the footer buttons
 * cancel and export.
 */
function ExportComponentsDialog({
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
  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
  )

  const [platformOpen, setPlatformOpen] = useState(false)
  const platformAnchorRef = useRef<HTMLElement | null>(null)

  const openPlatform = useCallback((event: MouseEvent) => {
    platformAnchorRef.current = event.currentTarget as HTMLElement
    setPlatformOpen(true)
  }, [])
  const closePlatform = useCallback(() => setPlatformOpen(false), [])

  const platformLabel = useMemo(
    () =>
      EXPORT_PLATFORM_OPTIONS.find((option) => option.id === platform)?.label ??
      "",
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

  const includeHiddenYes = useCallback(
    () => setIncludeHidden(true),
    [setIncludeHidden],
  )
  const includeHiddenNo = useCallback(
    () => setIncludeHidden(false),
    [setIncludeHidden],
  )
  const allThemesYes = useCallback(() => setAllThemes(true), [setAllThemes])
  const allThemesNo = useCallback(() => setAllThemes(false), [setAllThemes])
  const allFontsYes = useCallback(() => setAllFonts(true), [setAllFonts])
  const allFontsNo = useCallback(() => setAllFonts(false), [setAllFonts])
  const fontLinksYes = useCallback(() => setFontLinks(true), [setFontLinks])
  const fontLinksNo = useCallback(() => setFontLinks(false), [setFontLinks])
  const allIconsYes = useCallback(() => setAllIcons(true), [setAllIcons])
  const allIconsNo = useCallback(() => setAllIcons(false), [setAllIcons])

  const directoryLabel = directory?.name ?? ""

  // The authored radio items all bake a filled dot, so selection state is drawn
  // by swapping each item's icon: filled for the chosen side, hollow for the
  // other. Yes sits in the first icon slot of each pair, No in the second.
  const hiddenYesIcon = includeHidden ? iconChecked : iconUnchecked
  const hiddenNoIcon = includeHidden ? iconUnchecked : iconChecked
  const themesYesIcon = allThemes ? iconChecked : iconUnchecked
  const themesNoIcon = allThemes ? iconUnchecked : iconChecked
  const fontsYesIcon = allFonts ? iconChecked : iconUnchecked
  const fontsNoIcon = allFonts ? iconUnchecked : iconChecked
  const fontLinksYesIcon = fontLinks ? iconChecked : iconUnchecked
  const fontLinksNoIcon = fontLinks ? iconUnchecked : iconChecked
  const iconsYesIcon = allIcons ? iconChecked : iconUnchecked
  const iconsNoIcon = allIcons ? iconUnchecked : iconChecked

  const barHandle = useMemo(
    () => ({ onPointerDown: startDrag, style: styles.dragHandle }),
    [startDrag],
  )
  const showSlot = useMemo(() => ({}), [])

  const seldonRefs = useMemo(
    () => ({
      exportRootPath: {
        value: directoryLabel,
        placeholder: "Choose a folder…",
        readOnly: true,
        onClick: chooseDirectory,
        style: styles.pointer,
      },
      exportPlatform: {
        value: platformLabel,
        readOnly: true,
        onClick: openPlatform,
        "aria-expanded": platformOpen,
        style: styles.pointer,
      },
      exportHiddenYes: radioProps(includeHidden === true, includeHiddenYes),
      exportHiddenNo: radioProps(includeHidden === false, includeHiddenNo),
      exportAllThemesYes: radioProps(allThemes === true, allThemesYes),
      exportAllThemesNo: radioProps(allThemes === false, allThemesNo),
      exportAllFontsYes: radioProps(allFonts === true, allFontsYes),
      exportAllFontsNo: radioProps(allFonts === false, allFontsNo),
      exportFontLinksYes: radioProps(fontLinks === true, fontLinksYes),
      exportFontLinksNo: radioProps(fontLinks === false, fontLinksNo),
      exportAllIconsYes: radioProps(allIcons === true, allIconsYes),
      exportAllIconsNo: radioProps(allIcons === false, allIconsNo),
      exportCancel: { onClick: close },
      exportConfirm: { onClick: save },
    }),
    [
      directoryLabel,
      chooseDirectory,
      platformLabel,
      openPlatform,
      platformOpen,
      includeHidden,
      includeHiddenYes,
      includeHiddenNo,
      allThemes,
      allThemesYes,
      allThemesNo,
      allFonts,
      allFontsYes,
      allFontsNo,
      fontLinks,
      fontLinksYes,
      fontLinksNo,
      allIcons,
      allIconsYes,
      allIconsNo,
      close,
      save,
    ],
  )

  return (
    <WindowOverlay
      modal
      contentSized
      onClose={close}
      x={x}
      y={y}
      moveControls={moveControls}
    >
      <DialogExportComponent
        data-testid="export-components-dialog"
        bar={barHandle}
        textTitle={showSlot}
        frame={showSlot}
        formControl={showSlot}
        textLabel={showSlot}
        input={showSlot}
        formControl2={showSlot}
        textLabel2={showSlot}
        comboboxField={showSlot}
        input2={showSlot}
        buttonIconic={showSlot}
        icon={showSlot}
        formControlRadio={showSlot}
        frame2={showSlot}
        textLabel3={showSlot}
        textDescription={showSlot}
        frame3={showSlot}
        menuItemRadio={showSlot}
        icon2={hiddenYesIcon}
        textLabel4={showSlot}
        menuItemRadio2={showSlot}
        icon3={hiddenNoIcon}
        textLabel5={showSlot}
        formControlRadio2={showSlot}
        frame4={showSlot}
        textLabel6={showSlot}
        textDescription2={showSlot}
        frame5={showSlot}
        menuItemRadio3={showSlot}
        icon4={themesYesIcon}
        textLabel7={showSlot}
        menuItemRadio4={showSlot}
        icon5={themesNoIcon}
        textLabel8={showSlot}
        formControlRadio3={showSlot}
        frame6={showSlot}
        textLabel9={showSlot}
        textDescription3={showSlot}
        frame7={showSlot}
        menuItemRadio5={showSlot}
        icon6={fontsYesIcon}
        textLabel10={showSlot}
        menuItemRadio6={showSlot}
        icon7={fontsNoIcon}
        textLabel11={showSlot}
        formControlRadio4={showSlot}
        frame8={showSlot}
        textLabel12={showSlot}
        textDescription4={showSlot}
        frame9={showSlot}
        menuItemRadio7={showSlot}
        icon8={fontLinksYesIcon}
        textLabel13={showSlot}
        menuItemRadio8={showSlot}
        icon9={fontLinksNoIcon}
        textLabel14={showSlot}
        formControlRadio5={showSlot}
        frame10={showSlot}
        textLabel15={showSlot}
        textDescription5={showSlot}
        frame11={showSlot}
        menuItemRadio9={showSlot}
        icon10={iconsYesIcon}
        textLabel16={showSlot}
        menuItemRadio10={showSlot}
        icon11={iconsNoIcon}
        textLabel17={showSlot}
        barButtons={showSlot}
        button={showSlot}
        icon12={showSlot}
        textLabel18={showSlot}
        button2={showSlot}
        icon13={showSlot}
        textLabel19={showSlot}
        seldonRefs={seldonRefs}
      />
      <MenuController
        open={platformOpen}
        anchorRef={platformAnchorRef}
        onClose={closePlatform}
        items={platformItems}
      />
    </WindowOverlay>
  )
}

const iconChecked: IconProps = { icon: "material-radioButtonChecked" }
const iconUnchecked: IconProps = { icon: "material-radioButtonUnchecked" }

/** Wires a Yes/No radio item: checked state, role, and its select handler. */
function radioProps(checked: boolean, onSelect: () => void) {
  return {
    onClick: onSelect,
    role: "radio",
    "aria-checked": checked ? "true" : "false",
    "aria-selected": checked || undefined,
    style: styles.pointer,
  }
}

const styles: Record<string, CSSProperties> = {
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
  },
  pointer: {
    cursor: "pointer",
  },
}
