"use client"

import { useCurrentProject } from "@lib/api/hooks/use-current-project"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useEditorShortcuts } from "@lib/hooks/use-editor-shortcuts"
import { usePreview } from "@lib/hooks/use-preview"
import { Allotment, LayoutPriority } from "allotment"
import { AnimatePresence, motion } from "framer-motion"
import { CSSProperties } from "react"

import { Canvas } from "./canvas/Canvas"
import { PROPERTIES_PANEL_INITIAL_WIDTH } from "./constants"
import { ActionDebugger } from "./floating-panels/ActionDebugger"
import { AddBoardPanel } from "./floating-panels/catalog-panel/AddBoardPanel"
import { InsertVariantPanel } from "./floating-panels/catalog-panel/InsertVariantPanel"
import { ImageUploadPanel } from "./floating-panels/image-upload-panel/ImageUploadPanel"
import { ObjectsPanel } from "./objects-panel/ObjectsPanel"
import { PropertiesPaneNew } from "./properties-panel/properties-pane/PropertiesPaneNew"
import { Spinner } from "./seldon/custom/Spinner"
import { Toasts } from "./toaster/Toaster"

export default function Editor() {
  const { showPanels } = useEditorConfig()
  const { isInPreviewMode } = usePreview()
  const { isLoading } = useCurrentProject()
  const showSidePanels = showPanels && !isInPreviewMode

  // Panel visibility is controlled by the activeDialog state in useTool

  return (
    <main style={styles.main}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          className="flex-1"
          key={isInPreviewMode ? "preview" : "editor"}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <Allotment className="flex-1" proportionalLayout={false}>
            <Allotment.Pane
              minSize={280}
              maxSize={600}
              preferredSize={PROPERTIES_PANEL_INITIAL_WIDTH}
              visible={showSidePanels}
              priority={LayoutPriority.Low}
              className="z-[1] bg-background"
            >
              {isLoading ? <Spinner /> : <ObjectsPanel />}
            </Allotment.Pane>
            <Allotment.Pane priority={LayoutPriority.High}>
              <Canvas />
            </Allotment.Pane>
            <Allotment.Pane
              minSize={200}
              maxSize={420}
              preferredSize={PROPERTIES_PANEL_INITIAL_WIDTH}
              visible={showSidePanels}
              priority={LayoutPriority.Low}
            >
              <PropertiesPaneNew />
            </Allotment.Pane>
          </Allotment>
        </motion.div>
      </AnimatePresence>

      {/* Toaster for error messages */}
      <Toasts />

      {/* Floating panels */}
      <ImageUploadPanel.Controller />
      <InsertVariantPanel.Controller />
      <AddBoardPanel.Controller />
      {import.meta.env.DEV && <ActionDebugger />}
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
}

// This is a trick to avoid re-rendering the Editor component when changes occur within the useEditorShortcuts hook
const EditorShortcuts = () => {
  useEditorShortcuts()
  return null
}
