"use client"

import { Allotment, LayoutPriority } from "allotment"
import { AnimatePresence, motion } from "framer-motion"
import { CSSProperties } from "react"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useEditorShortcuts } from "@lib/hooks/use-editor-shortcuts"
import { usePreview } from "@lib/hooks/use-preview"
import { Frame } from "@seldon/components/frames/Frame"
import { Canvas } from "../canvas/Canvas"
import { SIDEBAR_INITIAL_WIDTH } from "../constants"
import { VMBoardsDialog } from "../dialogs/boards/VMBoardsDialog"
import { VMComponentsDialog } from "../dialogs/components/VMComponentsDialog"
import { VMFontCollectionsDialog } from "../dialogs/font-collections/VMFontCollectionsDialog"
import { VMIconSetsDialog } from "../dialogs/icon-sets/VMIconSetsDialog"
import { VMImageUploadDialog } from "../dialogs/image-upload/VMImageUploadDialog"
import { VMThemesDialog } from "../dialogs/themes/VMThemesDialog"
import { FocusRingOverlay } from "../focus/FocusRingOverlay"
import { VMHari } from "../palettes/hari/VMHari"
import { VMObjectsSidebar } from "../sidebars/objects/VMObjectsSidebar"
import { VMPropertiesSidebar } from "../sidebars/properties/VMPropertiesSidebar"

export default function Editor() {
  const { showPanels } = useEditorConfig()
  const { isInPreviewMode } = usePreview()
  const showSidePanels = showPanels && !isInPreviewMode

  return (
    <Frame wrapperElement="main" style={styles.main}>
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
              <Frame style={styles.objectsPane}>
                <VMObjectsSidebar />
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
              <VMPropertiesSidebar />
            </Allotment.Pane>
          </Allotment>
        </motion.div>
      </AnimatePresence>

      <VMImageUploadDialog />
      <VMComponentsDialog />
      <VMBoardsDialog />
      <VMThemesDialog />
      <VMFontCollectionsDialog />
      <VMIconSetsDialog />
      <VMHari />
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
