"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { FloatingPanel } from "@app/windows/FloatingPanel"
import { PanelPalette } from "@seldon/components/modules/PanelPalette"
import { BarFilter } from "@seldon/components/parts/BarFilter"
import { BarState } from "@seldon/components/parts/BarState"
import { useCallback } from "react"

import { propertiesContentStyle, usePropertiesPanel } from "./PropertiesSidebar"

import type { FloatingPanelApi } from "@app/windows/FloatingPanel"
import type { SeldonRefs } from "@seldon/components/utils/merge-slot"
import type { CSSProperties } from "react"

const PROPERTY_INITIAL_WIDTH = 320
const PROPERTY_INITIAL_HEIGHT = 520

/** Turns on an opt-in generated slot without setting any props on it. */
const EMPTY_SLOT = {}

/**
 * Gate for the floating properties palette. Mounts the palette only while it is
 * detached and shown, so it recenters on each open and its floating-window hooks
 * run only while open, matching the Hari view-model.
 */
export function PanelPropertyController() {
  const { propertiesFloating, propertiesFloatingOpen } = useEditorConfig()

  if (!propertiesFloating || !propertiesFloatingOpen) return null

  return <PropertyPalette />
}

/**
 * View-model for the floating properties palette. Renders the generated
 * `PanelPalette` shell inside a `FloatingPanel`, injecting the shared property
 * tree into the contents zone, `BarState` into the top bar, and `BarFilter` into
 * the bottom bar. The body comes from `usePropertiesPanel`, so the palette shows
 * the exact same tree as the docked sidebar; only the filter and state controls
 * change location.
 */
function PropertyPalette() {
  const panel = usePropertiesPanel()
  const {
    setPropertiesFloating,
    setPropertiesFloatingOpen,
    setPropertiesDockedOpen,
    propertiesPanelRect,
    setPropertiesPanelRect,
  } = useEditorConfig()

  // Re-docking reveals the docked pane, even if it was previously hidden via Show Properties.
  const dock = useCallback(() => {
    setPropertiesFloating(false)
    setPropertiesDockedOpen(true)
  }, [setPropertiesFloating, setPropertiesDockedOpen])
  const close = useCallback(() => setPropertiesFloatingOpen(false), [setPropertiesFloatingOpen])

  // Every value reaches its slot by the slot's baked `data-seldon-ref` name, so
  // moving or reordering a node in the design keeps this wiring intact. The
  // drag handle needs the window's `startDrag`, so the refs are built per render
  // from the panel's api rather than hoisted to the component body.
  const renderPalette = (api: FloatingPanelApi) => {
    const seldonRefs: SeldonRefs = {
      paletteTopBar: { onPointerDown: api.startDrag, style: styles.dragHandle },
      paletteOption: {
        onClick: dock,
        title: "Dock panel",
        "data-testid": "properties-dock-toggle",
      },
      paletteOptionIcon: { icon: "seldon-panels", style: styles.optionIcon },
      paletteClose: { onClick: close, "data-testid": "properties-palette-close" },
      propertyState: {
        onClick: panel.openStateMenu,
        disabled: panel.stateDisabled,
        "data-testid": "board-state-trigger",
      },
      propertyStateLabel: { children: panel.stateLabel },
      filterField: { ...panel.filter.comboboxField },
    }

    const topBar = <BarState buttonMenu={EMPTY_SLOT} textLabel={EMPTY_SLOT} seldonRefs={seldonRefs} />
    const bottomBar = (
      <BarFilter
        comboboxField={EMPTY_SLOT}
        input={panel.filter.input}
        buttonIconic={panel.filter.buttonIconic}
        seldonRefs={seldonRefs}
      />
    )

    const topBarSlot = { children: topBar }
    const contentsSlot = { style: propertiesContentStyle, children: panel.tree }
    const bottomBarSlot = { children: bottomBar }

    return (
      <>
        <PanelPalette
          style={styles.dialog}
          seldonRefs={seldonRefs}
          buttonIconic={EMPTY_SLOT}
          buttonIconic2={EMPTY_SLOT}
          frame2={topBarSlot}
          frame3={contentsSlot}
          frame5={bottomBarSlot}
        />
        {panel.stateMenuController}
      </>
    )
  }

  return (
    <FloatingPanel
      initialWidth={PROPERTY_INITIAL_WIDTH}
      initialHeight={PROPERTY_INITIAL_HEIGHT}
      onClose={close}
      testId="properties-palette"
      placement="right"
      rect={propertiesPanelRect}
      onRectChange={setPropertiesPanelRect}
    >
      {renderPalette}
    </FloatingPanel>
  )
}

const styles: Record<string, CSSProperties> = {
  dialog: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
  },
  optionIcon: {
    transform: "rotate(90deg)",
  },
}
