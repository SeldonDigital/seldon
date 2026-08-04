"use client"

import { useEditorShortcuts } from "@app/commands/use-editor-shortcuts"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { Frame } from "@seldon/components/frames/Frame"
import { Allotment, LayoutPriority } from "allotment"
import { useCallback } from "react"

import { Canvas } from "../canvas/Canvas"
import { BoardsDialog } from "../dialogs/boards/BoardsDialog"
import { ComponentsDialog } from "../dialogs/components/ComponentsDialog"
import { CreateComponentController } from "../dialogs/create-component/CreateComponentController"
import { ExportComponentsController } from "../dialogs/export-components/ExportComponentsController"
import { FontCollectionsDialog } from "../dialogs/font-collections/FontCollectionsDialog"
import { IconSetsDialog } from "../dialogs/icon-sets/IconSetsDialog"
import { ImageUploadController } from "../dialogs/image-upload/ImageUploadController"
import { ThemesDialog } from "../dialogs/themes/ThemesDialog"
import { FocusRingOverlay } from "../overlays/FocusRingOverlay"
import { HariController } from "../palettes/hari/HariController"
import { ObjectsSidebar } from "../sidebars/objects/ObjectsSidebar"
import { PanelPropertyController } from "../sidebars/properties/PanelPropertyController"
import { PropertiesSidebar } from "../sidebars/properties/PropertiesSidebar"
import { EditorCrossfade } from "./EditorCrossfade.bespoke"

import type { CSSProperties } from "react"

/** The narrowest a docked sidebar may be dragged, and its cap at 2.5x that width. */
const SIDEBAR_MIN_WIDTH = 280
const SIDEBAR_MAX_WIDTH = SIDEBAR_MIN_WIDTH * 2.5

export default function Editor() {
  const {
    showPanels,
    propertiesFloating,
    propertiesDockedOpen,
    objectsSidebarWidth,
    setObjectsSidebarWidth,
    propertiesSidebarWidth,
    setPropertiesSidebarWidth,
  } = useEditorConfig()
  const showSidePanels = showPanels
  const showDockedProperties = showSidePanels && !propertiesFloating && propertiesDockedOpen

  // Persist each docked sidebar's width once a drag settles, so the next session opens
  // where it was left. The panes render in order, so the objects width is the first size
  // and the properties width is the last. A hidden pane reports zero, so its stored width
  // is kept rather than overwritten while it is collapsed or floating.
  const saveSidebarWidths = useCallback(
    (sizes: number[]) => {
      const objectsWidth = sizes[0]
      const propertiesWidth = sizes[sizes.length - 1]

      if (showSidePanels && objectsWidth > 0) setObjectsSidebarWidth(objectsWidth)
      if (showDockedProperties && propertiesWidth > 0) setPropertiesSidebarWidth(propertiesWidth)
    },
    [showSidePanels, showDockedProperties, setObjectsSidebarWidth, setPropertiesSidebarWidth],
  )

  return (
    <Frame wrapperElement="main" style={styles.main}>
      <EditorCrossfade transitionKey="editor">
        <Allotment separator={false} proportionalLayout={false} onDragEnd={saveSidebarWidths}>
          <Allotment.Pane
            minSize={SIDEBAR_MIN_WIDTH}
            maxSize={SIDEBAR_MAX_WIDTH}
            preferredSize={objectsSidebarWidth}
            visible={showSidePanels}
            priority={LayoutPriority.Low}
          >
            <Frame style={styles.objectsPane}>
              <ObjectsSidebar />
            </Frame>
          </Allotment.Pane>
          <Allotment.Pane priority={LayoutPriority.High}>
            <Canvas />
          </Allotment.Pane>
          <Allotment.Pane
            minSize={SIDEBAR_MIN_WIDTH}
            maxSize={SIDEBAR_MAX_WIDTH}
            preferredSize={propertiesSidebarWidth}
            visible={showDockedProperties}
            priority={LayoutPriority.Low}
          >
            <Frame style={styles.propertiesPane}>
              <PropertiesSidebar />
            </Frame>
          </Allotment.Pane>
        </Allotment>
      </EditorCrossfade>

      <ImageUploadController />
      <ComponentsDialog />
      <BoardsDialog />
      <CreateComponentController />
      <ExportComponentsController />
      <ThemesDialog />
      <FontCollectionsDialog />
      <IconSetsDialog />
      <HariController />
      <PanelPropertyController />
      <FocusRingOverlay />
      <EditorShortcuts />
    </Frame>
  )
}

/**
 * The divider between each sidebar and the canvas. Allotment's own separator
 * only paints on the leading edge of non-first panes, so it lands on the black
 * canvas on one side and the sidebar on the other and cannot match. Drawing the
 * border on each sidebar's canvas-facing edge keeps both dividers on the same
 * surface. OffBlack inverts with the theme mode, so the line stays legible in
 * light and dark chrome.
 */
const SIDEBAR_CANVAS_BORDER =
  "var(--hairline) solid color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)"

const SIDEBAR_PANE: CSSProperties = {
  position: "relative",
  zIndex: 1,
  height: "100%",
  width: "100%",
  backgroundColor: "var(--sdn-swatch-offWhite)",
}

const styles: Record<string, CSSProperties> = {
  main: {
    display: "flex",
    position: "relative",
    height: "100vh",
    flexDirection: "column",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    zIndex: 0,
  },
  objectsPane: {
    ...SIDEBAR_PANE,
    borderInlineEnd: SIDEBAR_CANVAS_BORDER,
  },
  propertiesPane: {
    ...SIDEBAR_PANE,
    borderInlineStart: SIDEBAR_CANVAS_BORDER,
  },
}

const EditorShortcuts = () => {
  useEditorShortcuts()

  return null
}
