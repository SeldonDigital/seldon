"use client"

import { LoadEditorFonts } from "@components/LoadEditorFonts"
import { Providers } from "@components/Providers"
import { Fonts } from "@components/seldon/Fonts"
import { Toasts } from "@components/toaster/Toaster"
import { UnifiedHeader } from "@components/unified-header/UnifiedHeader"
import { useAppState } from "@lib/hooks/use-app-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { CSSProperties, PropsWithChildren } from "react"

export function Layout({
  children,
  testId,
}: PropsWithChildren<{ testId?: string }>) {
  // const { showPanels } = useEditorConfig()
  // const { appState } = useAppState()

  // In project view, we always show the header
  // const shouldShowHeader = appState === "project" || showPanels

  return (
    <Providers>
      <Fonts />
      <LoadEditorFonts />
      <div style={styles.layout} data-testid={testId}>
        {/* Header is always visible in project view, or when panels are shown in other views */}
        {/* {shouldShowHeader && <UnifiedHeader />} */}

        {/* Main content area */}
        {children}
      </div>
      <Toasts />
    </Providers>
  )
}

const styles: Record<string, CSSProperties> = {
  layout: {
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    overflowY: "auto",
    color: "white",
    backgroundColor: "black",
  },
}
