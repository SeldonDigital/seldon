"use client"

import { Allotment, LayoutPriority } from "allotment"
import { AnimatePresence, motion } from "framer-motion"
import { CSSProperties } from "react"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useEditorShortcuts } from "@lib/hooks/use-editor-shortcuts"
import { usePreview } from "@lib/hooks/use-preview"
import { Canvas } from "../canvas/Canvas"
import { SIDEBAR_INITIAL_WIDTH } from "../constants"
import { FocusRingOverlay } from "../focus/FocusRingOverlay"
import { AiChatPanel } from "../panels/ai-chat-panel/AiChatPanel"
import { ImageUploadPanel } from "../panels/image-upload-panel/ImageUploadPanel"
import { VMBoardsDialog } from "../dialogs/boards/VMBoardsDialog"
import { VMComponentsDialog } from "../dialogs/components/VMComponentsDialog"
import { VMFontCollectionsDialog } from "../dialogs/font-collections/VMFontCollectionsDialog"
import { VMIconSetsDialog } from "../dialogs/icon-sets/VMIconSetsDialog"
import { VMThemesDialog } from "../dialogs/themes/VMThemesDialog"
import { VMObjectsSidebar } from "../sidebars/objects/VMObjectsSidebar"
import { VMPropertiesSidebar } from "../sidebars/properties/VMPropertiesSidebar"

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
                <VMObjectsSidebar />
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
              <VMPropertiesSidebar />
            </Allotment.Pane>
          </Allotment>
        </motion.div>
      </AnimatePresence>

      <ImageUploadPanel.Controller />
      <VMComponentsDialog />
      <VMBoardsDialog />
      <VMThemesDialog />
      <VMFontCollectionsDialog />
      <VMIconSetsDialog />
      <AiChatPanel.Controller />
      <FocusRingOverlay />
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
    backgroundColor: "var(--sdn-swatch-offBlack)",
  },
}

const EditorShortcuts = () => {
  useEditorShortcuts()
  return null
}
