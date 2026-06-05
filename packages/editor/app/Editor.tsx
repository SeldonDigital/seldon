"use client"

import { Allotment, LayoutPriority } from "allotment"
import { AnimatePresence, motion } from "framer-motion"
import { CSSProperties } from "react"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useEditorShortcuts } from "@lib/hooks/use-editor-shortcuts"
import { usePreview } from "@lib/hooks/use-preview"
import { Canvas } from "./canvas/Canvas"
import { SIDEBAR_INITIAL_WIDTH } from "./constants"
import { AddBoardPanel } from "./floating-panels/catalog-panel/AddBoardPanel"
import { AddFontCollectionPanel } from "./floating-panels/catalog-panel/AddFontCollectionPanel"
import { AddThemePanel } from "./floating-panels/catalog-panel/AddThemePanel"
import { InsertVariantPanel } from "./floating-panels/catalog-panel/InsertVariantPanel"
import { ImageUploadPanel } from "./floating-panels/image-upload-panel/ImageUploadPanel"
import { ObjectsSidebar } from "./sidebars/objects/ObjectsSidebar"
import { PropertiesSidebar } from "./sidebars/properties/PropertiesSidebar"

export default function Editor() {
  const { showPanels } = useEditorConfig()
  const { isInPreviewMode } = usePreview()
  const showSidePanels = showPanels && !isInPreviewMode

  return (
    <main style={styles.main}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          style={{ flex: 1 }}
          key={isInPreviewMode ? "preview" : "editor"}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <Allotment proportionalLayout={false}>
            <Allotment.Pane
              minSize={280}
              maxSize={600}
              preferredSize={SIDEBAR_INITIAL_WIDTH}
              visible={showSidePanels}
              priority={LayoutPriority.Low}
            >
              <div style={styles.objectsPane}>
                <ObjectsSidebar />
              </div>
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
        </motion.div>
      </AnimatePresence>

      <ImageUploadPanel.Controller />
      <InsertVariantPanel.Controller />
      <AddBoardPanel.Controller />
      <AddThemePanel.Controller />
      <AddFontCollectionPanel.Controller />
      <EditorShortcuts />
    </main>
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
    backgroundColor: "#1F1F1F",
  },
}

const EditorShortcuts = () => {
  useEditorShortcuts()
  return null
}
