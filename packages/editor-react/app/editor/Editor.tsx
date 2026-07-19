"use client"

import { Allotment, LayoutPriority } from "allotment"
import { CSSProperties } from "react"
import { useEditorConfig } from "@app/hooks/use-editor-config"
import { useEditorShortcuts } from "@app/hooks/use-editor-shortcuts"
import { usePreview } from "@app/hooks/use-preview"
import { Frame } from "@seldon/components/frames/Frame"
import { Canvas } from "../canvas/Canvas"
import { SIDEBAR_INITIAL_WIDTH } from "../constants"
import { BoardsDialog } from "../dialogs/boards/BoardsDialog"
import { ComponentsDialog } from "../dialogs/components/ComponentsDialog"
import { CreateComponentController } from "../dialogs/create-component/CreateComponentController"
import { ExportComponentsController } from "../dialogs/export-components/ExportComponentsController"
import { FontCollectionsDialog } from "../dialogs/font-collections/FontCollectionsDialog"
import { IconSetsDialog } from "../dialogs/icon-sets/IconSetsDialog"
import { ImageUploadController } from "../dialogs/image-upload/ImageUploadController"
import { ThemesDialog } from "../dialogs/themes/ThemesDialog"
import { FocusRingOverlay } from "../focus/FocusRingOverlay"
import { HariController } from "../palettes/hari/HariController"
import { ObjectsSidebar } from "../sidebars/objects/ObjectsSidebar"
import { PropertiesSidebar } from "../sidebars/properties/PropertiesSidebar"
import { EditorCrossfade } from "./EditorCrossfade.bespoke"

export default function Editor() {
  const { showPanels } = useEditorConfig()
  const { isInPreviewMode } = usePreview()
  const showSidePanels = showPanels && !isInPreviewMode
  const crossfadeKey = isInPreviewMode ? "preview" : "editor"

  return (
    <Frame wrapperElement="main" style={styles.main}>
      <EditorCrossfade transitionKey={crossfadeKey}>
        <Allotment proportionalLayout={false}>
          <Allotment.Pane
            minSize={280}
            maxSize={600}
            preferredSize={SIDEBAR_INITIAL_WIDTH}
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
            minSize={280}
            maxSize={600}
            preferredSize={SIDEBAR_INITIAL_WIDTH}
            visible={showSidePanels}
            priority={LayoutPriority.Low}
          >
            <PropertiesSidebar />
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
      <FocusRingOverlay />
      <EditorShortcuts />
    </Frame>
  )
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
    position: "relative",
    zIndex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "var(--sdn-swatch-offBlack)",
  },
}

const EditorShortcuts = () => {
  useEditorShortcuts()
  return null
}
